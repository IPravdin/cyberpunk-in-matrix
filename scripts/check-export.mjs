import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { extname, join, relative, resolve, sep } from 'node:path';

const root = process.cwd();
const output = resolve(root, process.argv[2] ?? 'out');
const require = createRequire(join(root, 'package.json'));
const { load } = require('cheerio');
const ts = require('typescript');
const snapshot = join(root, 'legacy', 'pages');
const expectedPages = readdirSync(snapshot).filter((name) => name.endsWith('.html')).sort();
const assetHashes = JSON.parse(readFileSync(join(root, 'legacy', 'asset-hashes.json'), 'utf8'));
const errors = [];
const resources = new Set();
const stylesheets = new Set();
const cssQueue = [];
let embeds = 0;
let localReferences = 0;
let routeSegments = 0;
let serializedPayloads = 0;

const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();
// App Router serializes initial-scale=1 instead of the equivalent legacy 1.0.
// Retain every token and its order so missing, extra, or conflicting values fail.
const normalizeViewport = (value) => value?.split(',').map((token) => {
  const [name, ...parts] = token.trim().split('=');
  const content = parts.join('=').trim();
  const normalized = /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(content)
    ? String(Number(content)) : content;
  return parts.length ? `${name.trim().toLowerCase()}=${normalized}` : name.toLowerCase();
});
const label = (path) => relative(root, path);
const allFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? allFiles(path) : [path];
});

function fail(message) {
  errors.push(message);
}

function checkReference(reference, owner, externalAllowed = false) {
  if (!reference || /^(?:data:|#|mailto:|tel:)/i.test(reference)) return;
  if (/^\s*javascript:/i.test(reference)) {
    fail(`${label(owner)}: inert JavaScript reference ${reference}`);
    return;
  }
  let parsed;
  try {
    parsed = new URL(reference, `https://export.invalid/${relative(output, owner).split(sep).join('/')}`);
  } catch {
    fail(`${label(owner)}: malformed asset URL ${reference}`);
    return;
  }
  if (parsed.origin !== 'https://export.invalid') {
    if (!externalAllowed) fail(`${label(owner)}: remote dependency ${reference}`);
    return;
  }
  let path;
  try {
    path = resolve(output, `.${decodeURIComponent(parsed.pathname)}`);
  } catch {
    fail(`${label(owner)}: malformed asset URL ${reference}`);
    return;
  }
  if (path !== output && !path.startsWith(`${output}${sep}`)) {
    fail(`${label(owner)}: reference outside export ${reference}`);
    return;
  }
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  localReferences += 1;
  resources.add(path);
  if (!existsSync(path) || !statSync(path).isFile()) {
    fail(`${label(owner)}: missing ${reference}`);
    return;
  }
  if (extname(path) === '.css' && !stylesheets.has(path)) cssQueue.push(path);
}

function checkCSS(source, owner) {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of css.matchAll(/url\(\s*(?:(["'])(.*?)\1|([^)]*?))\s*\)/gs)) {
    const reference = (match[2] ?? match[3]).trim().replace(/\\([()\s"'])/g, '$1');
    checkReference(reference, owner);
  }
  for (const match of css.matchAll(/@import\s+(["'])(.*?)\1/g)) {
    checkReference(match[2], owner);
  }
}

function pageContract(source) {
  const $ = load(source);
  return {
    title: $('title').text(),
    language: $('html').attr('lang'),
    bodyClasses: ($('body').attr('class') ?? '').split(/\s+/).filter(Boolean).sort(),
    content: normalizeText($('#wsite-content').text()),
    headings: $('#wsite-content h1, #wsite-content h2, #wsite-content h3')
      .toArray().map((element) => normalizeText($(element).text())),
    metadata: $('meta[property^="og:"]').toArray().map((element) => ({
      property: $(element).attr('property'), content: $(element).attr('content'),
    })).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
    viewport: normalizeViewport($('meta[name="viewport"]').attr('content')),
    favicon: $('link[rel="icon"]').attr('href'),
    links: $('a[href]').toArray().map((element) => ({
      href: $(element).attr('href'), text: normalizeText($(element).text()),
      target: $(element).attr('target') ?? null,
    })),
    images: $('img').toArray().map((element) => ({
      src: $(element).attr('src'), alt: $(element).attr('alt') ?? null,
    })),
    embeds: $('iframe').toArray().map((element) => ({
      src: $(element).attr('src'), title: $(element).attr('title') ?? null,
      loading: $(element).attr('loading') ?? null,
      fullscreen: $(element).attr('allowfullscreen') !== undefined,
      frameborder: $(element).attr('frameborder') ?? null,
      allow: $(element).attr('allow') ?? null,
    })),
    backgrounds: $('.wsite-section').toArray().flatMap((element) => {
      const authored = `${$(element).attr('style') ?? ''} ${$(element).attr('class') ?? ''}`;
      return [...authored.matchAll(/background-image:\s*url\(["']?([^"')]+)["']?\)/g)]
        .map((match) => match[1]);
    }),
  };
}

function checkGeneratedChunk(chunk, owner) {
  assert.equal(typeof chunk, 'string');
  const parsed = new URL(chunk, 'https://export.invalid');
  assert.equal(parsed.origin, 'https://export.invalid');
  assert(/^\/_next\/static\/(?:chunks|css)\/.+\.(?:js|css)$/.test(parsed.pathname));
  checkReference(chunk, owner);
}

function checkInlineScript(source, owner, flight) {
  // Parsing statements keeps semicolons/newlines inside JSON strings intact.
  // Only exact framework expressions with JSON arguments are accepted; none
  // of the exported JavaScript is executed by this checker.
  const parsed = ts.createSourceFile('inline.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  assert.equal(parsed.parseDiagnostics.length, 0);
  assert(parsed.statements.length > 0);
  for (const statement of parsed.statements) {
    assert(ts.isExpressionStatement(statement));
    const expression = statement.expression.getText(parsed);
    const request = expression.match(/^self\.__next_r=([\s\S]+)$/);
    if (request) {
      assert.equal(typeof JSON.parse(request[1]), 'string');
      continue;
    }
    const initial = expression.match(/^\(self\.__next_f=self\.__next_f\|\|\[\]\)\.push\(([\s\S]+)\)$/);
    const data = expression.match(/^self\.__next_f\.push\(([\s\S]+)\)$/);
    if (initial || data) {
      const payload = JSON.parse((initial ?? data)[1]);
      assert(Array.isArray(payload));
      // These four discriminants and payload types come from the installed
      // Next.js server/app-render/use-flight-response.js, not a loose JS allowlist.
      if (initial) {
        assert.deepEqual(payload, [0]);
        assert.equal(flight.bootstraps, 0);
        flight.bootstraps += 1;
      } else {
        assert.equal(flight.bootstraps, 1);
        assert.equal(payload.length, 2);
        assert([1, 2, 3].includes(payload[0]));
        if (payload[0] === 1 || payload[0] === 3) {
          assert.equal(typeof payload[1], 'string');
          if (payload[0] === 3) {
            assert(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(payload[1]));
            const bytes = Buffer.from(payload[1], 'base64');
            assert.equal(bytes.toString('base64'), payload[1]);
            flight.chunks.push(bytes);
          } else {
            flight.chunks.push(Buffer.from(payload[1]));
          }
        }
        // Type 2 carries the formState's unknown JSON value, as declared by Next.
      }
      continue;
    }
    const turbo = expression.match(/^\(globalThis\["TURBOPACK"\] \|\| \(globalThis\["TURBOPACK"\] = \[\]\)\)\.push\(([\s\S]+)\)$/);
    assert(turbo, 'Unexpected inline expression');
    const bootstrap = JSON.parse(turbo[1]);
    assert.deepEqual(Object.keys(bootstrap).sort(), ['otherChunks', 'runtimeModuleIds']);
    assert(Array.isArray(bootstrap.runtimeModuleIds) && bootstrap.runtimeModuleIds.every(Number.isInteger));
    assert(Array.isArray(bootstrap.otherChunks));
    for (const chunk of bootstrap.otherChunks) {
      assert(typeof chunk === 'string' && /^static\/chunks\/[a-zA-Z0-9_./-]+\.(?:js|css)$/.test(chunk));
      checkGeneratedChunk(`/_next/${chunk}`, owner);
    }
  }
}

function checkFlightChunks(flight, owner) {
  // Flight rows may span script tags. Text/binary rows are length-prefixed;
  // skipping their exact bytes prevents text containing newlines from being
  // mistaken for module-import records. Framing follows React's bundled client.
  const bytes = Buffer.concat(flight.chunks);
  const models = new Map();
  const imports = [];
  const hints = [];
  let offset = 0;
  while (offset < bytes.length) {
    const separator = bytes.indexOf(58, offset);
    assert(separator !== -1, 'Incomplete Flight row');
    const id = bytes.subarray(offset, separator).toString();
    offset = separator + 1;
    const character = String.fromCharCode(bytes[offset]);
    // Resource hint rows intentionally have no identifier (":HL...").
    assert(/^[a-f\d]+$/.test(id) || (id === '' && character === 'H'), 'Invalid Flight row identifier');
    if ('TAOobUSsLlGgMmV'.includes(character)) {
      const comma = bytes.indexOf(44, offset + 1);
      assert(comma !== -1, 'Incomplete length-prefixed Flight row');
      const length = bytes.subarray(offset + 1, comma).toString();
      assert(/^[a-f\d]+$/.test(length));
      const size = Number.parseInt(length, 16);
      assert(Number.isSafeInteger(size) && size <= bytes.length - comma - 1);
      offset = comma + 1;
      if (character === 'T') models.set(id, bytes.subarray(offset, offset + size).toString());
      offset += size;
      continue;
    }
    const tagged = /^[A-Z#rx]$/.test(character);
    if (tagged) offset += 1;
    const newline = bytes.indexOf(10, offset);
    assert(newline !== -1, 'Incomplete Flight row');
    const value = bytes.subarray(offset, newline).toString();
    if (!tagged) models.set(id, JSON.parse(value));
    else if (character === 'I') imports.push(JSON.parse(value));
    else if (character === 'H') hints.push({ kind: value[0], value: JSON.parse(value.slice(1)) });
    offset = newline + 1;
  }

  const resolveModel = (value) => {
    const visited = new Set();
    while (typeof value === 'string' && /^\$[a-f\d]+$/.test(value)) {
      const id = value.slice(1);
      assert(!visited.has(id) && models.has(id), 'Unresolved Flight module reference');
      visited.add(id);
      value = models.get(id);
    }
    return value;
  };
  for (const metadata of imports) {
    assert(Array.isArray(metadata) && (metadata.length === 3 || metadata.length === 4));
    const id = resolveModel(metadata[0]);
    assert(typeof id === 'string' || Number.isInteger(id));
    const chunks = resolveModel(metadata[1]);
    assert(Array.isArray(chunks));
    assert.equal(typeof resolveModel(metadata[2]), 'string');
    if (metadata.length === 4) assert.equal(metadata[3], 1);
    // Installed React Server DOM Turbopack loads each entry directly by URL.
    for (const chunk of chunks) checkGeneratedChunk(resolveModel(chunk), owner);
  }
  for (const hint of hints) {
    if (hint.kind !== 'L') continue;
    const values = resolveModel(hint.value);
    assert(Array.isArray(values) && typeof values[0] === 'string');
    const href = resolveModel(values[0]);
    checkReference(href, owner);
  }
  // Server component models also carry script/style URLs without I records.
  // Walk the parsed JSON data, including model strings, without reviving React
  // objects or running their contents.
  const checkModelResources = (value) => {
    if (typeof value === 'string') {
      if (value.startsWith('/_next/')) checkReference(value, owner);
    } else if (Array.isArray(value)) value.forEach(checkModelResources);
    else if (value && typeof value === 'object') Object.values(value).forEach(checkModelResources);
  };
  for (const model of models.values()) checkModelResources(model);
}

function checkRouteSegments() {
  for (const filename of expectedPages.filter((name) => name !== 'index.html')) {
    const route = filename.slice(0, -5);
    const directory = join(output, route);
    const expected = ['__next._full.txt', '__next._tree.txt', `__next.${route}.__PAGE__.txt`].sort();
    assert(statSync(join(output, filename)).isFile(), `${filename} must be a physical HTML file.`);
    const entries = readdirSync(directory, { withFileTypes: true });
    assert(entries.every((entry) => entry.isFile()), `Unexpected nested segment directory: ${route}`);
    assert.deepEqual(entries.map((entry) => entry.name).sort(), expected, `Unexpected segment files: ${route}`);
    for (const name of expected) checkReference(`/${route}/${name}`, join(output, filename));
    routeSegments += entries.length;
  }
}

function checkSerializedPayloads() {
  for (const filename of expectedPages) {
    const name = `${filename.slice(0, -5)}.txt`;
    if (!existsSync(join(output, name)) || !statSync(join(output, name)).isFile()) {
      fail(`Missing complete App Router response: ${name}`);
    }
  }
  // Include complete responses and the unmodified root/error/page segments.
  for (const path of allFiles(output).filter((file) => extname(file) === '.txt')) {
    try {
      const bytes = readFileSync(path);
      assert(bytes.length > 0, 'Empty serialized response');
      checkFlightChunks({ chunks: [bytes] }, path);
      serializedPayloads += 1;
    } catch (error) {
      fail(`${label(path)}: invalid generated Flight response (${error.message})`);
    }
  }
}

function checkHTML(path) {
  const source = readFileSync(path, 'utf8');
  const $ = load(source);
  const flight = { bootstraps: 0, chunks: [] };
  if ($('#__NEXT_DATA__').length) fail(`${label(path)}: unexpected Pages Router data`);
  $('*').each((_, element) => {
    const attributes = element.attribs ?? {};
    for (const attribute of Object.keys(attributes)) {
      if (/^on/i.test(attribute)) fail(`${label(path)}: inline event handler ${attribute}`);
    }
    if (attributes.href) checkReference(attributes.href, path);
    if (attributes.src) {
      if (element.tagName === 'script' && !attributes.src.startsWith('/_next/')) {
        fail(`${label(path)}: script outside generated /_next/ resources ${attributes.src}`);
      }
      checkReference(attributes.src, path, element.tagName === 'iframe');
      if (element.tagName === 'iframe') embeds += 1;
    }
    if (attributes.poster) checkReference(attributes.poster, path);
    if (attributes.srcset) {
      for (const candidate of attributes.srcset.split(',')) {
        checkReference(candidate.trim().split(/\s+/)[0], path);
      }
    }
    if (attributes.style) checkCSS(attributes.style, path);
  });
  $('style').each((_, element) => checkCSS($(element).text(), path));
  $('script:not([src])').each((_, element) => {
    try {
      checkInlineScript($(element).text(), path, flight);
    } catch (error) {
      fail(`${label(path)}: invalid generated inline script (${error.message})`);
    }
  });
  if (expectedPages.includes(relative(output, path))) {
    if (flight.bootstraps !== 1 || !flight.chunks.some((chunk) => chunk.length)) {
      fail(`${label(path)}: missing App Router Flight bootstrap or data`);
    }
    if (!$('script[src^="/_next/"]').length) fail(`${label(path)}: missing generated App Router scripts`);
  }
  try {
    checkFlightChunks(flight, path);
  } catch (error) {
    fail(`${label(path)}: invalid generated Flight data (${error.message})`);
  }
}

if (!existsSync(output)) throw new Error(`Missing export directory: ${output}`);
assert.equal(expectedPages.length, 12, 'The archive must contain the twelve original pages.');
assert.equal(Object.keys(assetHashes).length, 51, 'The rollback asset manifest must contain 51 assets.');
assert(existsSync(join(root, 'src', 'app')) || existsSync(join(root, 'app')), 'Missing App Router source directory.');
assert(!existsSync(join(root, 'src', 'pages')) && !existsSync(join(root, 'pages')), 'Pages Router source remains active.');
const exportedPages = allFiles(output).filter((path) => extname(path) === '.html');
const permittedPages = new Set([...expectedPages, '404.html', '_global-not-found.html', '_not-found.html']);
for (const path of exportedPages) {
  const name = relative(output, path).split(sep).join('/');
  if (!permittedPages.has(name)) fail(`Unexpected exported HTML: ${name}`);
}
for (const filename of expectedPages) {
  const path = join(output, filename);
  if (!existsSync(path) || !statSync(path).isFile()) {
    fail(`Missing original HTML file: ${filename}`);
    continue;
  }
  const actual = pageContract(readFileSync(path, 'utf8'));
  const expected = pageContract(readFileSync(join(snapshot, filename), 'utf8'));
  for (const key of Object.keys(expected)) {
    try {
      assert.deepEqual(actual[key], expected[key]);
    } catch (error) {
      fail(`${filename}: ${key} contract differs\n${error.message}`);
    }
  }
}
if (!existsSync(join(output, '404.html'))) fail('Missing generated static 404.html page.');
for (const path of exportedPages) checkHTML(path);
try {
  checkRouteSegments();
} catch (error) {
  fail(`Invalid route segment resources (${error.message})`);
}
checkSerializedPayloads();
while (cssQueue.length) {
  const stylesheet = cssQueue.shift();
  if (stylesheets.has(stylesheet)) continue;
  stylesheets.add(stylesheet);
  checkCSS(readFileSync(stylesheet, 'utf8'), stylesheet);
}

// Next's browser page manifest can point to chunks loaded after navigation.
const generated = join(output, '_next');
if (!existsSync(generated)) fail('Missing generated /_next/ resources.');
else {
  for (const manifest of allFiles(generated).filter((path) => path.endsWith('_buildManifest.js'))) {
    for (const match of readFileSync(manifest, 'utf8').matchAll(/["'](static\/[^"']+\.(?:js|css))["']/g)) {
      checkReference(`/_next/${match[1]}`, manifest);
    }
  }
}
while (cssQueue.length) {
  const stylesheet = cssQueue.shift();
  if (stylesheets.has(stylesheet)) continue;
  stylesheets.add(stylesheet);
  checkCSS(readFileSync(stylesheet, 'utf8'), stylesheet);
}
for (const [asset, expectedHash] of Object.entries(assetHashes)) {
  const path = join(output, asset);
  if (!existsSync(path)) {
    fail(`Missing retained asset: ${asset}`);
    continue;
  }
  const actualHash = createHash('sha256').update(readFileSync(path)).digest('hex');
  if (actualHash !== expectedHash) fail(`Retained asset bytes changed: ${asset}`);
}
if (embeds !== 22) fail(`Expected 22 external embeds; found ${embeds}.`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS: 12 exported pages match the legacy content and metadata; 22 embeds; 51 unchanged asset hashes; ${routeSegments} route segment payloads retained; ${serializedPayloads} Flight responses validated; ${localReferences} local references resolve across ${stylesheets.size} stylesheets and generated Next.js scripts.`);
}

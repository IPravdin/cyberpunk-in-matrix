import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import { load } from "cheerio";

const output = resolve(process.argv[2] ?? "out");
const pages = JSON.parse(readFileSync("tests/fixtures/pages.json", "utf8"));
const errors = [];
const checkedCSS = new Set();
const cssQueue = [];
let references = 0;
const normalize = (value) => value.replace(/\s+/g, " ").trim();
const files = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });

function checkReference(reference, owner, external = false) {
  if (!reference || /^(?:data:|#|mailto:|tel:)/i.test(reference)) return;
  const url = new URL(
    reference,
    "https://export.invalid/" + relative(output, owner).split(sep).join("/"),
  );
  if (url.origin !== "https://export.invalid") {
    if (!external)
      errors.push(relative(output, owner) + ": remote resource " + reference);
    return;
  }
  let path = resolve(output, "." + decodeURIComponent(url.pathname));
  if (path !== output && !path.startsWith(output + sep)) {
    errors.push("Reference outside export: " + reference);
    return;
  }
  if (!extname(path) && existsSync(path + ".html")) path += ".html";
  else if (existsSync(path) && statSync(path).isDirectory())
    path = join(path, "index.html");
  references += 1;
  if (!existsSync(path) || !statSync(path).isFile()) {
    errors.push(relative(output, owner) + ": missing " + reference);
  } else if (extname(path) === ".css" && !checkedCSS.has(path))
    cssQueue.push(path);
}

function checkCSS(source, owner) {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const match of css.matchAll(
    /url\(\s*(?:(["'])(.*?)\1|([^)]*?))\s*\)/gs,
  )) {
    checkReference(
      (match[2] ?? match[3]).trim().replace(/\\([()\s"'])/g, "$1"),
      owner,
    );
  }
  for (const match of css.matchAll(/@import\s+(["'])(.*?)\1/g))
    checkReference(match[2], owner);
}

assert(existsSync(output), "Build the static export before checking it.");
for (const fixture of pages) {
  const filename =
    (fixture.path === "/" ? "index" : fixture.path.slice(1)) + ".html";
  const path = join(output, filename);
  assert(existsSync(path), "Missing page: " + filename);
  const $ = load(readFileSync(path, "utf8"));
  const actual = {
    path: fixture.path,
    title: $("title").text(),
    contentHash: createHash("sha256")
      .update(normalize($("#wsite-content").text()))
      .digest("hex"),
    headings: $("#wsite-content h1, #wsite-content h2, #wsite-content h3")
      .toArray()
      .map((element) => normalize($(element).text())),
    links: $("a[href]")
      .toArray()
      .map((element) => ({
        href: $(element).attr("href"),
        text: normalize($(element).text()),
        target: $(element).attr("target") ?? null,
      })),
    images: $("img")
      .toArray()
      .map((element) => ({
        src: $(element).attr("src"),
        alt: $(element).attr("alt") ?? null,
      })),
    embeds: $("iframe")
      .toArray()
      .map((element) => ({
        src: $(element).attr("src"),
        title: $(element).attr("title") ?? null,
        loading: $(element).attr("loading") ?? null,
        fullscreen: $(element).attr("allowfullscreen") !== undefined,
      })),
  };
  assert.deepEqual(actual, fixture, filename + ": page content changed");
  assert.equal(
    $("html").attr("lang"),
    "en",
    filename + ": document language changed",
  );
  assert(
    $('script[src^="/_next/"]').length,
    filename + ": missing Next.js runtime",
  );
  assert(
    existsSync(join(output, filename.replace(/\.html$/, ".txt"))),
    filename + ": missing route payload",
  );
}
assert(existsSync(join(output, "404.html")), "Missing static 404 page");
for (const path of files(output)) {
  if (extname(path) === ".html") {
    const $ = load(readFileSync(path, "utf8"));
    $("[href], [src], [poster], [srcset], [style]").each((_, element) => {
      for (const attribute of ["href", "src", "poster"]) {
        if (element.attribs[attribute])
          checkReference(
            element.attribs[attribute],
            path,
            element.tagName === "iframe" ||
              (element.tagName === "a" && attribute === "href"),
          );
      }
      for (const candidate of (element.attribs.srcset ?? "")
        .split(",")
        .filter(Boolean)) {
        checkReference(candidate.trim().split(/\s+/)[0], path);
      }
      if (element.attribs.style) checkCSS(element.attribs.style, path);
    });
    $("style").each((_, element) => checkCSS($(element).text(), path));
  } else if (extname(path) === ".txt") {
    const payload = readFileSync(path, "utf8");
    assert(payload.length, relative(output, path) + ": empty route payload");
    for (const match of payload.matchAll(/\/_next\/static\/[^"\\\s,\]]+/g))
      checkReference(match[0], path);
  }
}
while (cssQueue.length) {
  const path = cssQueue.shift();
  if (checkedCSS.has(path)) continue;
  checkedCSS.add(path);
  checkCSS(readFileSync(path, "utf8"), path);
}
assert.deepEqual(errors, [], "Export contains unresolved references");
console.log(
  "PASS: " +
    pages.length +
    " pages retain their content, links, and media; " +
    references +
    " local references resolve across " +
    checkedCSS.size +
    " stylesheets.",
);

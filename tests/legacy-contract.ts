import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'cheerio';
import { expect, type BrowserContext, type Page, type Request, type Response } from '@playwright/test';

export const legacyURL = 'http://127.0.0.1:4174';
export const migrationTarget = process.env.MIGRATION_TARGET ?? 'next';
const snapshotDirectory = join(process.cwd(), 'legacy', 'pages');
// Next's App Router initializes this exact Flight bootstrap in
// next/dist/server/app-render/use-flight-response.js.
const appRouterBootstrap = '(self.__next_f=self.__next_f||[]).push([0])';

export const routes = readdirSync(snapshotDirectory)
  .filter((name) => name.endsWith('.html'))
  .sort()
  .map((filename) => ({ filename, path: filename === 'index.html' ? '/' : `/${filename}` }));

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function pageDestination(path: string): string {
  return migrationTarget === 'legacy' ? path : path.replace(/\.html$/, '');
}

export function legacyContract(filename: string) {
  const $ = load(readFileSync(join(snapshotDirectory, filename), 'utf8'));
  return {
    title: $('title').text(),
    language: $('html').attr('lang'),
    bodyClasses: ($('body').attr('class') ?? '').split(/\s+/)
      .filter((name) => name && !['nav-open', 'affix'].includes(name))
      // These original markers have no CSS rules or interaction behavior.
      .filter((name) => migrationTarget === 'legacy'
        || (!name.startsWith('wsite-page-') && !['header-page', 'alt-nav-off'].includes(name))).sort(),
    content: normalizeText($('#wsite-content').text()),
    headings: $('#wsite-content h1, #wsite-content h2, #wsite-content h3')
      .toArray().map((element) => normalizeText($(element).text())),
    metadata: $('meta[property^="og:"]').toArray().map((element) => ({
      property: $(element).attr('property'),
      content: $(element).attr('content'),
    })).sort((left, right) => `${left.property}:${left.content}`
      .localeCompare(`${right.property}:${right.content}`)),
    links: $('a[href]').toArray().map((element) => {
      const href = $(element).attr('href');
      return {
        href: href === undefined ? undefined : pageDestination(href),
        text: normalizeText($(element).text()),
        target: $(element).attr('target') ?? null,
      };
    }),
    images: $('img').toArray().map((element) => ({
      src: $(element).attr('src'),
      alt: $(element).attr('alt') ?? null,
    })),
    embeds: $('iframe').toArray().map((element) => ({
      src: $(element).attr('src'),
      title: $(element).attr('title') ?? null,
      loading: $(element).attr('loading') ?? null,
      fullscreen: $(element).attr('allowfullscreen') !== undefined,
    })),
    backgrounds: $('[style]').toArray().flatMap((element) => {
      const style = $(element).attr('style') ?? '';
      return [...style.matchAll(/background-image:\s*url\(["']?([^"')]+)["']?\)/g)]
        .map((match) => match[1]);
    }),
  };
}

export async function stubExternalEmbeds(context: BrowserContext) {
  await context.route('https://www.youtube.com/embed/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><html lang="en"><title>Offline video fixture</title><body></body></html>',
  }));
}

export async function expectAppRouter(page: Page, response: Response | null) {
  if (!response) throw new Error('App Router identity requires the navigation response');
  // Inspect the actual document response: Playwright text locators intentionally
  // skip script nodes, and hydration may consume transport instructions.
  const $ = load(await response.text());
  const inlineScripts = $('script:not([src])').toArray().map((script) => $(script).text());
  expect(inlineScripts.filter((script) => script === appRouterBootstrap)).toHaveLength(1);
  expect(inlineScripts.some((script) => script.startsWith('self.__next_f.push([1,'))).toBe(true);
  expect($('script#__NEXT_DATA__')).toHaveLength(0);
  await expect(page.locator('script#__NEXT_DATA__')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => {
    const runtime = window as Window & { __next_f?: unknown[]; __NEXT_DATA__?: unknown };
    return Array.isArray(runtime.__next_f) && runtime.__NEXT_DATA__ === undefined;
  })).toBe(true);

  const browserScriptSources = await page.locator('script[src]').evaluateAll((scripts) =>
    scripts.map((script) => new URL(script.getAttribute('src') ?? '', location.href).pathname));
  const scriptSources = [
    ...$('script[src]').toArray().map((script) => new URL($(script).attr('src') ?? '', response.url()).pathname),
    ...browserScriptSources,
  ];
  expect(scriptSources.length).toBeGreaterThan(0);
  for (const source of scriptSources) {
    expect(source).toMatch(/^\/_next\//);
    expect(source).not.toMatch(/\/pages\/|\/(?:_buildManifest|_ssgManifest)\.js$/);
  }
}

export function trackNativeNavigation(page: Page) {
  const documentPaths: string[] = [];
  const incompatibleRequests: {
    url: string;
    rsc: string | null;
    prefetch: string | null;
    redirectedFrom: string | null;
  }[] = [];
  const collect = (request: Request) => {
    const url = new URL(request.url());
    if (url.hostname !== '127.0.0.1') return;
    const headers = request.headers();
    const documentNavigation = request.isNavigationRequest() && request.frame() === page.mainFrame();
    if (documentNavigation) documentPaths.push(url.pathname);
    const redirectedFrom = documentNavigation ? request.redirectedFrom()?.url() ?? null : null;
    if (url.pathname.includes('/__next.') || headers.rsc === '1'
      || headers['next-router-prefetch'] !== undefined || redirectedFrom) {
      incompatibleRequests.push({
        url: request.url(),
        rsc: headers.rsc ?? null,
        prefetch: headers['next-router-prefetch'] ?? null,
        redirectedFrom,
      });
    }
  };
  page.on('request', collect);
  return {
    assertNativeNavigation(expectedDocumentPaths: string[]) {
      page.off('request', collect);
      expect(incompatibleRequests).toEqual([]);
      expect(documentPaths).toEqual(expectedDocumentPaths);
    },
  };
}

export async function waitForLocalRendering(page: Page) {
  // Next dev injects its generated utility stylesheet after the document load
  // event. Verify a real compatibility rule before fonts/layout are measured.
  if (await page.locator('link[rel="stylesheet"][href^="/_next/"]').count()
    && await page.locator('.birdseye-header .logo').count()) {
    await expect(page.locator('.birdseye-header .logo [class~="tw:hidden!"]').first())
      .toHaveCSS('display', 'none');
  }
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        image.addEventListener('load', () => resolve(), { once: true });
        image.addEventListener('error', () => resolve(), { once: true });
      });
    }));
  });
}

export async function renderedContract(page: Page) {
  return page.evaluate(() => {
    const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
    return {
      title: document.title,
      language: document.documentElement.lang,
      bodyClasses: [...document.body.classList]
        .filter((name) => !['nav-open', 'affix'].includes(name)).sort(),
      content: normalize(document.querySelector('#wsite-content')?.textContent ?? ''),
      headings: [...document.querySelectorAll('#wsite-content h1, #wsite-content h2, #wsite-content h3')]
        .map((element) => normalize(element.textContent ?? '')),
      metadata: [...document.querySelectorAll('meta[property^="og:"]')].map((element) => ({
        property: element.getAttribute('property'),
        content: element.getAttribute('content'),
      })).sort((left, right) => `${left.property}:${left.content}`
        .localeCompare(`${right.property}:${right.content}`)),
      links: [...document.querySelectorAll('a[href]')].map((element) => ({
        href: element.getAttribute('href'),
        text: normalize(element.textContent ?? ''),
        target: element.getAttribute('target'),
      })),
      images: [...document.querySelectorAll('img')].map((element) => ({
        src: element.getAttribute('src'),
        alt: element.getAttribute('alt'),
      })),
      embeds: [...document.querySelectorAll('iframe')].map((element) => ({
        src: element.getAttribute('src'),
        title: element.getAttribute('title'),
        loading: element.getAttribute('loading'),
        fullscreen: element.hasAttribute('allowfullscreen'),
      })),
      backgrounds: [...document.querySelectorAll('.wsite-section')].flatMap((element) => {
        const background = getComputedStyle(element).backgroundImage;
        return [...background.matchAll(/url\(["']?([^"')]+)["']?\)/g)]
          .map((match) => new URL(match[1], window.location.href).pathname);
      }),
    };
  });
}

export async function expectDefinedClasses(page: Page) {
  const undefinedClasses = await page.evaluate(() => {
    const selectors: string[] = [];
    function collect(rules: CSSRuleList) {
      for (const rule of rules) {
        if (rule instanceof CSSStyleRule) selectors.push(rule.selectorText);
        if ('cssRules' in rule) collect((rule as CSSGroupingRule).cssRules);
      }
    }
    for (const sheet of document.styleSheets) collect(sheet.cssRules);
    const classes = new Set([...document.querySelectorAll('[class]')]
      .flatMap((element) => [...element.classList]));
    return [...classes].filter((name) => !selectors.some((selector) => {
      const needle = `.${CSS.escape(name)}`;
      let start = selector.indexOf(needle);
      while (start !== -1) {
        if (!/[\w\\-]/.test(selector[start + needle.length] ?? '')) return true;
        start = selector.indexOf(needle, start + needle.length);
      }
      return false;
    })).sort();
  });
  expect(undefinedClasses, 'Every rendered class must have a loaded CSS selector').toEqual([]);
}

export async function visualContract(page: Page) {
  return page.evaluate(() => {
    const selectors = [
      '.birdseye-header', '.birdseye-header > div', '.main-wrap', '#wsite-content',
      '.wsite-section', '.container', '.wsite-button', '.wsite-content-title',
      '.paragraph', '.wsite-multicol-table', 'img', 'iframe',
      'font', '#wsite-content div:empty, .banner div:empty', 'td.wsite-multicol-col',
    ];
    const properties = [
      'display', 'position', 'boxSizing', 'color', 'backgroundColor',
      'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'textAlign',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
      'maxWidth', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat',
    ] as const;
    return selectors.flatMap((selector) => [...document.querySelectorAll<HTMLElement>(selector)].map((element, index) => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      // Chromium inconsistently resolves offscreen table descendants' auto
      // horizontal margins to 0 or the used value. Their x/width geometry
      // still measures the rendered centering strictly; retain other styles.
      const measuredProperties = properties.filter((property) => selector !== '.container'
        || (property !== 'marginLeft' && property !== 'marginRight'));
      return {
        selector: `${selector}[${index}]`,
        text: element.innerText.replace(/\s+/g, ' ').trim(),
        geometry: { x: box.x, y: box.y, width: box.width, height: box.height },
        style: Object.fromEntries(measuredProperties.map((property) => [property, style[property]])),
      };
    }));
  });
}

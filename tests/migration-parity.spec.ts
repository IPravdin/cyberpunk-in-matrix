import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'cheerio';
import {
  expectAppRouter, legacyContract, legacyURL, migrationTarget, renderedContract, routes,
  stubExternalEmbeds, trackNativeNavigation, visualContract, waitForLocalRendering,
} from './legacy-contract';

test.beforeEach(async ({ context }) => {
  await stubExternalEmbeds(context);
});

test('the twelve original pages each have their own App Router folder', () => {
  expect(routes).toHaveLength(12);
  for (const { filename } of routes) {
    const directory = join(process.cwd(), 'src', 'app', filename === 'index.html' ? '(home)' : filename.slice(0, -5));
    expect(existsSync(join(directory, 'page.tsx')), filename).toBe(true);
    expect(existsSync(join(directory, 'layout.tsx')), filename).toBe(true);
  }
  expect(readdirSync(join(process.cwd(), 'src', 'app')).filter((name) => name.endsWith('.html'))).toEqual([]);
  for (const removed of ['src/content', 'src/data', 'src/app/[[...page]]']) {
    expect(existsSync(join(process.cwd(), removed)), removed).toBe(false);
  }
});

if (migrationTarget !== 'legacy') {
  test('the migration target serves an App Router homepage without the Pages runtime', async ({ page }) => {
    const response = await page.goto('/');
    await expectAppRouter(page, response);
  });
}

test('shared public assets retain the exact rollback snapshot bytes', () => {
  const hashes: Record<string, string> = JSON.parse(
    readFileSync(join(process.cwd(), 'legacy', 'asset-hashes.json'), 'utf8'),
  );
  for (const [path, expected] of Object.entries(hashes)) {
    const bytes = readFileSync(join(process.cwd(), 'public', path));
    expect(createHash('sha256').update(bytes).digest('hex'), path).toBe(expected);
  }
});

for (const route of routes) {
  test(`retains content, metadata, links, and media at ${route.path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const url = message.location().url;
      if (!url || new URL(url).hostname === '127.0.0.1') errors.push(message.text());
    });
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('#wsite-content')).toBeAttached();
    if (migrationTarget !== 'legacy') {
      await expectAppRouter(page, response);
    }
    await waitForLocalRendering(page);
    await expect(page.locator('title')).toHaveCount(1);
    expect(await renderedContract(page)).toEqual(legacyContract(route.filename));
    expect(errors).toEqual([]);
  });
}

test('retains the index.html alias and rejects missing pages', async ({ page, request }) => {
  const response = await page.goto('/index.html');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(legacyContract('index.html').title);
  if (migrationTarget !== 'legacy') {
    await expectAppRouter(page, response);
  }
  if (migrationTarget === 'next') {
    for (const { filename } of routes.filter((route) => route.filename !== 'index.html')) {
      const clean = await request.get(`/${filename.slice(0, -5)}`);
      expect(clean.status()).toBe(200);
      expect(load(await clean.text())('title').text()).toBe(legacyContract(filename).title);
    }
  }
  for (const path of ['/missing-page.html', '/missing-page', '/nested/contents.html']) {
    const missing = await request.get(path);
    expect(missing.status(), path).toBe(404);
    const html = await missing.text();
    if (migrationTarget === 'next') {
      const $ = load(html);
      expect($('html').attr('lang'), path).toBe('en');
      expect($('body').attr('class') ?? '', path).toBe('');
      expect($('.wrapper, .birdseye-header, #wsite-content, #navMobile'), path).toHaveLength(0);
      const body = $('body').clone();
      body.find('script, style').remove();
      expect(body.text().trim(), path).toBe('Page not found');
    } else {
      expect(html, path).toBe('Page not found');
    }
  }
  expect((await request.head('/the-choice.html')).status()).toBe(200);
});

test('red and blue pill choices preserve their destinations and return paths', async ({ page }) => {
  const navigation = trackNativeNavigation(page);
  await page.goto('/the-choice.html');
  await page.getByRole('link', { name: 'Take Red Pill', exact: true }).click();
  await expect(page).toHaveURL(/\/mise-en-scene\.html$/);
  await expect(page.locator('#wsite-content a[href="/tech.html"]')).toBeVisible();

  await page.goto('/the-choice.html');
  await page.getByRole('link', { name: 'Take Blue Pill', exact: true }).click();
  await expect(page).toHaveURL(/\/blue-pill\.html$/);
  const returnLink = page.locator('#wsite-content').getByRole('link');
  await expect(returnLink).toHaveAttribute('href', '/');
  await returnLink.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: /START \(Recommended\)/ })).toBeVisible();
  navigation.assertNativeNavigation([
    '/the-choice.html', '/mise-en-scene.html', '/the-choice.html', '/blue-pill.html', '/',
  ]);
});

test('all pages retain their server-rendered content, body classes, and pill navigation without JavaScript', async ({ browser }, testInfo) => {
  test.setTimeout(60_000);
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: testInfo.project.use.baseURL,
    reducedMotion: 'reduce',
  });
  await stubExternalEmbeds(context);
  try {
    const page = await context.newPage();
    for (const route of [...routes, { filename: 'index.html', path: '/index.html' }]) {
      await test.step(`server-rendered contract at ${route.path}`, async () => {
        const response = await page.goto(route.path);
        expect(response?.status()).toBe(200);
        await expect(page.locator('#wsite-content')).toBeAttached();
        await waitForLocalRendering(page);
        await expect(page.locator('title')).toHaveCount(1);
        expect(await renderedContract(page)).toEqual(legacyContract(route.filename));
      });
    }
    await page.goto('/the-choice.html');
    await expect(page.locator('#wsite-content')).toBeAttached();
    expect(await renderedContract(page)).toEqual(legacyContract('the-choice.html'));
    await page.getByRole('link', { name: 'Take Red Pill', exact: true }).click();
    await expect(page).toHaveURL(/\/mise-en-scene\.html$/);
    await expect(page.locator('#wsite-content a[href="/tech.html"]')).toBeVisible();
    await page.goto('/the-choice.html');
    await page.getByRole('link', { name: 'Take Blue Pill', exact: true }).click();
    await expect(page).toHaveURL(/\/blue-pill\.html$/);
    await page.locator('#wsite-content').getByRole('link').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('link', { name: /START \(Recommended\)/ })).toBeVisible();
  } finally {
    await context.close();
  }
});

test('mobile menu preserves inert state, focus trapping, Escape, closing, and resizing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contents.html');
  const opener = page.locator('.birdseye-header button.hamburger');
  const menu = page.locator('#navMobile');
  const closer = menu.getByRole('button', { name: 'Menu', exact: true });
  const home = menu.getByRole('link', { name: 'Home', exact: true });

  await expect(menu).toHaveAttribute('inert', '');
  await expect(opener).toHaveAttribute('aria-expanded', 'false');
  await opener.click();
  await expect(opener).toHaveAttribute('aria-expanded', 'true');
  await expect(closer).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).not.toHaveAttribute('inert');
  await expect(closer).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(home).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(closer).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(home).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('inert', '');
  await expect(opener).toBeFocused();

  await opener.click();
  await closer.click();
  await expect(menu).toHaveAttribute('inert', '');
  await expect(opener).toBeFocused();

  await opener.click();
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(menu).toHaveAttribute('inert', '');
  await expect(opener).toHaveAttribute('aria-expanded', 'false');
});

test('mobile Home navigation starts the new page with the menu closed', async ({ page }) => {
  const navigation = trackNativeNavigation(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contents.html');
  await page.locator('.birdseye-header').getByRole('button', { name: 'Menu', exact: true }).click();
  await page.locator('#navMobile').getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#navMobile')).toHaveAttribute('inert', '');
  await expect(page.locator('body')).not.toHaveClass(/nav-open/);
  navigation.assertNativeNavigation(['/contents.html', '/']);
});

test('the header becomes fixed only after the legacy scroll threshold', async ({ page }) => {
  await page.goto('/cyberpunk-the-matrix-and-post-cyberpunk.html');
  const header = page.locator('.birdseye-header');
  await page.evaluate(() => window.scrollTo(0, 50));
  await expect(page.locator('body')).not.toHaveClass(/affix/);
  await page.evaluate(() => window.scrollTo(0, 51));
  await expect(page.locator('body')).toHaveClass(/affix/);
  await expect(header).toHaveCSS('position', 'fixed');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('body')).not.toHaveClass(/affix/);
});

const visualRoutes = [
  '/', '/contents.html', '/cyberpunk-the-matrix-and-post-cyberpunk.html',
  '/the-choice.html', '/tech.html',
];

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  for (const path of visualRoutes) {
    test(`matches legacy computed layout on ${viewport.name} at ${path}`, async ({ page, context }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const legacy = await context.newPage();
      await legacy.setViewportSize({ width: viewport.width, height: viewport.height });
      await Promise.all([page.goto(path), legacy.goto(`${legacyURL}${path}`)]);
      await Promise.all([waitForLocalRendering(page), waitForLocalRendering(legacy)]);
      const [actual, expected] = await Promise.all([visualContract(page), visualContract(legacy)]);
      expect(actual.map((element) => element.selector)).toEqual(expected.map((element) => element.selector));
      for (const [index, source] of expected.entries()) {
        const target = actual[index];
        expect(target.text, source.selector).toBe(source.text);
        expect(target.style, source.selector).toEqual(source.style);
        for (const dimension of ['x', 'y', 'width', 'height'] as const) {
          expect(Math.abs(target.geometry[dimension] - source.geometry[dimension]),
            `${source.selector} ${dimension}: target ${target.geometry[dimension]}, legacy ${source.geometry[dimension]}`)
            .toBeLessThanOrEqual(1);
        }
      }
      await legacy.close();
    });
  }
}

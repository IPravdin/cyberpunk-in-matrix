import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { load } from "cheerio";
import {
  expectDefinedClasses,
  pageContract,
  pages,
  stubVideos,
  waitForRendering,
} from "./site-contract";

test.beforeEach(async ({ context }) => {
  await stubVideos(context);
});

test("every page has its own App Router source", () => {
  expect(pages).toHaveLength(12);
  for (const { path } of pages) {
    expect(
      existsSync(join(process.cwd(), "src/app", path.slice(1), "page.tsx")),
      path,
    ).toBe(true);
  }
});

for (const fixture of pages) {
  test(
    "renders content, links, media, and styles at " + fixture.path,
    async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (
          message.type() === "error" &&
          (!message.location().url ||
            new URL(message.location().url).hostname === "127.0.0.1")
        )
          errors.push(message.text());
      });
      const response = await page.goto(fixture.path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await waitForRendering(page);
      expect(await pageContract(page)).toEqual(fixture);
      await expectDefinedClasses(page);
      await expect(page.locator("body")).toHaveCSS(
        "font-family",
        "Birdseye, sans-serif",
      );
      expect(
        await page
          .locator("img")
          .evaluateAll((images) =>
            images
              .filter((image) => !(image as HTMLImageElement).naturalWidth)
              .map((image) => image.getAttribute("src")),
          ),
      ).toEqual([]);
      expect(errors).toEqual([]);
    },
  );
}

test("clean URLs and HTML aliases resolve, and missing pages return 404", async ({
  request,
}) => {
  for (const fixture of pages) {
    for (const path of [
      fixture.path,
      fixture.path === "/" ? "/index.html" : fixture.path + ".html",
    ]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(load(await response.text())("title").text(), path).toBe(
        fixture.title,
      );
    }
  }
  for (const path of [
    "/missing-page",
    "/missing-page.html",
    "/nested/contents.html",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
    const $ = load(await response.text());
    $("script, style").remove();
    expect($("body").text().trim()).toBe("Page not found");
    expect($(".birdseye-header, #wsite-content, #navMobile")).toHaveLength(0);
  }
  expect((await request.head("/the-choice")).status()).toBe(200);
});

test("red and blue pill choices preserve their destinations and return paths", async ({
  page,
}) => {
  await page.goto("/the-choice");
  await page.getByRole("link", { name: "Take Red Pill", exact: true }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/mise-en-scene");
  await expect(page.locator('#wsite-content a[href="/tech"]')).toBeVisible();
  await page.goto("/the-choice");
  await page.getByRole("link", { name: "Take Blue Pill", exact: true }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/blue-pill");
  await page.locator("#wsite-content").getByRole("link").click();
  await expect(page).toHaveURL((url) => url.pathname === "/");
  await expect(
    page.getByRole("link", { name: /START \(Recommended\)/ }),
  ).toBeVisible();
});

test("all pages and pill navigation work without JavaScript", async ({
  browser,
}, testInfo) => {
  test.setTimeout(60_000);
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: testInfo.project.use.baseURL,
    reducedMotion: "reduce",
  });
  await stubVideos(context);
  try {
    const page = await context.newPage();
    for (const fixture of pages) {
      expect((await page.goto(fixture.path))?.status()).toBe(200);
      await waitForRendering(page);
      expect(await pageContract(page)).toEqual(fixture);
    }
    await page.goto("/the-choice");
    await page
      .getByRole("link", { name: "Take Red Pill", exact: true })
      .click();
    await expect(page).toHaveURL((url) => url.pathname === "/mise-en-scene");
    await page.goto("/the-choice");
    await page
      .getByRole("link", { name: "Take Blue Pill", exact: true })
      .click();
    await expect(page).toHaveURL((url) => url.pathname === "/blue-pill");
    await page.locator("#wsite-content").getByRole("link").click();
    await expect(page).toHaveURL((url) => url.pathname === "/");
  } finally {
    await context.close();
  }
});

test("mobile menu preserves focus trapping, Escape, closing, and resizing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contents");
  const opener = page.locator(".birdseye-header button.hamburger");
  const menu = page.locator("#navMobile");
  const closer = menu.getByRole("button", { name: "Menu", exact: true });
  const home = menu.getByRole("link", { name: "Home", exact: true });
  await expect(menu).toHaveAttribute("inert", "");
  await expect(opener).toHaveAttribute("aria-expanded", "false");
  await opener.click();
  await expect(opener).toHaveAttribute("aria-expanded", "true");
  await expect(closer).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(home).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(closer).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(home).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("inert", "");
  await expect(opener).toBeFocused();
  await opener.click();
  await closer.click();
  await expect(menu).toHaveAttribute("inert", "");
  await expect(opener).toBeFocused();
  await opener.click();
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(menu).toHaveAttribute("inert", "");
  await expect(opener).toHaveAttribute("aria-expanded", "false");
});

test("mobile Home navigation closes the menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contents");
  await page
    .locator(".birdseye-header")
    .getByRole("button", { name: "Menu", exact: true })
    .click();
  await page
    .locator("#navMobile")
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await expect(page).toHaveURL((url) => url.pathname === "/");
  await expect(
    page.getByRole("link", { name: /START \(Recommended\)/ }),
  ).toBeVisible();
  await expect(page.locator("#navMobile")).toHaveAttribute("inert", "");
  await expect(page.locator("body")).not.toHaveClass(/nav-open/);
});

test("the header responds to the 50-pixel scroll threshold", async ({
  page,
}) => {
  await page.goto("/cyberpunk-the-matrix-and-post-cyberpunk");
  await page.evaluate(() => window.scrollTo(0, 50));
  await expect(page.locator("body")).not.toHaveClass(/affix/);
  await page.evaluate(() => window.scrollTo(0, 51));
  await expect(page.locator("body")).toHaveClass(/affix/);
  await expect(page.locator(".birdseye-header")).toHaveCSS("position", "fixed");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator("body")).not.toHaveClass(/affix/);
});

for (const width of [390, 1440]) {
  test("navigation adapts to viewport width " + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contents");
    await waitForRendering(page);
    await expect(page.locator("#wsite-content")).toBeVisible();
    if (width < 1024) {
      await expect(page.locator(".desktop-nav")).toBeHidden();
      await expect(
        page.locator(".birdseye-header button.hamburger"),
      ).toBeVisible();
    } else {
      await expect(page.locator(".desktop-nav")).toBeVisible();
      await expect(
        page.locator(".birdseye-header button.hamburger"),
      ).toBeHidden();
    }
  });
}

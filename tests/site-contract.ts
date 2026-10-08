import { createHash } from "node:crypto";
import { expect, type BrowserContext, type Page } from "@playwright/test";
export { default as pages } from "./fixtures/pages.json";

export async function stubVideos(context: BrowserContext) {
  await context.route("https://www.youtube.com/embed/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<!doctype html><html lang="en"><title>Video fixture</title></html>',
    }),
  );
}

export async function waitForRendering(page: Page) {
  await expect(
    page.locator('.birdseye-header .logo [class~="tw:hidden!"]').first(),
  ).toHaveCSS("display", "none");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((image) => image.decode().catch(() => {})),
    );
  });
}

export async function pageContract(page: Page) {
  const { content, ...contract } = await page.evaluate(() => {
    const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
    return {
      path: location.pathname,
      title: document.title,
      content: normalize(
        document.querySelector("#wsite-content")?.textContent ?? "",
      ),
      headings: [
        ...document.querySelectorAll(
          "#wsite-content h1, #wsite-content h2, #wsite-content h3",
        ),
      ].map((element) => normalize(element.textContent ?? "")),
      links: [...document.querySelectorAll("a[href]")].map((element) => ({
        href: element.getAttribute("href"),
        text: normalize(element.textContent ?? ""),
        target: element.getAttribute("target"),
      })),
      images: [...document.querySelectorAll("img")].map((element) => ({
        src: element.getAttribute("src"),
        alt: element.getAttribute("alt"),
      })),
      embeds: [...document.querySelectorAll("iframe")].map((element) => ({
        src: element.getAttribute("src"),
        title: element.getAttribute("title"),
        loading: element.getAttribute("loading"),
        fullscreen: element.hasAttribute("allowfullscreen"),
      })),
    };
  });
  return {
    ...contract,
    contentHash: createHash("sha256").update(content).digest("hex"),
  };
}

export async function expectDefinedClasses(page: Page) {
  const undefinedClasses = await page.evaluate(() => {
    const selectors: string[] = [];
    function collect(rules: CSSRuleList) {
      for (const rule of rules) {
        if (rule instanceof CSSStyleRule) selectors.push(rule.selectorText);
        if ("cssRules" in rule) collect((rule as CSSGroupingRule).cssRules);
      }
    }
    for (const sheet of document.styleSheets) collect(sheet.cssRules);
    const classes = new Set(
      [...document.querySelectorAll("[class]")].flatMap((element) => [
        ...element.classList,
      ]),
    );
    return [...classes]
      .filter(
        (name) =>
          !selectors.some((selector) => {
            const needle = "." + CSS.escape(name);
            let start = selector.indexOf(needle);
            while (start !== -1) {
              if (!/[\w\\-]/.test(selector[start + needle.length] ?? ""))
                return true;
              start = selector.indexOf(needle, start + needle.length);
            }
            return false;
          }),
      )
      .sort();
  });
  expect(
    undefinedClasses,
    "Rendered classes must have loaded CSS selectors",
  ).toEqual([]);
}

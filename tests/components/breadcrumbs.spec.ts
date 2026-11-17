// Breadcrumbs: the documented example against the built stylesheet, and the
// Astro props on the navigation regression page.
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const example = readFileSync(
  "apps/shared/src/examples/breadcrumbs/example.html",
  "utf8",
);

async function load(page: Page, width = 1280) {
  await page.setViewportSize({ width, height: 800 });
  await page.setContent(
    `<!doctype html><html lang="en" class="theme-light"><body><main class="section"><div class="container">${example}</div></main></body></html>`,
  );
  await page.addStyleTag({ content: css });
  // Links fade from the browser's default color once the styles apply.
  await page.evaluate(() =>
    Promise.all(document.getAnimations().map((a) => a.finished)),
  );
}
const color = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el) => getComputedStyle(el).color);

test("a labelled landmark with an ordered list, current page last", async ({
  page,
}) => {
  await load(page);
  const nav = page.getByRole("navigation", { name: "Breadcrumb", exact: true });
  await expect(nav.getByRole("listitem")).toHaveCount(3);
  await expect(nav.locator("ol")).toHaveCount(1);
  await expect(nav.locator('[aria-current="page"]')).toHaveText(
    "Installing Constella in an existing project",
  );
});

test("separators sit between items only, and have no text", async ({
  page,
}) => {
  await load(page);
  const items = page
    .locator(".breadcrumbs")
    .first()
    .locator(".breadcrumbs_item");
  const before = (i: number) =>
    items.nth(i).evaluate((el) => {
      const s = getComputedStyle(el, "::before");
      return { content: s.content, width: s.width };
    });
  expect((await before(0)).content).toBe("none");
  for (const i of [1, 2]) {
    const separator = await before(i);
    expect(separator.content).toBe('""');
    expect(parseFloat(separator.width)).toBeGreaterThan(0);
  }
});

test("the current page uses the text color; earlier items are dimmer", async ({
  page,
}) => {
  await load(page);
  const current = await color(page, '[aria-current="page"]');
  const earlier = await color(page, ".breadcrumbs_link:not([aria-current])");
  expect(earlier).not.toBe(current);
  await page.locator(".breadcrumbs_link:not([aria-current])").first().hover();
  await expect
    .poll(() => color(page, ".breadcrumbs_link:not([aria-current])"))
    .toBe(current);
});

test("long trails wrap instead of widening the page at 320px", async ({
  page,
}) => {
  await load(page, 320);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("Astro: last item is current, text without href, empty renders nothing", async ({
  page,
}) => {
  await page.goto("/navigation-regression");
  const linked = page.locator("#crumbs-linked");
  await expect(linked).toHaveAttribute("aria-label", "Breadcrumb");
  await expect(linked.locator("a")).toHaveCount(3);
  await expect(linked.locator('a[aria-current="page"]')).toHaveText("Install");
  await expect(linked.locator("a[aria-current]")).toHaveCount(1);

  const text = page.locator("#crumbs-text");
  await expect(text).toHaveAttribute("aria-label", "Search breadcrumb");
  await expect(text.locator('span[aria-current="page"]')).toHaveText("Results");

  await expect(page.locator("#crumbs-none")).toHaveCount(0);
});

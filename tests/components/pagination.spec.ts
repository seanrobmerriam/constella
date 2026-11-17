// Pagination: the documented example against the built stylesheet, the
// page window, and the Astro props on the navigation regression page.
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { pageWindow } from "../../apps/constella/src/utils/pagination.ts";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const example = readFileSync(
  "apps/shared/src/examples/pagination/example.html",
  "utf8",
);

async function load(page: Page, theme = "light", width = 1280) {
  await page.setViewportSize({ width, height: 800 });
  await page.setContent(
    `<!doctype html><html lang="en" class="theme-${theme}"><body><main class="section"><div class="container">${example}</div></main></body></html>`,
  );
  await page.addStyleTag({ content: css });
  await page.evaluate(() =>
    Promise.all(document.getAnimations().map((a) => a.finished)),
  );
}
const style = (page: Page, selector: string, prop: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);

test("the page window keeps the ends and the current page's neighbours", () => {
  expect(pageWindow(5, 10)).toEqual([1, "gap", 4, 5, 6, "gap", 10]);
  expect(pageWindow(1, 10)).toEqual([1, 2, "gap", 10]);
  expect(pageWindow(10, 10)).toEqual([1, "gap", 9, 10]);
  // A gap that would hide one page shows it.
  expect(pageWindow(4, 10)).toEqual([1, 2, 3, 4, 5, "gap", 10]);
  expect(pageWindow(3, 3, 0)).toEqual([1, 2, 3]);
  expect(pageWindow(5, 10, 2)).toEqual([1, 2, 3, 4, 5, 6, 7, "gap", 10]);
  expect(pageWindow(1, 1)).toEqual([1]);
  expect(pageWindow(1, 0)).toEqual([]);
});

test("screen readers hear 'Page N', the current page, and no gaps", async ({
  page,
}) => {
  await load(page);
  const nav = page.getByRole("navigation", { name: "Pagination", exact: true });
  await expect(nav.getByRole("link", { name: "Page 5" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(nav.getByRole("link", { name: /^Page / })).toHaveCount(5);
  await expect(nav.getByText("…")).toHaveCount(2);
  for (const gap of await nav.locator(".pagination_gap").all()) {
    await expect(gap).toHaveAttribute("aria-hidden", "true");
  }
});

test("a disabled Previous is announced but can't be focused or followed", async ({
  page,
}) => {
  await load(page);
  const nav = page.getByRole("navigation", { name: "Pagination, first page" });
  const previous = nav.getByRole("link", { name: "Previous" });
  await expect(previous).toHaveAttribute("aria-disabled", "true");
  await expect(previous).not.toHaveAttribute("href");
  await page.keyboard.press("Tab");
  // Tab order starts at the first nav; tab to the second nav's first stop.
  await nav.getByRole("link", { name: "Page 1" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(previous).not.toBeFocused();
});

test("Previous points back and Next forward", async ({ page }) => {
  await load(page);
  const rotate = (selector: string) => style(page, selector, "rotate");
  expect(await rotate("li:first-child .pagination_icon")).toBe("180deg");
  expect(await rotate("li:last-child .pagination_icon")).toBe("none");
});

test("targets are at least 44px", async ({ page }) => {
  await load(page);
  for (const link of await page.locator(".pagination_link").all()) {
    const box = await link.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test("the current page is filled with the text color in every theme", async ({
  page,
}) => {
  for (const theme of ["light", "dark", "brand"]) {
    await load(page, theme);
    const text = await style(
      page,
      ".pagination_link:not([aria-current])",
      "color",
    );
    const fill = await style(page, '[aria-current="page"]', "background-color");
    expect(fill, theme).toBe(text);
  }
});

test("no sideways scroll at 320px", async ({ page }) => {
  await load(page, "light", 320);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("Astro: window, URLs, ends, and nothing for one page", async ({
  page,
}) => {
  await page.goto("/navigation-regression");
  const middle = page.locator("#pages-middle");
  await expect(middle).toHaveAttribute("aria-label", "Pagination");
  await expect(middle.locator(".pagination_list > li")).toHaveText([
    "Previous",
    "Page 1",
    "…",
    "Page 4",
    "Page 5",
    "Page 6",
    "…",
    "Page 10",
    "Next",
  ]);
  await expect(middle.locator('[aria-current="page"]')).toHaveAttribute(
    "href",
    "?page=5",
  );
  await expect(middle.locator('[rel="prev"]')).toHaveAttribute(
    "href",
    "?page=4",
  );
  await expect(middle.locator('[rel="next"]')).toHaveAttribute(
    "href",
    "?page=6",
  );

  const first = page.locator("#pages-first");
  await expect(first.getByRole("link", { name: "Page 1" })).toHaveAttribute(
    "href",
    "/blog/",
  );
  await expect(first.locator('[rel="next"]')).toHaveAttribute(
    "href",
    "/blog/2/",
  );
  await expect(first.locator('[aria-disabled="true"]')).toHaveText("Previous");

  const last = page.locator("#pages-last");
  await expect(last.locator('[aria-disabled="true"]')).toHaveText("Next");
  await expect(last.locator(".pagination_gap")).toHaveCount(0);
  await expect(last.getByRole("link", { name: /^Page / })).toHaveCount(3);

  await expect(page.locator("#pages-one")).toHaveCount(0);
});

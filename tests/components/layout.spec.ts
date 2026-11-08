import { expect, test } from "@playwright/test";

test("minimal page has no implicit navbar or footer and exactly one main", async ({
  page,
}) => {
  await page.goto("/minimal");
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator(".nav_wrap")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
});

test("full page places header and footer outside main", async ({ page }) => {
  await page.goto("/full");
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator(".nav_wrap")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  expect(await page.locator("main .nav_wrap, main footer").count()).toBe(0);
  const order = await page.evaluate(() =>
    [...document.body.children]
      .map((e) => e.tagName + (e.id ? `#${e.id}` : ""))
      .filter((t) => /HEADER|MAIN|FOOTER/.test(t)),
  );
  expect(order).toEqual(["HEADER", "MAIN#main", "FOOTER"]);
});

test("Skip is first in tab order and moves focus to main", async ({ page }) => {
  await page.goto("/full");
  await page.keyboard.press("Tab");
  const skip = page.locator(".skip-link");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("custom layout renders one title, canonical, main and Skip", async ({
  page,
}) => {
  await page.goto("/custom-layout");
  await expect(page.locator("head title")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator(".skip-link")).toHaveCount(1);
  const layers = await page.evaluate(
    () =>
      [...document.querySelectorAll("style")].filter((s) =>
        s.textContent?.includes("@layer base, patterns"),
      ).length,
  );
  expect(layers).toBeGreaterThan(0);
});

test("Section regression: padding unchanged without layout overlap", async ({
  page,
}) => {
  await page.goto("/minimal");
  const pad = await page
    .locator("section")
    .first()
    .evaluate((el) => getComputedStyle(el).paddingTop);
  expect(parseFloat(pad)).toBeGreaterThan(0);
});

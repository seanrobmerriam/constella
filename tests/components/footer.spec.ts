import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/footer-regression");
});

const footers = (page: import("@playwright/test").Page) =>
  page.locator("footer");

test("simple and columns variants render their own structure", async ({
  page,
}) => {
  await expect(footers(page)).toHaveCount(5);
  const simple = footers(page).nth(0);
  await expect(simple.locator(".footer_links a")).toHaveCount(2);
  await expect(simple.locator(".footer_group")).toHaveCount(0);
  const columns = footers(page).nth(1);
  await expect(columns.locator(".footer_group")).toHaveCount(2);
  await expect(columns.locator(".footer_description")).toHaveText(
    "Describes the brand.",
  );
  await expect(columns.locator(".footer_legal a")).toHaveText("Privacy");
  await expect(columns.locator(".footer_social a")).toHaveAttribute(
    "aria-label",
    "GitHub",
  );
  await expect(columns.locator(".footer_copyright")).toContainText(
    `${new Date().getFullYear()}`,
  );
  await expect(columns.locator(".footer_copyright")).toContainText("Full Co");
});

test("empty optional collections render no empty regions", async ({ page }) => {
  for (const i of [2, 3]) {
    const f = footers(page).nth(i);
    await expect(f.locator("nav")).toHaveCount(0);
    await expect(f.locator(".footer_legal, .footer_social")).toHaveCount(0);
    await expect(f.locator(".footer_copyright")).toContainText("Bare Co");
  }
});

test("slots replace their regions instead of duplicating them", async ({
  page,
}) => {
  const f = footers(page).nth(4);
  await expect(f.locator("#custom-brand")).toHaveCount(1);
  await expect(f.locator("#custom-cta")).toHaveCount(1);
  await expect(f.locator("#custom-bottom")).toHaveCount(1);
  await expect(f.locator(".footer_logo")).toHaveCount(0);
  await expect(f.locator(".footer_copyright")).toHaveCount(0);
});

test("long groups wrap at narrow width without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await expect(
    footers(page).nth(1).locator(".footer_group_label").first(),
  ).toBeVisible();
});

test("footers sit outside main, are server-rendered and use no duplicate ids", async ({
  page,
}) => {
  expect(await page.locator("main footer").count()).toBe(0);
  const ids = await page.evaluate(() =>
    [...document.querySelectorAll("[id]")].map((e) => e.id),
  );
  expect(new Set(ids).size).toBe(ids.length);
  expect(await page.locator("footer script").count()).toBe(0);
});

test("explicit theme and spacing apply", async ({ page }) => {
  await expect(footers(page).nth(4)).toHaveClass(/theme-dark/);
  const small = await footers(page)
    .nth(0)
    .evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));
  const large = await footers(page)
    .nth(4)
    .evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));
  expect(large).toBeGreaterThan(small);
});

import { expect, test } from "@playwright/test";

test("defaults: sticky, no search, no theme toggle, no icons", async ({
  page,
}) => {
  await page.goto("/full");
  const nav = page.locator("[data-navbar]");
  expect(await nav.evaluate((el) => getComputedStyle(el).position)).toBe(
    "sticky",
  );
  await expect(page.locator(".nav_search")).toHaveCount(0);
  await expect(page.locator("[data-theme-toggle]")).toHaveCount(0);
  await expect(page.locator(".nav_icons")).toHaveCount(0);
  await expect(page.locator(".nav_link")).toHaveCount(2);
});

test("configured links, icons, search form and custom brand", async ({
  page,
}) => {
  await page.goto("/navbar-regression");
  const first = page.locator("[data-navbar]").first();
  await expect(first.locator(".nav_icon")).toHaveCount(2);
  await expect(first.locator(".nav_icon").first()).toHaveAttribute(
    "aria-label",
    "GitHub",
  );
  await expect(first.locator("form[role=search]")).toHaveAttribute(
    "method",
    "get",
  );
  await expect(first.locator("form[role=search]")).toHaveAttribute(
    "action",
    "/search-example",
  );
  await expect(first.locator("input[name=q]")).toBeVisible();
  const second = page.locator("[data-navbar]").nth(1);
  await expect(second.locator(".nav_brand_text")).toHaveText("Custom Brand");
  await expect(second.locator(".nav_link")).toHaveText(["One", "Two"]);
});

test("sticky stays on scroll; sticky=false scrolls away", async ({ page }) => {
  await page.goto("/navbar-regression");
  expect(
    await page
      .locator("[data-navbar]")
      .nth(1)
      .evaluate((el) => getComputedStyle(el).position),
  ).toBe("static");
  await page.evaluate(() => window.scrollTo(0, 1500));
  const first = await page.locator("[data-navbar]").first().boundingBox();
  const second = await page.locator("[data-navbar]").nth(1).boundingBox();
  expect(first!.y).toBeGreaterThanOrEqual(0);
  expect(second!.y).toBeLessThan(0);
});

test("two instances have unique ids and independent menus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 400, height: 800 });
  await page.goto("/navbar-regression");
  const ids = await page.evaluate(() =>
    [...document.querySelectorAll("[id]")].map((e) => e.id),
  );
  expect(new Set(ids).size).toBe(ids.length);
  const toggles = page.locator("[data-navbar-toggle]");
  await toggles.nth(0).click();
  await expect(toggles.nth(0)).toHaveAttribute("aria-expanded", "true");
  await expect(toggles.nth(1)).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Escape");
  await expect(toggles.nth(0)).toHaveAttribute("aria-expanded", "false");
  await expect(toggles.nth(0)).toBeFocused();
  await toggles.nth(1).click();
  await page.locator("main").click({ position: { x: 5, y: 300 } });
  await expect(toggles.nth(1)).toHaveAttribute("aria-expanded", "false");
});

test("search demo echoes the escaped query", async ({ page }) => {
  await page.goto("/search-example?q=%3Cb%3Ehi%3C%2Fb%3E");
  await expect(page.locator("#search-query")).toHaveText("<b>hi</b>");
  expect(await page.locator("#search-query b").count()).toBe(0);
});

test("navbar form submits to the demo destination", async ({ page }) => {
  await page.goto("/navbar-regression");
  await page
    .locator("[data-navbar]")
    .first()
    .locator("input[name=q]")
    .fill("stars");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/search-example\?q=stars/);
  await expect(page.locator("#search-query")).toHaveText("stars");
});

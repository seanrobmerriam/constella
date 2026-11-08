import { expect, test } from "@playwright/test";

const openCount = (page: import("@playwright/test").Page, sel: string) =>
  page.locator(`${sel} > details[open], ${sel} > .details_wrap[open]`).count();

test.beforeEach(async ({ page }) => {
  await page.goto("/disclosure-regression");
});

test("standalone Details works natively with a native summary", async ({
  page,
}) => {
  const d = page.locator("#standalone");
  await expect(d.locator("summary")).toHaveCount(1);
  expect(await d.evaluate((el) => el.firstElementChild!.tagName)).toBe(
    "SUMMARY",
  );
  await d.locator("summary").click();
  await expect(d).toHaveAttribute("open", "");
  await d.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(d).not.toHaveAttribute("open", "");
});

test("openFirst opens only the first owned item", async ({ page }) => {
  const items = page.locator("#a1 > details");
  await expect(items.nth(0)).toHaveAttribute("open", "");
  await expect(items.nth(1)).not.toHaveAttribute("open", "");
});

test("two accordions form independent single-open groups", async ({ page }) => {
  const names = await page.evaluate(() =>
    [...document.querySelectorAll("#a1 > details, #a2 > details")].map((d) =>
      d.getAttribute("name"),
    ),
  );
  expect(names[0]).toBe(names[1]);
  expect(names[2]).toBe(names[3]);
  expect(names[0]).not.toBe(names[2]);

  await page.locator("#a2 > details").nth(0).locator("summary").click();
  await page.locator("#a2 > details").nth(1).locator("summary").click();
  expect(await openCount(page, "#a2")).toBe(1);
  expect(await openCount(page, "#a1")).toBe(1);
});

test("nested accordions and plain nested disclosures do not affect the parent", async ({
  page,
}) => {
  await page.locator("#outer1 > summary").click();
  await page.locator("#in1 > summary").click();
  await page.locator("#plain-nested > summary").click();
  await expect(page.locator("#outer1")).toHaveAttribute("open", "");
  await page.locator("#in2 > summary").click();
  await expect(page.locator("#in1")).not.toHaveAttribute("open", "");
  await expect(page.locator("#outer1")).toHaveAttribute("open", "");
  await expect(page.locator("#plain-nested")).toHaveAttribute("open", "");
  const outerName = await page.locator("#outer1").getAttribute("name");
  const innerName = await page.locator("#in1").getAttribute("name");
  expect(outerName).not.toBe(innerName);
  expect(await page.locator("#plain-nested").getAttribute("name")).toBeNull();
});

test("single=false leaves items independent", async ({ page }) => {
  expect(await openCount(page, "#multi")).toBe(2);
  await expect(page.locator("#multi > details").first()).not.toHaveAttribute(
    "name",
    /.+/,
  );
});

test("single groups normalize multiple initially-open items", async ({
  page,
}) => {
  expect(await openCount(page, "#initial")).toBe(1);
});

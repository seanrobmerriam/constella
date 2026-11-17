// Table: the documented example against the built stylesheet, plain tables
// in rich text, and the Astro props on the data regression page.
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const example = readFileSync(
  "apps/shared/src/examples/table/example.html",
  "utf8",
);

async function load(page: Page, body = example, width = 1000) {
  await page.setViewportSize({ width, height: 700 });
  await page.setContent(
    `<!doctype html><html lang="en" class="theme-light"><body><main class="section"><div class="container">${body}</div></main></body></html>`,
  );
  await page.addStyleTag({ content: css });
}
const style = (page: Page, selector: string, prop: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);

test("the scroll area is focusable and named by the caption", async ({
  page,
}) => {
  await load(page);
  const region = page.getByRole("region", { name: "Plans and prices" });
  await expect(region).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(region).toBeFocused();
  await expect(
    page.getByRole("table", { name: "Plans and prices" }),
  ).toBeVisible();
});

test("on a phone the table scrolls inside its wrapper, not the page", async ({
  page,
}) => {
  await load(page, example, 360);
  const sizes = await page.evaluate(() => {
    const wrap = document.querySelector(".table_wrap")!;
    return {
      page:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      wrap: wrap.scrollWidth - wrap.clientWidth,
    };
  });
  expect(sizes.page).toBeLessThanOrEqual(0);
  expect(sizes.wrap).toBeGreaterThan(0);
  // The arrow keys scroll it once it has focus.
  await page.locator(".table_wrap").focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => page.locator(".table_wrap").evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
});

test("numeric cells align to the end with tabular figures", async ({
  page,
}) => {
  await load(page);
  expect(await style(page, "td.is-numeric", "text-align")).toBe("end");
  expect(await style(page, "td.is-numeric", "font-variant-numeric")).toBe(
    "tabular-nums",
  );
  expect(await style(page, "tbody td:not(.is-numeric)", "text-align")).toBe(
    "start",
  );
});

test("striped shades even rows; compact has less padding", async ({ page }) => {
  await load(page);
  const odd = await style(page, "tbody tr:nth-child(1)", "background-color");
  const even = await style(page, "tbody tr:nth-child(2)", "background-color");
  expect(even).not.toBe(odd);
  const normal = parseFloat(await style(page, "tbody td", "padding-top"));
  await load(page, example.replace("table striped", "table compact"));
  const compact = parseFloat(await style(page, "tbody td", "padding-top"));
  expect(compact).toBeLessThan(normal);
});

test("a plain table in rich text gets the same styles", async ({ page }) => {
  await load(
    page,
    `<div class="rich-text"><table><thead><tr><th>Plan</th></tr></thead><tbody><tr><td>Team</td></tr></tbody></table></div>`,
  );
  expect(await style(page, ".rich-text td", "border-bottom-style")).toBe(
    "solid",
  );
  expect(await style(page, ".rich-text table", "border-collapse")).toBe(
    "collapse",
  );
});

test.describe("Astro props", () => {
  test.beforeEach(({ page }) => page.goto("/data-regression"));

  test("each table's region is labelled by its own caption", async ({
    page,
  }) => {
    await expect(page.getByRole("region", { name: "First" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Second" })).toBeVisible();
    await expect(page.locator("#first")).toHaveClass("table striped");
    await expect(page.locator("#second")).toHaveClass("table compact");
  });

  test("captionHidden hides the caption from view only", async ({ page }) => {
    await expect(page.locator("#second caption")).toHaveClass("sr-only");
    await expect(page.getByRole("table", { name: "Second" })).toBeAttached();
  });
});

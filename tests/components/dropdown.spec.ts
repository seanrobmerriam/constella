// Dropdown, tested on the documented example markup against the built
// stylesheet and behavior (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const behavior = readFileSync("apps/shared/dist/behaviors/dropdown.js", "utf8");
const example = readFileSync(
  "apps/shared/src/examples/dropdown/example.html",
  "utf8",
).replace(/<script[\s\S]*?<\/script>/g, "");

async function load(page: Page, body = example, script = true) {
  await page.setViewportSize({ width: 1000, height: 700 });
  await page.setContent(`<!doctype html><html><body>${body}</body></html>`);
  await page.addStyleTag({ content: css });
  if (script) {
    await page.addScriptTag({
      type: "module",
      content: `${behavior.replace(/export\s*\{[^}]*\};?/, "")}
        window.__cleanups = [...document.querySelectorAll(".dropdown_wrap")].map(initDropdown);`,
    });
    await page.waitForFunction(() => (window as any).__cleanups);
  }
}
const isOpen = (page: Page, nth = 0) =>
  page
    .locator(".dropdown_wrap")
    .nth(nth)
    .evaluate((d) => (d as HTMLDetailsElement).open);

test("opens and closes from the toggle without the script", async ({
  page,
}) => {
  await load(page, example, false);
  await page.locator(".dropdown_toggle").click();
  expect(await isOpen(page)).toBe(true);
  await expect(page.getByRole("link", { name: "Guides" })).toBeVisible();
  await page.locator(".dropdown_toggle").click();
  expect(await isOpen(page)).toBe(false);
});

test("Escape inside closes it and returns focus to the toggle", async ({
  page,
}) => {
  await load(page);
  await page.locator(".dropdown_toggle").focus();
  await page.keyboard.press("Enter");
  expect(await isOpen(page)).toBe(true);
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("link", { name: "Guides" })).toBeFocused();
  await page.keyboard.press("Escape");
  expect(await isOpen(page)).toBe(false);
  await expect(page.locator(".dropdown_toggle")).toBeFocused();
});

test("Escape elsewhere on the page leaves an open dropdown and focus alone", async ({
  page,
}) => {
  await load(
    page,
    example.replace("<details", "<details open") + '<input id="elsewhere" />',
  );
  await page.locator("#elsewhere").focus();
  await page.keyboard.press("Escape");
  expect(await isOpen(page)).toBe(true);
  await expect(page.locator("#elsewhere")).toBeFocused();
});

test("Escape closes only the dropdown that has focus", async ({ page }) => {
  await load(
    page,
    example.replace("<details", "<details open") +
      example.replace("<details", "<details open"),
  );
  await page.locator(".dropdown_toggle").nth(1).focus();
  await page.keyboard.press("Escape");
  expect(await isOpen(page, 0)).toBe(true);
  expect(await isOpen(page, 1)).toBe(false);
  await expect(page.locator(".dropdown_toggle").nth(1)).toBeFocused();
});

test("arrow keys cycle through the panel's links", async ({ page }) => {
  await load(page);
  await page.locator(".dropdown_toggle").focus();
  await page.keyboard.press("Enter");
  for (const name of ["Guides", "Changelog", "Support", "Guides"]) {
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("link", { name })).toBeFocused();
  }
  await page.keyboard.press("ArrowUp");
  await expect(page.getByRole("link", { name: "Support" })).toBeFocused();
});

test("a click outside closes it", async ({ page }) => {
  await load(page);
  await page.locator(".dropdown_toggle").click();
  expect(await isOpen(page)).toBe(true);
  await page.mouse.click(900, 600);
  expect(await isOpen(page)).toBe(false);
});

test("cleanup removes the keyboard and outside-click handling", async ({
  page,
}) => {
  await load(page, example.replace("<details", "<details open"));
  await page.evaluate(() =>
    (window as any).__cleanups.forEach((c: () => void) => c()),
  );
  await page.mouse.click(900, 600);
  expect(await isOpen(page)).toBe(true);
});

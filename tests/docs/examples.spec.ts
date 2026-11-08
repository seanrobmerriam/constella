import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

const dir = "apps/shared/src/examples";
// Read the same files the registry imports with `?raw`.
const examples = [
  { id: "button" },
  { id: "input-wrapper" },
  { id: "details" },
  { id: "accordion", behaviorEntry: "accordion" },
  { id: "navbar", behaviorEntry: "navbar" },
  { id: "footer" },
].map((e) => ({
  ...e,
  html: readFileSync(`${dir}/${e.id}/example.html`, "utf8"),
  tsx: readFileSync(`${dir}/${e.id}/Example.tsx`, "utf8"),
}));

test.use({ baseURL: "http://localhost:4332" });

const button = examples.find((e) => e.id === "button")!;

test("HTML / CSS tab is selected first and shows complete source", async ({
  page,
}) => {
  await page.goto("/components/button/");
  const tabs = page.locator("[data-example=button] [role=tab]");
  await expect(tabs.nth(0)).toHaveText("HTML / CSS");
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "false");
  await expect(page.locator("[data-panel=html] [data-source]")).toHaveText(
    button.html.trimEnd(),
  );
  await expect(page.locator("[data-panel=tsx]")).toBeHidden();
});

test("keyboard switches tabs with arrows, Home and End", async ({ page }) => {
  await page.goto("/components/button/");
  const tabs = page.locator("[data-example=button] [role=tab]");
  await tabs.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(page.locator("[data-panel=tsx]")).toBeVisible();
  await expect(page.locator("[data-panel=html]")).toBeHidden();
  await page.keyboard.press("Home");
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});

test("copy button copies the complete source of the visible tab", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/components/button/");
  await page.locator("[data-panel=html] [data-copy]").click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    button.html,
  );
  await page.locator("[data-example=button] [role=tab]").nth(1).click();
  await page.locator("[data-panel=tsx] [data-copy]").click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    button.tsx,
  );
});

test("preview iframe is titled, loads the shared CSS and styles the example", async ({
  page,
}) => {
  await page.goto("/components/button/");
  await expect(page.locator("[data-example=button] iframe")).toHaveAttribute(
    "title",
    "Button preview",
  );
  const btn = page
    .frameLocator("[data-example=button] iframe")
    .locator(".button_wrap")
    .first();
  await expect(btn).toBeVisible();
  const padding = await btn.evaluate((el) =>
    parseFloat(getComputedStyle(el).paddingLeft),
  );
  expect(padding).toBeGreaterThan(8);
});

test("component CSS and resets do not leak into the docs shell", async ({
  page,
}) => {
  await page.goto("/components/button/");
  const leaked = await page.evaluate(() =>
    [...document.styleSheets].some((sheet) => {
      try {
        return [...sheet.cssRules].some((r) =>
          r.cssText.includes("button_wrap"),
        );
      } catch {
        return false;
      }
    }),
  );
  expect(leaked).toBe(false);
  expect(await page.locator(".button_wrap").count()).toBe(0);
});

for (const example of examples) {
  test(`${example.id}: page shows both sources and a requirements list`, async ({
    page,
  }) => {
    await page.goto(`/components/${example.id}/`);
    const requires = page.locator(
      `[data-example=${example.id}] .example-requires`,
    );
    await expect(requires).toContainText("constella.css");
    if (example.behaviorEntry)
      await expect(requires).toContainText(
        `behaviors/${example.behaviorEntry}`,
      );
    await expect(
      page.locator(
        `[data-example=${example.id}] [data-panel=tsx] [data-source]`,
      ),
    ).toContainText("export function");
  });
}

test("accordion preview runs the shared behavior (single-open grouping)", async ({
  page,
}) => {
  await page.goto("/previews/accordion/");
  const items = page.locator("details");
  await expect(items.nth(0)).toHaveAttribute("open", "");
  await items.nth(1).locator("summary").click();
  await expect(items.nth(0)).not.toHaveAttribute("open", "");
  await expect(items.nth(1)).toHaveAttribute("open", "");
});

test("navbar preview menu toggles on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 400, height: 700 });
  await page.goto("/previews/navbar/");
  const toggle = page.locator("[data-navbar-toggle]");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("preview route is a closed set and copyable-only scripts are not loaded", async ({
  page,
}) => {
  const missing = await page.goto("/previews/does-not-exist/");
  expect(missing?.status()).toBe(404);
  await page.goto("/previews/accordion/");
  await expect(
    page.locator("script[src*='behaviors/accordion.js']"),
  ).toHaveCount(0);
});

test("component pages have no horizontal overflow at mobile width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/components/accordion/");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

// Tabs, tested on the documented example markup against the built stylesheet
// and behavior (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const behavior = readFileSync("apps/shared/dist/behaviors/tabs.js", "utf8");
const raw = readFileSync("apps/shared/src/examples/tabs/example.html", "utf8");
const example = raw.replace(/<script[\s\S]*?<\/script>/g, "");
const origin = "http://constella.test";

const controls = `<div class="tabs_controls"><div class="tabs_steps">
  <button class="button_wrap secondary arrow back" type="button" aria-label="Previous tab" data-step="-1">‹</button>
  <button class="button_wrap secondary arrow" type="button" aria-label="Next tab" data-step="1">›</button></div>
  <button class="button_wrap secondary play" type="button" aria-label="Pause automatic rotation" aria-pressed="true" data-toggle>⏯</button></div>`;
const autoExample = example
  .replace('class="tabs_wrap"', 'class="tabs_wrap auto"')
  .replace(/(<\/div>\s*<\/div>\s*\n\s*<!--)/, `</div>${controls}</div>\n<!--`);

async function load(
  page: Page,
  { body = example, script = true, query = "" } = {},
) {
  await page.setViewportSize({ width: 1000, height: 700 });
  await page.route(`${origin}/**`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html><head><style>${css}</style></head><body>${body}${
        script
          ? `<script type="module">${behavior.replace(/export\s*\{[^}]*\};?/, "")}
             window.__cleanups = [...document.querySelectorAll(".tabs_wrap")].map(initTabs);</script>`
          : ""
      }</body></html>`,
    }),
  );
  await page.goto(`${origin}/${query}`);
  if (script) await page.waitForFunction(() => (window as any).__cleanups);
}
const tab = (page: Page, name: string) => page.getByRole("tab", { name });
const selected = (page: Page) =>
  page.locator('[role="tab"][aria-selected="true"]').textContent();

test("adds tab roles and links each tab to its panel; only the first is tabbable", async ({
  page,
}) => {
  await load(page);
  await expect(page.getByRole("tab")).toHaveCount(3);
  await expect(page.locator('[role="tabpanel"]')).toHaveCount(3);
  const strategy = tab(page, "Strategy");
  await expect(strategy).toHaveAttribute("aria-selected", "true");
  await expect(strategy).toHaveAttribute("tabindex", "0");
  await expect(tab(page, "Design")).toHaveAttribute("tabindex", "-1");
  const panelId = await strategy.getAttribute("aria-controls");
  await expect(page.locator(`#${panelId}`)).toBeVisible();
  await expect(page.locator(`#${panelId}`)).toHaveAttribute(
    "aria-labelledby",
    (await strategy.getAttribute("id"))!,
  );
});

test("clicking a tab shows its panel and records it in the URL", async ({
  page,
}) => {
  await load(page);
  await tab(page, "Design").click();
  expect((await selected(page))?.trim()).toBe("Design");
  await expect(page.getByRole("tabpanel", { name: "Design" })).toBeVisible();
  await expect(page.getByRole("tabpanel", { name: "Strategy" })).toBeHidden();
  expect(new URL(page.url()).searchParams.get("process")).toBe("design");
});

test("arrow keys wrap, Home and End jump, and focus follows", async ({
  page,
}) => {
  await load(page);
  await tab(page, "Strategy").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(tab(page, "Launch")).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(tab(page, "Strategy")).toBeFocused();
  await page.keyboard.press("End");
  await expect(tab(page, "Launch")).toBeFocused();
  await page.keyboard.press("Home");
  await expect(tab(page, "Strategy")).toBeFocused();
  expect((await selected(page))?.trim()).toBe("Strategy");
});

test("a link with ?<id>=<slug> opens on that tab", async ({ page }) => {
  await load(page, { query: "?process=launch" });
  expect((await selected(page))?.trim()).toBe("Launch");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("every panel shows and the tab bar is hidden", async ({ page }) => {
    await load(page, { body: raw, script: false });
    await expect(page.locator(".tabs_bar")).toBeHidden();
    for (const text of ["We start", "Pages are built", "Every page"])
      await expect(page.getByText(text)).toBeVisible();
  });
});

test.describe("auto", () => {
  test("advances every 6 seconds and stops while focused", async ({ page }) => {
    await page.clock.install();
    await load(page, { body: autoExample });
    expect((await selected(page))?.trim()).toBe("Strategy");
    await page.clock.runFor(6100);
    expect((await selected(page))?.trim()).toBe("Design");
    // Focus inside pauses rotation.
    await tab(page, "Design").focus();
    await page.clock.runFor(13000);
    expect((await selected(page))?.trim()).toBe("Design");
    await expect(page.locator(".tabs_wrap")).toHaveClass(/is-paused/);
  });

  test("the step buttons move between tabs", async ({ page }) => {
    await page.clock.install();
    await load(page, { body: autoExample });
    await page.getByRole("button", { name: "Next tab" }).click();
    expect((await selected(page))?.trim()).toBe("Design");
    await page.getByRole("button", { name: "Previous tab" }).click();
    expect((await selected(page))?.trim()).toBe("Strategy");
  });

  test("pressing pause stops rotation, and it stays stopped after focus leaves", async ({
    page,
  }) => {
    await page.clock.install();
    await load(page, { body: autoExample });
    const toggle = page.locator("[data-toggle]");
    await expect(toggle).toHaveAttribute(
      "aria-label",
      "Pause automatic rotation",
    );
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(toggle).toHaveAttribute(
      "aria-label",
      "Start automatic rotation",
    );
    await page.evaluate(() => (document.activeElement as HTMLElement).blur());
    await page.clock.runFor(13000);
    expect((await selected(page))?.trim()).toBe("Strategy");

    // Pressing it again starts rotation once focus has left.
    await toggle.click();
    await page.evaluate(() => (document.activeElement as HTMLElement).blur());
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await page.clock.runFor(6100);
    expect((await selected(page))?.trim()).toBe("Design");
  });

  test("reduced motion keeps it paused", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.clock.install();
    await load(page, { body: autoExample });
    await page.clock.runFor(13000);
    expect((await selected(page))?.trim()).toBe("Strategy");
  });
});

test("cleanup stops it reacting", async ({ page }) => {
  await load(page);
  await page.evaluate(() =>
    (window as any).__cleanups.forEach((c: () => void) => c()),
  );
  await tab(page, "Design").click();
  expect((await selected(page))?.trim()).toBe("Strategy");
  await expect(page.locator(".tabs_wrap")).not.toHaveClass(/is-ready/);
});

// React: a Vite app that renders every canonical TSX example inside
// StrictMode, against the built CSS and behaviors. Build with
// `bun run --cwd tests/fixtures/react build`.
import { resolve } from "node:path";
import { integrationChecks, test, expect, inExample } from "./shared.ts";
import { origin, serveStatic } from "./serve-static.ts";

const dir = resolve("tests/fixtures/react/dist");

integrationChecks(async (page) => {
  await serveStatic(page, dir);
  await page.goto(`${origin}/`);
});

test("StrictMode's second mount leaves one working copy of each behavior", async ({
  page,
}) => {
  await serveStatic(page, dir);
  await page.goto(`${origin}/`);
  // Wait until the effects have run: the theme toggle's sets aria-pressed.
  await expect(page.locator("[data-theme-toggle]")).toHaveAttribute(
    "aria-pressed",
    /true|false/,
  );
  // Every effect ran twice, with a cleanup in between.
  expect(
    await page.evaluate(
      () => (window as unknown as { effectRuns: number }).effectRuns,
    ),
  ).toBe(2);
  // A handler bound twice would open and close the menu in one click...
  await page.setViewportSize({ width: 400, height: 800 });
  const toggle = inExample(page, "navbar").locator("[data-navbar-toggle]");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  // ...and move two tabs for one arrow key.
  const tabs = inExample(page, "tabs");
  await tabs.getByRole("tab", { name: "Strategy" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "Design" })).toBeFocused();
});

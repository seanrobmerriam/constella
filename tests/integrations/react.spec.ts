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
  // A behavior left bound twice would add two slider markers per position.
  const slider = inExample(page, "slider");
  const markers = await slider.locator(".slider_marker").count();
  const positions = await slider.locator(".slider_list > *").count();
  expect(markers).toBeGreaterThan(0);
  expect(markers).toBeLessThanOrEqual(positions);
  // And a doubled click handler would open and close the menu in one click.
  await page.setViewportSize({ width: 400, height: 800 });
  const toggle = inExample(page, "navbar").locator("[data-navbar-toggle]");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
});

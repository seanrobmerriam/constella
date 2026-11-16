// Skip, tested on the documented example markup against the built stylesheet
// (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const example = readFileSync(
  "apps/shared/src/examples/skip/example.html",
  "utf8",
);

test("skip link is off-screen until focused, then visible, then moves focus to main", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1000, height: 700 });
  await page.setContent(`<!doctype html><html><body>${example}</body></html>`);
  await page.addStyleTag({ content: css });
  const skip = page.locator(".skip-link");

  const hidden = await skip.boundingBox();
  expect(hidden!.y + hidden!.height).toBeLessThanOrEqual(0);

  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await page.waitForTimeout(300);
  const shown = await skip.boundingBox();
  expect(shown!.y).toBeGreaterThanOrEqual(0);

  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

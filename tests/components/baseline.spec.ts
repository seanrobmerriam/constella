import { readFileSync, writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

// Baseline defaults captured before the implementation plan changes anything.
// Viewport 1280x800 (playwright.config.ts); font is the site's configured Inter.
// Regenerate deliberately with UPDATE_BASELINE=1.
const file = new URL("../fixtures/baseline.json", import.meta.url);

const targets: Record<string, string> = {
  section: "section",
  buttonWritten: "a.button_wrap:not(.link):not(.secondary)",
  buttonSecondary: ".button_wrap.secondary",
  dropdownSummary: ".dropdown_wrap summary",
  heading: "h2",
  input: "input[type=text], input:not([type])",
  select: "select",
  textarea: "textarea",
};
const props = [
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "fontSize",
  "lineHeight",
  "fontWeight",
  "fontFamily",
  "borderRadius",
  "borderTopWidth",
  "height",
  "color",
  "backgroundColor",
];

test("baseline computed defaults are unchanged", async ({ page }) => {
  await page.goto("/example-components");
  const found: Record<string, Record<string, string> | null> = {};
  for (const [name, selector] of Object.entries(targets)) {
    const loc = page.locator(selector).first();
    found[name] = (await loc.count())
      ? await loc.evaluate((el, p) => {
          const s = getComputedStyle(el) as unknown as Record<string, string>;
          return Object.fromEntries(p.map((k) => [k, s[k]]));
        }, props)
      : null;
  }
  if (process.env.UPDATE_BASELINE) {
    writeFileSync(file, JSON.stringify(found, null, 2) + "\n");
  }
  expect(found).toEqual(JSON.parse(readFileSync(file, "utf8")));
});

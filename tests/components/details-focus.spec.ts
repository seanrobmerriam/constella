// Content inside a Details (and an Accordion item) can take focus as soon as
// it opens, not only after the opening animation. Runs against the built
// stylesheet (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const example = readFileSync(
  "apps/shared/src/examples/details/example.html",
  "utf8",
).replace(
  '<p class="text">',
  '<p class="text"><a id="inside" href="#x">A link inside</a> ',
);

test("Tab right after opening reaches a link inside", async ({ page }) => {
  await page.setContent(
    `<!doctype html><html><body>${example}<a id="after" href="#y">After</a></body></html>`,
  );
  await page.addStyleTag({ content: css });
  await page.locator("summary").focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(page.locator("#inside")).toBeFocused();
});

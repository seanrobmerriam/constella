import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const fixture = pathToFileURL(
  resolve("tests/fixtures/plain-html/index.html"),
).href;

test("plain HTML consumes the built CSS with no framework runtime", async ({
  page,
}) => {
  const failed: string[] = [];
  page.on("requestfailed", (r) => failed.push(r.url()));
  await page.goto(fixture);

  const scripts = await page.locator("script").count();
  expect(scripts).toBe(0);

  const s = await page.locator(".button_wrap").evaluate((el) => {
    const c = getComputedStyle(el);
    return {
      display: c.display,
      padding: c.paddingTop,
      radius: c.borderTopLeftRadius,
    };
  });
  expect(["flex", "inline-flex"]).toContain(s.display);
  expect(s.padding).not.toBe("0px");
  expect(failed).toEqual([]);
});

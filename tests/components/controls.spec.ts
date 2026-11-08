import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");

const field = (extra = "", label = "Email") => `
  <label class="field form-input" ${extra}>
    <span class="field-label text-style-main">${label}</span>
    <input class="field-control text-style-main" type="text" />
  </label>`;

async function load(
  page: import("@playwright/test").Page,
  body: string,
  width = 1000,
) {
  await page.setViewportSize({ width, height: 800 });
  await page.setContent(
    `<!doctype html><html><body><main class="content">${body}</main></body></html>`,
  );
  await page.addStyleTag({ content: css });
}
const style = (
  page: import("@playwright/test").Page,
  sel: string,
  prop: string,
) =>
  page
    .locator(sel)
    .first()
    .evaluate((el, p) => parseFloat((getComputedStyle(el) as any)[p]), prop);

test("explicit size scales Button font and padding; omitted size preserves default", async ({
  page,
}) => {
  await load(
    page,
    `<a id="d" class="button_wrap" href="#">Go</a>
     <a id="s" class="button_wrap" data-size="small" href="#">Go</a>
     <a id="m" class="button_wrap" data-size="main" href="#">Go</a>
     <a id="l" class="button_wrap" data-size="large" href="#">Go</a>`,
  );
  const fs = async (id: string) => style(page, `#${id}`, "fontSize");
  expect(await fs("s")).toBeLessThan(await fs("m"));
  expect(await fs("m")).toBeLessThan(await fs("l"));
  expect(await style(page, "#s", "paddingTop")).toBeLessThan(
    await style(page, "#l", "paddingTop"),
  );
  // Omitted size keeps the inherited default, which is untouched by controls.css.
  expect(await fs("d")).toBe(await style(page, "main", "fontSize"));
});

test("explicit radius applies to Button, Dropdown panel and fields; omitted keeps defaults", async ({
  page,
}) => {
  await load(
    page,
    `<a id="b0" class="button_wrap" href="#">Go</a>
     <a id="bn" class="button_wrap" data-radius="none" href="#">Go</a>
     <a id="br" class="button_wrap" data-radius="round" href="#">Go</a>
     <a id="bl" class="button_wrap link" data-radius="round" href="#">Go</a>
     ${field('data-radius="none"')}`,
  );
  expect(await style(page, "#b0", "borderTopLeftRadius")).toBeGreaterThan(0);
  expect(await style(page, "#bn", "borderTopLeftRadius")).toBe(0);
  expect(await style(page, "#br", "borderTopLeftRadius")).toBeGreaterThan(100);
  expect(await style(page, "#bl", "borderTopLeftRadius")).toBe(0);
  expect(await style(page, "input", "borderTopLeftRadius")).toBe(0);
});

test("labeled Input beside a Button wraps at narrow width without overflow or reordering", async ({
  page,
}) => {
  await load(
    page,
    `<div class="input-wrapper">
       ${field("", "A very long label that must wrap onto several lines at narrow widths")}
       <a class="button_wrap" href="#">Subscribe</a>
       <details class="dropdown_wrap"><summary class="dropdown_toggle">Menu</summary><div class="dropdown_content">x</div></details>
     </div>`,
    320,
  );
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await expect(page.locator(".field-label")).toBeVisible();
  const tags = await page.evaluate(() => {
    const els = [
      ...document.querySelectorAll<HTMLElement>("input, .button_wrap, summary"),
    ];
    els.forEach((e) => e.setAttribute("tabindex", "0"));
    return els.map((e) => e.tagName);
  });
  expect(tags).toEqual(["INPUT", "A", "SUMMARY"]);
});

test("focus is visible on sized controls and disabled buttons render", async ({
  page,
}) => {
  await load(
    page,
    `<button class="button_wrap" data-size="large" disabled>Off</button><a id="a" class="button_wrap" href="#">On</a>`,
  );
  await page.keyboard.press("Tab");
  expect(
    await page
      .locator("#a")
      .evaluate((el) => getComputedStyle(el).outlineStyle),
  ).toBe("solid");
  await expect(page.locator("button")).toBeDisabled();
});

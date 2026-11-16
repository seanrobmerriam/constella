// Modal, tested on the documented example markup against the built
// stylesheet and behavior (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const behavior = readFileSync("apps/shared/dist/behaviors/modal.js", "utf8");
const example = readFileSync(
  "apps/shared/src/examples/modal/example.html",
  "utf8",
).replace(/<script[\s\S]*?<\/script>/g, "");
const origin = "http://constella.test";

async function load(
  page: Page,
  { body = example, script = true, query = "" } = {},
) {
  await page.setViewportSize({ width: 1000, height: 700 });
  await page.route(`${origin}/**`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html><head><style>${css}</style></head><body>${body}
        ${
          script
            ? `<script type="module">${behavior.replace(/export\s*\{[^}]*\};?/, "")}
          window.__events = [];
          document.addEventListener("modal-open", () => __events.push("open"));
          document.addEventListener("modal-close", () => __events.push("close"));
          window.__cleanups = [...document.querySelectorAll(".modal_wrap")].map(initModal);</script>`
            : ""
        }</body></html>`,
    }),
  );
  await page.goto(`${origin}/${query}`);
  if (script) await page.waitForFunction(() => (window as any).__cleanups);
}
const dialog = (page: Page) => page.locator("dialog");
const trigger = (page: Page) => page.locator("[data-modal-open]");

test("a trigger opens it, and Tab never reaches the page behind it", async ({
  page,
}) => {
  await load(page, {
    body:
      '<a id="before" href="#b">before</a>' +
      example +
      '<a id="after" href="#a">after</a>',
  });
  await trigger(page).click();
  await expect(dialog(page)).toHaveJSProperty("open", true);
  // Tab cycles through the dialog's controls and, by design, out to the
  // browser's own UI (reported as the body) and back, never to page content.
  const seen = new Set<string>();
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press("Tab");
    seen.add(
      await page.evaluate(() => {
        const a = document.activeElement!;
        if (a === document.body) return "browser";
        return document.querySelector("dialog")!.contains(a) ? "dialog" : a.id;
      }),
    );
  }
  expect([...seen].sort()).toEqual(["browser", "dialog"]);
});

for (const [how, close] of [
  ["Escape", (p: Page) => p.keyboard.press("Escape")],
  ["the close button", (p: Page) => p.getByLabel("Close").click()],
  ["a [data-modal-close] button", (p: Page) => p.getByText("Not now").click()],
] as const) {
  test(`${how} closes it and returns focus to the trigger`, async ({
    page,
  }) => {
    await load(page);
    await trigger(page).focus();
    await page.keyboard.press("Enter");
    await expect(dialog(page)).toHaveJSProperty("open", true);
    await close(page);
    await expect(dialog(page)).toHaveJSProperty("open", false);
    await expect(trigger(page)).toBeFocused();
  });
}

test("a backdrop click closes it; a drag from inside to the backdrop does not", async ({
  page,
}) => {
  await load(page);
  await trigger(page).click();
  const box = (await page.locator(".modal_content").boundingBox())!;
  // Drag from inside the box out to the backdrop.
  await page.mouse.move(box.x + 20, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(10, 10);
  await page.mouse.up();
  await expect(dialog(page)).toHaveJSProperty("open", true);
  await page.mouse.click(10, 10);
  await expect(dialog(page)).toHaveJSProperty("open", false);
});

test("a link to #id opens it without changing the URL hash", async ({
  page,
}) => {
  await load(page, {
    body: example + '<a id="link" href="#newsletter">Open</a>',
  });
  await page.locator("#link").click();
  await expect(dialog(page)).toHaveJSProperty("open", true);
  expect(new URL(page.url()).hash).toBe("");
});

test("?modal=<id> opens it on load and is removed from the URL", async ({
  page,
}) => {
  await load(page, { query: "?modal=newsletter&keep=1" });
  await expect(dialog(page)).toHaveJSProperty("open", true);
  const url = new URL(page.url());
  expect(url.searchParams.has("modal")).toBe(false);
  expect(url.searchParams.get("keep")).toBe("1");
});

test("modal-open and modal-close events bubble", async ({ page }) => {
  await load(page);
  await trigger(page).click();
  await page.keyboard.press("Escape");
  await expect
    .poll(() => page.evaluate(() => (window as any).__events))
    .toEqual(["open", "close"]);
});

test("without the script the trigger does nothing; cleanup does the same", async ({
  page,
}) => {
  await load(page, { script: false });
  await trigger(page).click();
  await expect(dialog(page)).toHaveJSProperty("open", false);

  await load(page);
  await page.evaluate(() =>
    (window as any).__cleanups.forEach((c: () => void) => c()),
  );
  await trigger(page).click();
  await expect(dialog(page)).toHaveJSProperty("open", false);
});

test("the page behind stops scrolling while it is open", async ({ page }) => {
  await load(page, { body: example + '<div style="height:3000px"></div>' });
  const overflow = () =>
    page.evaluate(() => getComputedStyle(document.documentElement).overflow);
  expect(await overflow()).not.toBe("hidden");
  await trigger(page).click();
  expect(await overflow()).toBe("hidden");
});

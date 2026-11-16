// Section, ContentWrapper and Grid, tested on the same example markup the docs
// show, against the built stylesheet (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const example = (id: string) =>
  readFileSync(`apps/shared/src/examples/${id}/example.html`, "utf8");

async function load(page: Page, body: string, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.setContent(`<!doctype html><html><body>${body}</body></html>`);
  await page.addStyleTag({ content: css });
}

/** Number of distinct column positions among an element's children. */
const columnCount = (page: Page, selector: string) =>
  page
    .locator(selector)
    .evaluate(
      (el) =>
        new Set(
          [...el.children].map((c) =>
            Math.round(c.getBoundingClientRect().left),
          ),
        ).size,
    );

for (const [width, expected] of [
  [375, 1],
  [600, 2],
  [900, 2],
  [1100, 3],
] as const) {
  test(`grid example: ${expected} column(s) at ${width}px`, async ({
    page,
  }) => {
    await load(page, example("grid"), width);
    expect(await columnCount(page, ".grid:not(.autofit)")).toBe(expected);
  });
}

test("autofit grid never makes columns narrower than its minimum", async ({
  page,
}) => {
  await load(page, example("grid"), 375);
  const widths = await page
    .locator(".grid.autofit > *")
    .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
  const rem = 16;
  for (const w of widths) expect(w).toBeGreaterThanOrEqual(8 * rem - 0.5);
});

test("content-wrapper columns stack below 64rem and sit side by side above", async ({
  page,
}) => {
  await load(page, example("content-wrapper"), 900);
  expect(await columnCount(page, ".layout")).toBe(1);
  await load(page, example("content-wrapper"), 1100);
  expect(await columnCount(page, ".layout")).toBe(2);
});

test("reversed content-wrapper shows the visual first from 64rem only", async ({
  page,
}) => {
  const html = example("content-wrapper").replace(
    "layout columns",
    "layout columns reversed",
  );
  const visualIsLeft = () =>
    page.locator(".layout").evaluate((el) => {
      const [text, visual] = [...el.children].map((c) =>
        c.getBoundingClientRect(),
      );
      return visual.left < text.left;
    });
  await load(page, html, 1100);
  expect(await visualIsLeft()).toBe(true);
  await load(page, html, 900);
  const stackedVisualFirst = await page.locator(".layout").evaluate((el) => {
    const [text, visual] = [...el.children].map((c) =>
      c.getBoundingClientRect(),
    );
    return visual.top < text.top;
  });
  expect(stackedVisualFirst).toBe(false);
});

test("a last column holding only an .image is a 3:2 visual", async ({
  page,
}) => {
  await load(page, example("content-wrapper"), 1100);
  const ratio = await page.locator(".layout > :last-child").evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.width / r.height;
  });
  expect(ratio).toBeCloseTo(1.5, 1);
});

test("section example: small padding, dark theme, centered container", async ({
  page,
}) => {
  await load(page, example("section"), 1280);
  const s = await page.locator(".section").evaluate((el) => {
    const cs = getComputedStyle(el);
    const root = getComputedStyle(document.documentElement);
    const probe = document.createElement("div");
    probe.style.paddingTop = "var(--section-space-small)";
    el.append(probe);
    const small = getComputedStyle(probe).paddingTop;
    probe.remove();
    return {
      paddingTop: cs.paddingTop,
      small,
      scheme: cs.colorScheme,
      textAlign: getComputedStyle(el.querySelector(".text")!).textAlign,
      rootBg: root.backgroundColor,
      bg: cs.backgroundColor,
    };
  });
  expect(s.paddingTop).toBe(s.small);
  expect(s.scheme).toBe("dark");
  expect(s.bg).not.toBe(s.rootBg);
  expect(s.textAlign).toBe("center");
});

test("a non-container child of a section is a background layer behind the content", async ({
  page,
}) => {
  await load(
    page,
    `<section class="section"><div class="image" id="bg"></div><div class="container"><p class="text">Hi</p></div></section>`,
    1000,
  );
  const bg = await page.locator("#bg").evaluate((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const s = el.parentElement!.getBoundingClientRect();
    return {
      position: cs.position,
      pointer: cs.pointerEvents,
      covers: r.width === s.width && r.height === s.height,
    };
  });
  expect(bg).toEqual({ position: "absolute", pointer: "none", covers: true });
});

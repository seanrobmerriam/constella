// Marquee, tested on the documented example markup against the built
// stylesheet and behavior (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const behavior = readFileSync("apps/shared/dist/behaviors/marquee.js", "utf8");
const raw = readFileSync(
  "apps/shared/src/examples/marquee/example.html",
  "utf8",
);
const example = raw.replace(/<script[\s\S]*?<\/script>/g, "");
const origin = "http://constella.test";

async function load(page: Page, { body = example, script = true } = {}) {
  await page.setViewportSize({ width: 1000, height: 600 });
  await page.route(`${origin}/**`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html><head><style>${css}</style></head><body>${body}${
        script
          ? `<script type="module">${behavior.replace(/export\s*\{[^}]*\};?/, "")}
             window.__cleanups = [...document.querySelectorAll(".marquee_wrap")].map(initMarquee);</script>`
          : ""
      }</body></html>`,
    }),
  );
  await page.goto(`${origin}/`);
  if (script) await page.waitForFunction(() => (window as any).__cleanups);
}

const wrap = (page: Page, n = 0) => page.locator(".marquee_wrap").nth(n);
const track = (page: Page, n = 0) => page.locator(".marquee_track").nth(n);
const playState = (page: Page, n = 0) =>
  track(page, n).evaluate((el) => getComputedStyle(el).animationPlayState);
const offset = (page: Page, n = 0) =>
  track(page, n).evaluate((el) => el.getBoundingClientRect().left);
// A pause takes effect on the next frame, so measure after it has rendered.
const nextFrames = (page: Page) =>
  page.evaluate(
    () =>
      new Promise((done) =>
        requestAnimationFrame(() => requestAnimationFrame(done)),
      ),
  );
const toggle = (page: Page, n = 0) =>
  wrap(page, n).locator("[data-marquee-toggle]");

test("plays, and the toggle pauses and resumes it", async ({ page }) => {
  await load(page);
  await expect(wrap(page)).toHaveAttribute("data-state", "playing");
  expect(await playState(page)).toBe("running");
  const start = await offset(page);
  await expect.poll(() => offset(page)).toBeLessThan(start);

  await toggle(page).click();
  await expect(wrap(page)).toHaveAttribute("data-state", "paused");
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
  await expect(toggle(page)).toHaveAccessibleName("Play");
  expect(await playState(page)).toBe("paused");
  await nextFrames(page);
  const held = await offset(page);
  await page.waitForTimeout(300);
  expect(await offset(page)).toBe(held);

  await toggle(page).click();
  await expect(toggle(page)).toHaveAccessibleName("Pause");
  expect(await playState(page)).toBe("running");
});

test("reduced motion starts paused; pressing play runs it", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await load(page);
  await expect(wrap(page)).toHaveAttribute("data-state", "paused");
  await expect(toggle(page)).toHaveAccessibleName("Play");
  const held = await offset(page);
  await page.waitForTimeout(300);
  expect(await offset(page)).toBe(held);

  await toggle(page).click();
  await expect(wrap(page)).toHaveAttribute("data-state", "playing");
  await expect.poll(() => offset(page)).toBeLessThan(held);
});

test("the visitor's choice outlasts a change to the motion setting", async ({
  page,
}) => {
  await load(page);
  await toggle(page).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(wrap(page)).toHaveAttribute("data-state", "paused");
});

test("follows the motion setting until the visitor chooses", async ({
  page,
}) => {
  await load(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(wrap(page)).toHaveAttribute("data-state", "paused");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(wrap(page)).toHaveAttribute("data-state", "playing");
});

test("holds while something inside has focus", async ({ page }) => {
  await load(page, {
    body: example.replace(
      '<p class="text text-style-large">Strategy</p>',
      '<a id="inside" href="#">Strategy</a>',
    ),
  });
  await page.locator("#inside").first().focus();
  expect(await playState(page)).toBe("paused");
});

test("the copy panel is hidden from assistive technology and the tab order", async ({
  page,
}) => {
  await load(page);
  const panels = page.locator(".marquee_panel");
  await expect(panels.nth(1)).toHaveAttribute("aria-hidden", "true");
  await expect(panels.nth(1)).toHaveAttribute("inert", "");
  await expect(panels.nth(0)).not.toHaveAttribute("aria-hidden", /.*/);
});

test("each marquee has its own toggle", async ({ page }) => {
  await load(page, { body: example + example });
  await toggle(page, 1).click();
  await expect(wrap(page, 0)).toHaveAttribute("data-state", "playing");
  await expect(wrap(page, 1)).toHaveAttribute("data-state", "paused");
});

test("cleanup stops the strip and the toggle", async ({ page }) => {
  await load(page);
  await page.evaluate(() =>
    (window as any).__cleanups.forEach((c: () => void) => c()),
  );
  await expect(wrap(page)).not.toHaveAttribute("data-state", /.*/);
  expect(await playState(page)).toBe("paused");
});

test("without the script the strip holds still and the toggle is hidden", async ({
  page,
}) => {
  await load(page, { script: false });
  expect(await playState(page)).toBe("paused");
  await expect(toggle(page)).toBeHidden();
});

test("text items keep their descenders inside the clipped strip", async ({
  page,
}) => {
  await load(page);
  const item = page.locator(".marquee_panel p").first();
  const fits = await item.evaluate((el) => {
    const viewport = el.closest(".marquee_viewport")!.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    return {
      trim: getComputedStyle(el).textBoxTrim ?? "none",
      inside: box.top >= viewport.top && box.bottom <= viewport.bottom,
    };
  });
  expect(fits).toEqual({ trim: "none", inside: true });
});

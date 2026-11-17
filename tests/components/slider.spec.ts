// Slider, tested on the documented example markup against the built
// stylesheet and behavior (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const behavior = readFileSync("apps/shared/dist/behaviors/slider.js", "utf8");
const raw = readFileSync(
  "apps/shared/src/examples/slider/example.html",
  "utf8",
);
const example = raw.replace(/<script[\s\S]*?<\/script>/g, "");
const origin = "http://constella.test";

// A link in the first slide, to check clicks after a drag.
const withLink = example.replace(
  '<h3 class="heading text-style-h5">Strategy</h3>',
  '<h3 class="heading text-style-h5"><a id="first" href="#strategy">Strategy</a></h3>',
);

async function load(page: Page, { body = example, script = true } = {}) {
  await page.setViewportSize({ width: 1000, height: 700 });
  await page.route(`${origin}/**`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html><head><style>${css}</style></head><body><main class="section"><div class="container">${body}</div></main>${
        script
          ? `<script type="module">${behavior.replace(/export\s*\{[^}]*\};?/, "")}
             window.__cleanups = [...document.querySelectorAll(".slider_wrap")].map(initSlider);</script>`
          : ""
      }</body></html>`,
    }),
  );
  await page.goto(`${origin}/`);
  if (script) await page.waitForFunction(() => (window as any).__cleanups);
}

const list = (page: Page, n = 0) => page.locator(".slider_list").nth(n);
const scrollLeft = (page: Page, n = 0) =>
  list(page, n).evaluate((el) => el.scrollLeft);
const settled = async (page: Page, n = 0) => {
  let last = -1;
  await expect
    .poll(async () => {
      const now = await scrollLeft(page, n);
      const same = now === last;
      last = now;
      return same;
    })
    .toBe(true);
};

test("labels each slide and draws one marker per reachable position", async ({
  page,
}) => {
  await load(page);
  await expect(page.locator(".slider_wrap")).toHaveClass(/is-ready/);
  const slides = list(page).locator("> *");
  await expect(slides).toHaveCount(5);
  await expect(slides.nth(1)).toHaveAttribute("role", "group");
  await expect(slides.nth(1)).toHaveAttribute("aria-label", "2 of 5");
  // Three in view at 1000px, so five slides have three positions.
  await expect(page.locator(".slider_marker")).toHaveCount(3);
  await expect(page.locator(".slider_marker").first()).toHaveAttribute(
    "aria-current",
    "true",
  );
});

test("next and previous move one slide and disable at the ends", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await load(page);
  const prev = page.getByRole("button", { name: "Previous slide" });
  const next = page.getByRole("button", { name: "Next slide" });
  await expect(prev).toBeDisabled();
  await expect(next).toBeEnabled();

  await next.click();
  await settled(page);
  await expect(
    page.getByRole("button", { name: "Go to slide 2" }),
  ).toHaveAttribute("aria-current", "true");
  await expect(prev).toBeEnabled();

  await next.click();
  await settled(page);
  await expect(next).toBeDisabled();

  await prev.click();
  await prev.click();
  await settled(page);
  expect(await scrollLeft(page)).toBe(0);
  await expect(prev).toBeDisabled();
});

test("a marker jumps to its position", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await load(page);
  await page.getByRole("button", { name: "Go to slide 3" }).click();
  await settled(page);
  await expect(
    page.getByRole("button", { name: "Go to slide 3" }),
  ).toHaveAttribute("aria-current", "true");
  await expect(page.getByRole("button", { name: "Next slide" })).toBeDisabled();
});

test("a mouse drag scrolls and snaps; only the click ending it is swallowed", async ({
  page,
}) => {
  await load(page, { body: withLink });
  const box = (await list(page).boundingBox())!;
  const y = box.y + 40;
  await page.mouse.move(box.x + 600, y);
  await page.mouse.down();
  await page.mouse.move(box.x + 450, y, { steps: 5 });
  await page.mouse.move(box.x + 300, y, { steps: 5 });
  await page.mouse.up();
  await settled(page);
  const stride = await list(page).evaluate((el) => {
    const [a, b] = el.children;
    return b.getBoundingClientRect().left - a.getBoundingClientRect().left;
  });
  const left = await scrollLeft(page);
  expect(left).toBeGreaterThan(0);
  expect(Math.abs(left / stride - Math.round(left / stride))).toBeLessThan(
    0.02,
  );
  await expect(list(page)).not.toHaveClass(/is-dragging/);

  // The next activation, here by keyboard, goes through.
  await page.locator("#first").focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#strategy$/);
});

test("a drag that ends on a link does not follow it", async ({ page }) => {
  await load(page, { body: withLink });
  const link = (await page.locator("#first").boundingBox())!;
  const y = link.y + link.height / 2;
  await page.mouse.move(link.x + link.width / 2 + 200, y);
  await page.mouse.down();
  await page.mouse.move(link.x + link.width / 2, y, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(100);
  expect(page.url()).not.toContain("#strategy");
});

test("each slider works on its own", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await load(page, { body: example + example });
  await page.getByRole("button", { name: "Next slide" }).nth(1).click();
  await settled(page, 1);
  expect(await scrollLeft(page, 0)).toBe(0);
  expect(await scrollLeft(page, 1)).toBeGreaterThan(0);
  await expect(
    page.locator(".slider_wrap").nth(0).locator(".slider_marker").first(),
  ).toHaveAttribute("aria-current", "true");
});

test("hides the controls when every slide fits", async ({ page }) => {
  await load(page, {
    body: example.replace("--_visible-md: 3", "--_visible-md: 5"),
  });
  await expect(page.locator(".slider_controls")).toHaveClass(/is-empty/);
  await expect(page.locator(".slider_controls")).toBeHidden();
});

test("cleanup removes the markers, labels and ready state", async ({
  page,
}) => {
  await load(page);
  await page.evaluate(() =>
    (window as any).__cleanups.forEach((c: () => void) => c()),
  );
  await expect(page.locator(".slider_marker")).toHaveCount(0);
  await expect(page.locator(".slider_wrap")).not.toHaveClass(/is-ready/);
  await expect(list(page).locator("> *").first()).not.toHaveAttribute(
    "aria-label",
    /of/,
  );
});

test("without the script the list still scrolls and the controls are hidden", async ({
  page,
}) => {
  await load(page, { script: false });
  await expect(page.locator(".slider_controls")).toBeHidden();
  await list(page).focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => scrollLeft(page)).toBeGreaterThan(0);
});

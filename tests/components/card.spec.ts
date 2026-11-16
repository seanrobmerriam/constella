// Card, tested on the documented example markup against the built stylesheet
// (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

let n = 0;
const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const example = readFileSync(
  "apps/shared/src/examples/card/example.html",
  "utf8",
)
  // Give each card a distinct destination so clicks can be told apart.
  .replace(/href="#"/g, () => `href="#card-${++n}"`);

async function load(page: Page, body = example, width = 1280) {
  await page.setViewportSize({ width, height: 1000 });
  await page.setContent(`<!doctype html><html><body>${body}</body></html>`);
  await page.addStyleTag({ content: css });
}

test("clicking anywhere on a card follows its action", async ({ page }) => {
  await load(page);
  const cards = page.locator(".card_wrap");
  for (let i = 0; i < 3; i++) {
    const card = cards.nth(i);
    const href = await card.locator(".button_wrap").getAttribute("href");
    // Click the top-left area, well away from the button.
    await card.click({ position: { x: 12, y: 12 } });
    expect(new URL(page.url()).hash).toBe(href);
  }
});

test("another link in the card stays separately clickable", async ({
  page,
}) => {
  await load(
    page,
    `<div class="card_wrap"><div class="card_content margin-trim">
       <p class="text"><a id="inner" href="#inner-target">Author</a></p>
       <div class="input-wrapper"><a class="button_wrap secondary" href="#card">Read</a></div>
     </div></div>`,
  );
  await page.locator("#inner").click();
  expect(new URL(page.url()).hash).toBe("#inner-target");
});

test("buttons line up at the bottom of a row of cards", async ({ page }) => {
  await load(
    page,
    example.replace(
      "A tinted surface. Its button is secondary.",
      "A tinted surface. ".repeat(12),
    ),
  );
  const bottoms = await page
    .locator(".card_wrap:not(.cover) .input-wrapper")
    .evaluateAll((els) =>
      els.map((e) => Math.round(e.getBoundingClientRect().bottom)),
    );
  // Default and stacked cards share a row at 1280px.
  expect(new Set(bottoms).size).toBe(1);
});

test("variants: default has a surface, cover puts the image behind, stacked has none", async ({
  page,
}) => {
  await load(page);
  const v = await page.evaluate(() => {
    const [d, c, s] = [...document.querySelectorAll(".card_wrap")];
    const visual = c.querySelector(".card_visual")!.getBoundingClientRect();
    const card = c.getBoundingClientRect();
    return {
      defaultBg: getComputedStyle(d).backgroundColor,
      stackedBg: getComputedStyle(s).backgroundColor,
      coverFilled: visual.width === card.width && visual.height === card.height,
      coverMinHeight: getComputedStyle(c).minHeight,
      stackedRatio: (() => {
        const r = s.querySelector(".card_visual")!.getBoundingClientRect();
        return r.width / r.height;
      })(),
    };
  });
  expect(v.defaultBg).not.toBe("rgba(0, 0, 0, 0)");
  expect(v.stackedBg).toBe("rgba(0, 0, 0, 0)");
  expect(v.coverFilled).toBe(true);
  expect(v.coverMinHeight).toBe("320px");
  expect(v.stackedRatio).toBeCloseTo(1.5, 1);
});

test("a card with an action zooms its image on hover", async ({ page }) => {
  await load(page);
  const card = page.locator(".card_wrap.stacked");
  await card.hover();
  await page.waitForTimeout(600);
  const scale = await card
    .locator(".image")
    .evaluate((el) => getComputedStyle(el).scale);
  expect(scale).toBe("1.04");
});

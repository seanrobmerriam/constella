// Img, Video, Icon and Overlay, tested on the documented example markup
// against the built stylesheet (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const example = (id: string) =>
  readFileSync(`apps/shared/src/examples/${id}/example.html`, "utf8");

async function load(page: Page, body: string, width = 1000) {
  await page.setViewportSize({ width, height: 900 });
  await page.setContent(`<!doctype html><html><body>${body}</body></html>`);
  await page.addStyleTag({ content: css });
}
const box = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height };
    });

test("image has the loading tint and crops to a ratio; transparent fits without tint", async ({
  page,
}) => {
  await load(page, example("img"));
  const [tinted, clear] = await page.locator("img").evaluateAll((els) =>
    els.map((e) => {
      const s = getComputedStyle(e);
      return { bg: s.backgroundColor, fit: s.objectFit };
    }),
  );
  expect(tinted.bg).not.toBe("rgba(0, 0, 0, 0)");
  expect(tinted.fit).toBe("cover");
  expect(clear.bg).toBe("rgba(0, 0, 0, 0)");
  expect(clear.fit).toBe("contain");
  const { w, h } = await box(page, "img");
  expect(w / h).toBeCloseTo(1.5, 1);
});

test("video keeps 16:9 and loads nothing before play with preload=none", async ({
  page,
}) => {
  const requested: string[] = [];
  page.on("request", (r) => requested.push(r.url()));
  await load(page, example("video"));
  const { w, h } = await box(page, "video");
  expect(w / h).toBeCloseTo(16 / 9, 1);
  expect(requested.filter((u) => u.endsWith(".mp4"))).toEqual([]);
});

test("icon sizes are 1em, 1.5em and 2em of the surrounding text", async ({
  page,
}) => {
  await load(page, example("icon"));
  const font = await page
    .locator(".flex-horizontal-wrap")
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  const widths = await page
    .locator(".flex-horizontal-wrap > svg.icon")
    .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
  expect(widths.map((w) => Math.round((w / font) * 100) / 100)).toEqual([
    1, 1.5, 2,
  ]);
});

test("an icon inside a button takes the button's text color", async ({
  page,
}) => {
  await load(page, example("icon"));
  const [svg, link] = await page
    .locator(".button_wrap")
    .evaluate((a) => [
      getComputedStyle(a.querySelector("svg")!).color,
      getComputedStyle(a).color,
    ]);
  expect(svg).toBe(link);
});

test("overlay fills its section above the image; strength and gradient change it", async ({
  page,
}) => {
  await load(page, example("overlay"));
  const o = await page.locator(".overlay").evaluate((el) => {
    const r = el.getBoundingClientRect();
    const s = el.parentElement!.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      covers: r.width === s.width && r.height === s.height,
      gradient: cs.backgroundImage.startsWith("linear-gradient"),
    };
  });
  expect(o).toEqual({ covers: true, gradient: true });

  const alpha = async (strength: number) => {
    await load(
      page,
      `<div class="position-relative" style="height:100px"><div class="overlay" style="--_strength:${strength}"></div></div>`,
    );
    return page
      .locator(".overlay")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
  };
  expect(await alpha(20)).not.toBe(await alpha(80));
});

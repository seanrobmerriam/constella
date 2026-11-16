// Heading, Paragraph and RichText, tested on the documented example markup
// against the built stylesheet (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const example = (id: string) =>
  readFileSync(`apps/shared/src/examples/${id}/example.html`, "utf8");

async function load(page: Page, body: string, width = 1280) {
  await page.setViewportSize({ width, height: 900 });
  await page.setContent(`<!doctype html><html><body>${body}</body></html>`);
  await page.addStyleTag({ content: css });
}
const cs = (page: Page, selector: string, prop: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);

test("a heading's look is set by its style class, not its level", async ({
  page,
}) => {
  await load(page, `<h4 id="real">x</h4>` + example("heading"));
  const styledH2 = page.locator("h2.text-style-h4");
  await expect(styledH2).toHaveCount(1);
  expect(await cs(page, "h2.text-style-h4", "font-size")).toBe(
    await cs(page, "#real", "font-size"),
  );
});

test("eyebrows are paragraphs: a marker, or a filled tag in inverse colors", async ({
  page,
}) => {
  await load(page, example("heading"));
  const marker = await page
    .locator("p.eyebrow")
    .evaluate((el) => getComputedStyle(el, "::before").width);
  expect(parseFloat(marker)).toBeGreaterThan(0);
  const tag = await page.locator("p.eyebrow-tag").evaluate((el) => {
    const s = getComputedStyle(el);
    const body = getComputedStyle(document.body);
    return { bg: s.backgroundColor, color: s.color, bodyColor: body.color };
  });
  expect(tag.bg).toBe(tag.bodyColor);
  expect(tag.color).not.toBe(tag.bodyColor);
});

test("--_mw limits line length in characters", async ({ page }) => {
  await load(page, example("heading"));
  const { width, ch } = await page.locator("h3.heading").evaluate((el) => {
    const probe = document.createElement("span");
    probe.style.width = "20ch";
    probe.style.display = "inline-block";
    el.append(probe);
    const ch = probe.getBoundingClientRect().width;
    probe.remove();
    return { width: el.getBoundingClientRect().width, ch };
  });
  expect(width).toBeLessThanOrEqual(ch + 0.5);
});

test("text after a heading drops its top margin; after an eyebrow it keeps it", async ({
  page,
}) => {
  await load(
    page,
    `<h2 class="heading text-style-h2">H</h2><p class="text" id="a">After heading</p>
     <p class="heading eyebrow text-style-small">E</p><p class="text" id="b">After eyebrow</p>`,
  );
  expect(await cs(page, "#a", "margin-top")).toBe("0px");
  expect(parseFloat(await cs(page, "#b", "margin-top"))).toBeGreaterThan(0);
});

test("paragraph styles change size; an unstyled paragraph inherits main", async ({
  page,
}) => {
  await load(page, example("paragraph"));
  const sizes = await page
    .locator("p.text")
    .evaluateAll((els) =>
      els.map((e) => parseFloat(getComputedStyle(e).fontSize)),
    );
  const [large, main, small] = sizes;
  expect(large).toBeGreaterThan(main);
  expect(main).toBeGreaterThan(small);
  expect(main).toBe(parseFloat(await cs(page, "body", "font-size")));
});

test("rich text styles unclassed HTML: trimmed ends, nested markers, quote rule", async ({
  page,
}) => {
  await load(page, example("rich-text"));
  expect(await cs(page, ".rich-text > :first-child", "margin-top")).toBe("0px");
  expect(await cs(page, ".rich-text > :last-child", "margin-bottom")).toBe(
    "0px",
  );
  expect(await cs(page, ".rich-text > ul", "list-style-type")).toBe("disc");
  expect(await cs(page, ".rich-text ul ul", "list-style-type")).toBe("circle");
  expect(
    parseFloat(await cs(page, ".rich-text blockquote", "border-left-width")),
  ).toBeGreaterThan(0);
  expect(await cs(page, ".rich-text a", "text-decoration-line")).toBe(
    "underline",
  );
  // Headings inside keep their own style.
  await page.evaluate(() =>
    document.body.insertAdjacentHTML("beforeend", "<h3 id='ref'>r</h3>"),
  );
  expect(await cs(page, ".rich-text h3", "font-size")).toBe(
    await cs(page, "#ref", "font-size"),
  );
});

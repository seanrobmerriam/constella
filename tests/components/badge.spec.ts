// Badge: the documented example against the built stylesheet, in each
// theme, and the Astro props on the feedback regression page.
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const example = readFileSync(
  "apps/shared/src/examples/badge/example.html",
  "utf8",
);

async function load(page: Page, theme = "light") {
  await page.setContent(
    `<!doctype html><html lang="en" class="theme-${theme}"><body><main class="section"><div class="container">${example}</div></main></body></html>`,
  );
  await page.addStyleTag({ content: css });
}
const tokenColor = (page: Page, token: string) =>
  page.evaluate((t) => {
    const probe = document.createElement("span");
    probe.style.color = `var(${t})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);
const style = (page: Page, selector: string, prop: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);

test("status badges show a dot in their status color; others have none", async ({
  page,
}) => {
  await load(page);
  for (const tone of ["info", "success", "warning", "error"]) {
    const dot = await page
      .locator(`.badge.${tone}`)
      .evaluate((el) => getComputedStyle(el, "::before").backgroundColor);
    expect(dot, tone).toBe(await tokenColor(page, `--status-${tone}`));
  }
  for (const selector of [".badge:not([class*=' '])", ".badge.brand"]) {
    const content = await page
      .locator(selector)
      .first()
      .evaluate((el) => getComputedStyle(el, "::before").content);
    expect(content, selector).toBe("none");
  }
});

test("the brand badge stays visible in every theme", async ({ page }) => {
  for (const theme of ["light", "dark", "brand"]) {
    await load(page, theme);
    const page_ = await style(page, "html", "background-color");
    const section = await style(page, ".section", "background-color");
    const badge = await style(page, ".badge.brand", "background-color");
    expect(badge, theme).not.toBe(section);
    expect(badge, theme).not.toBe(page_);
  }
});

test("the brand badge keeps its color inside a secondary button", async ({
  page,
}) => {
  await load(page);
  const loose = await style(page, "p .badge.brand", "background-color");
  const inButton = await style(
    page,
    ".button_wrap .badge.brand",
    "background-color",
  );
  expect(inButton).toBe(loose);
  expect(inButton).not.toBe("rgba(0, 0, 0, 0)");
});

test("badges scale with the text around them", async ({ page }) => {
  await load(page);
  const inText = parseFloat(await style(page, "p .badge", "font-size"));
  const inHeading = parseFloat(await style(page, "h3 .badge", "font-size"));
  expect(inHeading).toBeGreaterThan(inText);
});

test("a count in a button has words for screen readers", async ({ page }) => {
  await load(page);
  await expect(
    page.getByRole("link", { name: "Inbox 3 unread" }),
  ).toBeVisible();
});

test("Astro: tone sets the class, neutral adds none", async ({ page }) => {
  await page.goto("/feedback-regression");
  await expect(page.locator("#badge-neutral")).toHaveAttribute(
    "class",
    "badge",
  );
  await expect(page.locator("#badge-brand")).toHaveClass("badge brand");
  await expect(page.locator("#badge-error")).toHaveClass("badge error");
});

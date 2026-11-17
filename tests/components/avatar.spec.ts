// Avatar: the documented example against the built stylesheet, and the
// Astro props on the feedback regression page.
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const example = readFileSync(
  "apps/shared/src/examples/avatar/example.html",
  "utf8",
);

async function load(page: Page, theme = "light") {
  await page.setContent(
    `<!doctype html><html lang="en" class="theme-${theme}"><body><main class="section"><div class="container">${example}</div></main></body></html>`,
  );
  await page.addStyleTag({ content: css });
}
const box = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { width: r.width, height: r.height, left: r.left, right: r.right };
    });

test("sizes are 32, 44 and 64px squares", async ({ page }) => {
  await load(page);
  expect(await box(page, ".avatar.small")).toMatchObject({
    width: 32,
    height: 32,
  });
  expect(await box(page, ".avatar:not(.small, .large)")).toMatchObject({
    width: 44,
    height: 44,
  });
  expect(await box(page, ".avatar.large")).toMatchObject({
    width: 64,
    height: 64,
  });
});

test("a photo fills the avatar and is cropped to it", async ({ page }) => {
  await load(page);
  const img = page.locator(".avatar.large > img");
  expect(await box(page, ".avatar.large > img")).toMatchObject({
    width: 64,
    height: 64,
  });
  await expect(img).toHaveCSS("object-fit", "cover");
  const radius = await page
    .locator(".avatar.large")
    .evaluate((el) => getComputedStyle(el).borderRadius);
  await expect(img).toHaveCSS("border-radius", radius);
});

test("square avatars round less than round ones", async ({ page }) => {
  await load(page);
  const radius = (selector: string) =>
    page
      .locator(selector)
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
  expect(await radius(".avatar.square")).toBeLessThan(
    await radius(".avatar:not(.square)"),
  );
});

test("screen readers get one name per avatar", async ({ page }) => {
  await load(page);
  await expect(
    page.getByRole("img", { name: "Grace Hopper", exact: true }),
  ).toHaveCount(2);
  await expect(page.getByRole("img", { name: "3 more members" })).toBeVisible();
  // The avatar beside the name is hidden, so the name is read once.
  await expect(page.locator("p.text .avatar")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(
    page.getByRole("group", { name: "Project members" }).getByRole("img"),
  ).toHaveCount(4);
});

test("grouped avatars overlap, with a ring in the background color", async ({
  page,
}) => {
  for (const theme of ["light", "dark", "brand"]) {
    await load(page, theme);
    const items = page.locator(".avatar_group > .avatar");
    const first = await items.nth(0).boundingBox();
    const second = await items.nth(1).boundingBox();
    expect(second!.x, theme).toBeLessThan(first!.x + first!.width);
    const background = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.style.color = "var(--background)";
      document.querySelector(".avatar_group")!.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });
    const shadow = await items
      .nth(1)
      .evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow, theme).toContain(background);
  }
});

test("Astro: photo, initials, set initials, decorative and group", async ({
  page,
}) => {
  await page.goto("/feedback-regression");
  const photo = page.locator("#avatar-photo");
  await expect(photo).toHaveClass("avatar");
  await expect(photo.locator("img")).toHaveAttribute("alt", "Ada Lovelace");
  await expect(photo).not.toHaveAttribute("role");

  const initials = page.locator("#avatar-initials");
  await expect(initials).toHaveClass("avatar large");
  await expect(initials).toHaveAttribute("role", "img");
  await expect(initials).toHaveAttribute("aria-label", "grace brewster hopper");
  await expect(initials).toHaveText("GH");

  const set = page.locator("#avatar-set");
  await expect(set).toHaveClass("avatar square");
  await expect(set).toHaveText("kj");
  await expect(set).toHaveCSS("text-transform", "uppercase");

  const decorative = page.locator("#avatar-decorative");
  await expect(decorative).toHaveClass("avatar small");
  await expect(decorative).toHaveAttribute("aria-hidden", "true");
  await expect(decorative).not.toHaveAttribute("role");

  await expect(
    page.getByRole("group", { name: "Members" }).getByRole("img"),
  ).toHaveCount(2);
});

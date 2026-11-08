import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/heading-regression");
});

const tag = (page: import("@playwright/test").Page, id: string) =>
  page.locator(`#${id}`).evaluate((el) => el.tagName);

test("eyebrow variants omit tag and render p; explicit tags are kept", async ({
  page,
}) => {
  expect(await tag(page, "eyebrow")).toBe("P");
  expect(await tag(page, "eyebrow-tag")).toBe("P");
  expect(await tag(page, "eyebrow-h3")).toBe("H3");
  expect(await tag(page, "span")).toBe("SPAN");
});

test("ordinary Heading keeps its defaults", async ({ page }) => {
  expect(await tag(page, "plain")).toBe("H2");
  await expect(page.locator("#plain")).toHaveClass(/text-style-h2/);
  expect(await tag(page, "h4")).toBe("H4");
  await expect(page.locator("#h4")).toHaveClass(/text-style-h4/);
});

test("eyebrow shows a marker, the tag variant a filled pill", async ({
  page,
}) => {
  const marker = await page.locator("#eyebrow").evaluate((el) => {
    const s = getComputedStyle(el, "::before");
    return { content: s.content, width: s.width };
  });
  expect(marker.content).not.toBe("none");
  const tagStyle = await page.locator("#eyebrow-tag").evaluate((el) => {
    const s = getComputedStyle(el);
    const b = getComputedStyle(el, "::before");
    return { bg: s.backgroundColor, padding: s.paddingLeft, before: b.content };
  });
  expect(tagStyle.bg).not.toBe("rgba(0, 0, 0, 0)");
  expect(tagStyle.padding).not.toBe("0px");
  expect(tagStyle.before).toBe("none");
});

test("maxWidth and native attributes are forwarded", async ({ page }) => {
  const el = page.locator("#mw");
  await expect(el).toHaveAttribute("data-x", "1");
  expect(
    await el.evaluate((e) =>
      (e as HTMLElement).style.getPropertyValue("--_mw"),
    ),
  ).toBe("10ch");
});

test("page has no wrapper element around eyebrows", async ({ page }) => {
  expect(await page.locator(".eyebrow_wrap").count()).toBe(0);
});

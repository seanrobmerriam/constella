// TanStack Start: every canonical TSX example rendered on the server and
// hydrated, against the built CSS and behaviors. Build with
// `bun run --cwd tests/fixtures/tanstack-start build`; Playwright starts its
// production server on port 4341 when PW_INTEGRATIONS is set.
import { integrationChecks, test, expect, watch } from "./shared.ts";

const url = "http://localhost:4341/";

integrationChecks(async (page) => {
  await page.goto(url);
  // Behaviors start in effects, so wait for hydration to finish.
  await expect(page.locator("[data-theme-toggle]")).toHaveAttribute(
    "aria-pressed",
    /true|false/,
  );
  await page.waitForLoadState("networkidle");
});

test("the server HTML links the stylesheet in <head> and contains every example", async ({
  request,
}) => {
  const html = await (await request.get(url)).text();
  const head = html.slice(0, html.indexOf("</head>"));
  const css = head.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+\.css)"/);
  expect(css).not.toBeNull();
  const sheet = await request.get(new URL(css![1], url).href);
  expect(sheet.ok()).toBe(true);
  expect(sheet.headers()["content-type"]).toContain("text/css");
  expect(await sheet.text()).toContain(".button_wrap");
  expect(html.match(/data-example="/g)).toHaveLength(30);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the server-rendered page is already styled", async ({ page }) => {
    await page.goto(url);
    const button = page.locator('[data-example="button"] .button_wrap').first();
    await expect(button).toHaveCSS("display", /flex/);
    await expect(page.locator('[data-example="grid"] .grid').first()).toHaveCSS(
      "display",
      "grid",
    );
  });
});

test("hydrates without mismatch warnings, and the saved theme applies before the app loads", async ({
  page,
}) => {
  const problems = watch(page);
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  expect(problems).toEqual([]);

  // With the app's scripts blocked, only the inline theme script can set it.
  await page.evaluate(() => localStorage.setItem("constella-theme", "dark"));
  await page.route("**/assets/*.js", (route) => route.abort());
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
});

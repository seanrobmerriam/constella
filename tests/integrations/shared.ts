// The checks every integration fixture must pass. Each fixture page renders
// all canonical examples, each inside `[data-example="<id>"]`, plus a theme
// toggle. `open(page)` loads it however that fixture is served.
import { expect, test, type Page } from "@playwright/test";
import { components } from "../../apps/shared/src/manifest.ts";

/** Every documented component has one example, and every fixture renders them all. */
const exampleCount = components.filter((c) => c.status === "documented").length;

type Open = (page: Page) => Promise<void>;

export const inExample = (page: Page, id: string) =>
  page.locator(`[data-example="${id}"]`);

/** Collects failed requests, 4xx/5xx responses and console errors. */
export function watch(page: Page) {
  const problems: string[] = [];
  page.on("requestfailed", (r) => problems.push(`failed: ${r.url()}`));
  page.on("response", (r) => {
    if (r.status() >= 400) problems.push(`${r.status()}: ${r.url()}`);
  });
  page.on("pageerror", (e) => problems.push(`error: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(`console: ${m.text()}`);
  });
  return problems;
}

export function integrationChecks(open: Open) {
  test("loads with no failed requests or errors, and the stylesheet applies", async ({
    page,
  }) => {
    const problems = watch(page);
    await open(page);
    await expect(page.locator("[data-example]")).toHaveCount(exampleCount);
    const button = inExample(page, "button").locator(".button_wrap").first();
    await expect(button).toHaveCSS("display", /flex/);
    await expect(button).not.toHaveCSS("padding-top", "0px");
    expect(problems).toEqual([]);
  });

  test("layout: the grid lays out columns", async ({ page }) => {
    await open(page);
    const grid = inExample(page, "grid").locator(".grid").first();
    await expect(grid).toHaveCSS("display", "grid");
    const columns = await grid.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
    );
    expect(columns).toBeGreaterThan(1);
  });

  test("forms: the form sends without leaving the page; the range shows its value", async ({
    page,
  }) => {
    await open(page);
    // After open, so it takes precedence over the fixture's own routes.
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 200, body: "{}" }),
    );
    const form = inExample(page, "form");
    await form.locator('[name="name"]').fill("Ada");
    await form.locator('[name="email"]').fill("ada@example.com");
    await form.locator('[name="message"]').fill("Hello");
    await form.locator('button[type="submit"], button:not([type])').click();
    await expect(form.locator(".form_wrap")).toHaveAttribute(
      "data-state",
      "sent",
    );
    await expect(page).not.toHaveURL(/api\/contact/);

    const range = inExample(page, "range");
    await range.locator('input[type="range"]').focus();
    await page.keyboard.press("ArrowRight");
    await expect(range.locator(".form-range_value")).not.toHaveText("40");
  });

  test("disclosure: the accordion opens one item at a time", async ({
    page,
  }) => {
    await open(page);
    const items = inExample(page, "accordion").locator("details");
    await expect(items.nth(0)).toHaveAttribute("open", "");
    await items.nth(1).locator("summary").click();
    await expect(items.nth(1)).toHaveAttribute("open", "");
    await expect(items.nth(0)).not.toHaveAttribute("open", "");
  });

  test("navbar: the menu toggles on a narrow screen", async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await open(page);
    const toggle = inExample(page, "navbar").locator("[data-navbar-toggle]");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("theme: the toggle switches to dark and remembers it", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await open(page);
    const html = page.locator("html");
    await expect(html).toHaveClass(/theme-light/);
    const toggle = page.locator("[data-theme-toggle]").first();
    await toggle.click();
    await expect(html).toHaveClass(/theme-dark/);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await page.reload();
    await expect(html).toHaveClass(/theme-dark/);
  });

  test("tabs: selecting a tab shows its panel", async ({ page }) => {
    await open(page);
    const tabs = inExample(page, "tabs");
    await tabs.getByRole("tab", { name: "Design" }).click();
    await expect(tabs.getByRole("tab", { name: "Design" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(tabs.getByRole("tabpanel", { name: "Design" })).toBeVisible();
  });

  test("modal: opens from its trigger and Escape closes it", async ({
    page,
  }) => {
    await open(page);
    const modal = inExample(page, "modal");
    await modal.locator("[data-modal-open]").click();
    await expect(modal.locator("dialog")).toHaveAttribute("open", "");
    await page.keyboard.press("Escape");
    await expect(modal.locator("dialog")).not.toHaveAttribute("open", "");
    await expect(modal.locator("[data-modal-open]")).toBeFocused();
  });
}

/**
 * For server-rendered fixtures: the first response is complete and styled,
 * hydration is clean, and the theme doesn't wait for the app's scripts.
 */
export function serverRenderedChecks(url: string) {
  test("the server HTML links the stylesheet in <head> and contains every example", async ({
    request,
  }) => {
    const html = await (await request.get(url)).text();
    const head = html.slice(0, html.indexOf("</head>"));
    const css = head.match(
      /<link[^>]+(?:rel="stylesheet"[^>]+href="([^"]+\.css)"|href="([^"]+\.css)"[^>]+rel="stylesheet")/,
    );
    expect(css).not.toBeNull();
    const sheet = await request.get(new URL(css![1] ?? css![2], url).href);
    expect(sheet.ok()).toBe(true);
    expect(sheet.headers()["content-type"]).toContain("text/css");
    expect(await sheet.text()).toContain(".button_wrap");
    expect(html.match(/data-example="/g)).toHaveLength(exampleCount);
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("the server-rendered page is already styled", async ({ page }) => {
      await page.goto(url);
      await expect(
        inExample(page, "button").locator(".button_wrap").first(),
      ).toHaveCSS("display", /flex/);
      await expect(inExample(page, "grid").locator(".grid").first()).toHaveCSS(
        "display",
        "grid",
      );
    });
  });

  test("hydrates without warnings, and the saved theme applies before the app loads", async ({
    page,
  }) => {
    const problems = watch(page);
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    expect(problems).toEqual([]);

    // With the app's scripts blocked, only the inline theme script can set it.
    await page.evaluate(() => localStorage.setItem("constella-theme", "dark"));
    await page.route("**/*.js", (route) => route.abort());
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/theme-dark/);
  });
}

/**
 * Waits until the behaviors have started. It looks for something only a
 * behavior adds: the tabs behavior gives each tab its role. (The theme
 * toggle's aria-pressed is no good: it is in the server's HTML already.)
 */
export const waitForBehaviors = (page: Page) =>
  expect(
    inExample(page, "tabs").locator('[role="tab"]').first(),
  ).toBeAttached();

/** Opens a server-rendered fixture and waits for hydration to finish. */
export const openHydrated = (url: string) => async (page: Page) => {
  await page.goto(url);
  await waitForBehaviors(page);
  await page.waitForLoadState("networkidle");
};

export { test, expect };

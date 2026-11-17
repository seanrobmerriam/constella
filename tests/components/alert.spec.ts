// Alert: the documented example against the built stylesheet and behavior,
// and the Astro props on the feedback regression page.
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const behavior = readFileSync("apps/shared/dist/behaviors/alert.js", "utf8");
const example = readFileSync(
  "apps/shared/src/examples/alert/example.html",
  "utf8",
).replace(/<script[\s\S]*?<\/script>/g, "");
const origin = "http://constella.test";

async function load(page: Page, { body = example, script = true } = {}) {
  await page.route(`${origin}/**`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html lang="en" class="theme-light"><head><style>${css}</style></head><body>
        <main tabindex="-1">${body}<a id="after" href="#">After</a></main>
        ${
          script
            ? `<script type="module">${behavior.replace(/export\s*\{[^}]*\};?/, "")}
              window.__events = [];
              document.addEventListener("alert-dismiss", (e) => __events.push(e.target.className));
              window.__cleanups = [...document.querySelectorAll(".alert_wrap")].map(initAlert);</script>`
            : ""
        }</body></html>`,
    }),
  );
  await page.goto(`${origin}/`);
  if (script) await page.waitForFunction(() => (window as any).__cleanups);
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

test("each tone's border and icon use its status color", async ({ page }) => {
  await load(page);
  const alerts = page.locator(".alert_wrap");
  const tones = ["info", "success", "warning", "error"];
  for (const [i, tone] of tones.entries()) {
    const expected = await tokenColor(page, `--status-${tone}`);
    await expect(alerts.nth(i)).toHaveCSS("border-left-color", expected);
    await expect(alerts.nth(i).locator(".alert_icon")).toHaveCSS(
      "color",
      expected,
    );
  }
});

test("alerts in the page from the start have no role", async ({ page }) => {
  await load(page);
  for (const alert of await page.locator(".alert_wrap").all())
    await expect(alert).not.toHaveAttribute("role", /.*/);
});

test("dismissing hides the alert, moves focus on and fires an event", async ({
  page,
}) => {
  await load(page);
  const dismiss = page.getByRole("button", { name: "Dismiss" });
  await dismiss.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".alert_wrap.error")).toBeHidden();
  await expect(page.locator("#after")).toBeFocused();
  expect(await page.evaluate(() => (window as any).__events)).toEqual([
    "alert_wrap error is-ready",
  ]);
  // Only that alert went.
  await expect(page.locator(".alert_wrap:visible")).toHaveCount(3);
});

test("with nothing after it, focus goes to main", async ({ page }) => {
  await load(page, {
    body: example.replace(/<a id="after"[^>]*>After<\/a>/, ""),
  });
  await page.evaluate(() => document.getElementById("after")?.remove());
  await page.getByRole("button", { name: "Dismiss" }).click();
  await expect(page.locator("main")).toBeFocused();
});

test("without the script the dismiss button is hidden", async ({ page }) => {
  await load(page, { script: false });
  await expect(page.locator(".alert_wrap.error")).toBeVisible();
  await expect(page.locator(".alert_dismiss")).toBeHidden();
});

test("cleanup hides the button again and stops it working", async ({
  page,
}) => {
  await load(page);
  await page.evaluate(() =>
    (window as any).__cleanups.forEach((c: () => void) => c()),
  );
  await expect(page.locator(".alert_dismiss")).toBeHidden();
  await page.locator(".alert_dismiss").dispatchEvent("click");
  await expect(page.locator(".alert_wrap.error")).toBeVisible();
});

test.describe("Astro props", () => {
  test.beforeEach(({ page }) => page.goto("/feedback-regression"));

  test("role is set only when asked for", async ({ page }) => {
    await expect(page.locator("#plain")).not.toHaveAttribute("role", /.*/);
    await expect(page.locator("#status")).toHaveAttribute("role", "status");
    await expect(page.locator("#urgent")).toHaveAttribute("role", "alert");
  });

  test("tone, icon and dismiss render as documented", async ({ page }) => {
    await expect(page.locator("#status")).toHaveClass(/\bsuccess\b/);
    await expect(page.locator("#plain .alert_title")).toHaveText("Plain");
    await expect(page.locator("#no-icon .alert_icon")).toHaveCount(0);
    await expect(page.locator("#plain .alert_dismiss")).toHaveCount(0);
    const dismiss = page.locator("#urgent").getByRole("button", {
      name: "Dismiss",
    });
    await expect(dismiss).toBeVisible();
    await dismiss.click();
    await expect(page.locator("#urgent")).toBeHidden();
    await expect(page.locator("#after")).toBeFocused();
  });
});

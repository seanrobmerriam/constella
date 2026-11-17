// Cleanup and multiple-instance checks for behaviors whose own specs don't
// cover them, on the documented example markup against the built stylesheet
// and behaviors (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const origin = "http://constella.test";
const example = (id: string) =>
  readFileSync(`apps/shared/src/examples/${id}/example.html`, "utf8").replace(
    /<script[\s\S]*?<\/script>/g,
    "",
  );
const behavior = (name: string) =>
  readFileSync(`apps/shared/dist/behaviors/${name}.js`, "utf8").replace(
    /export\s*\{[^}]*\};?/,
    "",
  );

async function load(
  page: Page,
  body: string,
  name: string,
  init: string,
  selector: string,
  width = 1000,
) {
  await page.setViewportSize({ width, height: 700 });
  await page.route(`${origin}/**`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html><head><style>${css}</style></head><body>${body}
        <script type="module">${behavior(name)}
        window.__cleanups = [...document.querySelectorAll(${JSON.stringify(selector)})].map(${init});</script>
        </body></html>`,
    }),
  );
  await page.goto(`${origin}/`);
  await page.waitForFunction(() => (window as any).__cleanups);
}
const cleanUp = (page: Page) =>
  page.evaluate(() =>
    (window as any).__cleanups.forEach((c: () => void) => c()),
  );

test("accordion cleanup removes the shared name it added", async ({ page }) => {
  await load(
    page,
    example("accordion"),
    "accordion",
    "initAccordion",
    "[data-accordion]",
  );
  const items = page.locator("details");
  const name = await items.first().getAttribute("name");
  expect(name).toBeTruthy();
  await expect(items.nth(1)).toHaveAttribute("name", name!);
  await cleanUp(page);
  for (const item of await items.all())
    await expect(item).not.toHaveAttribute("name", /.*/);
});

test("navbar cleanup closes the menu and the toggle stops working", async ({
  page,
}) => {
  await load(
    page,
    example("navbar"),
    "navbar",
    "initNavbar",
    "[data-navbar]",
    400,
  );
  const toggle = page.getByRole("button", { name: "Menu" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await cleanUp(page);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("[data-navbar]")).not.toHaveClass(/\bopen\b/);
});

test("two tab sets select independently", async ({ page }) => {
  const tabs = example("tabs");
  await load(
    page,
    tabs + tabs.replace('id="process"', 'id="process-2"'),
    "tabs",
    "initTabs",
    ".tabs_wrap",
  );
  const second = page.locator("#process-2");
  await second.getByRole("tab", { name: "Design" }).click();
  await expect(second.getByRole("tab", { name: "Design" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(
    page.locator("#process").getByRole("tab", { name: "Strategy" }),
  ).toHaveAttribute("aria-selected", "true");
  // Each set keeps its own key in the URL.
  const params = new URL(page.url()).searchParams;
  expect(params.get("process-2")).toBe("design");
  expect(params.has("process")).toBe(false);
});

test("two modals open from their own triggers", async ({ page }) => {
  const modal = example("modal");
  await load(
    page,
    modal + modal.replaceAll("newsletter", "offer"),
    "modal",
    "initModal",
    ".modal_wrap",
  );
  await page.locator('[data-modal-open="offer"]').click();
  await expect(page.locator("#offer")).toHaveAttribute("open", "");
  await expect(page.locator("#newsletter")).not.toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(page.locator("#offer")).not.toHaveAttribute("open", "");
  await expect(page.locator('[data-modal-open="offer"]')).toBeFocused();

  await page.locator('[data-modal-open="newsletter"]').click();
  await expect(page.locator("#newsletter")).toHaveAttribute("open", "");
  await expect(page.locator("#offer")).not.toHaveAttribute("open", "");
});

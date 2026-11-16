// Form, Fieldset, Input, Textarea, Select, Choice and Range, tested on the
// documented example markup against the built stylesheet and the built
// behaviors (run `bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const behavior = (name: string) =>
  readFileSync(`apps/shared/dist/behaviors/${name}.js`, "utf8");
const example = (id: string) =>
  readFileSync(`apps/shared/src/examples/${id}/example.html`, "utf8").replace(
    /<script[\s\S]*?<\/script>/g,
    "",
  );

const origin = "http://constella.test";

/** Serves the page from a fake origin so `fetch` to /api/... can be routed. */
async function load(page: Page, body: string, width = 1000) {
  await page.setViewportSize({ width, height: 1000 });
  await page.route(`${origin}/`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html><head><style>${css}</style></head><body>${body}</body></html>`,
    }),
  );
  await page.goto(`${origin}/`);
}

/** Runs a built behavior's init on every matching root; exposes cleanups. */
async function init(page: Page, name: string, fn: string, selector: string) {
  await page.addScriptTag({
    type: "module",
    content: `${behavior(name).replace(/export\s*\{[^}]*\};?/, "")}
      window.__cleanups = [...document.querySelectorAll("${selector}")].map(${fn});`,
  });
  await page.waitForFunction(() => (window as any).__cleanups);
}

async function fillContact(page: Page) {
  await page.fill('input[name="name"]', "Ada");
  await page.fill('input[name="email"]', "ada@example.com");
  await page.fill('textarea[name="message"]', "Hello");
}

test.describe("form behavior", () => {
  test("invalid fields block sending and nothing is requested", async ({
    page,
  }) => {
    let requests = 0;
    await page.route(`${origin}/api/contact`, (r) => {
      requests++;
      return r.fulfill({ status: 200, body: "{}" });
    });
    await load(page, example("form"));
    await init(page, "form", "initForm", ".form_wrap");
    await page.click('button[type="submit"]');
    expect(await page.locator(".form_wrap").getAttribute("data-state")).toBe(
      "idle",
    );
    expect(requests).toBe(0);
  });

  test("a 2xx answer shows the sent note and hides and clears the fields", async ({
    page,
  }) => {
    let body = "";
    await page.route(`${origin}/api/contact`, async (r) => {
      body = r.request().postData() ?? "";
      await r.fulfill({ status: 200, body: "{}" });
    });
    await load(page, example("form"));
    await init(page, "form", "initForm", ".form_wrap");
    await fillContact(page);
    await page.click('button[type="submit"]');
    await expect(page.locator(".form_wrap")).toHaveAttribute(
      "data-state",
      "sent",
    );
    expect(body).toContain("ada@example.com");
    await expect(page.locator(".form_note-sent")).toBeVisible();
    await expect(page.locator(".form_fields")).toBeHidden();
    expect(await page.inputValue('input[name="email"]')).toBe("");
  });

  test("an error answer shows the failed note and keeps the values", async ({
    page,
  }) => {
    await page.route(`${origin}/api/contact`, (r) =>
      r.fulfill({ status: 500, body: "" }),
    );
    await load(page, example("form"));
    await init(page, "form", "initForm", ".form_wrap");
    await fillContact(page);
    await page.click('button[type="submit"]');
    await expect(page.locator(".form_wrap")).toHaveAttribute(
      "data-state",
      "failed",
    );
    await expect(page.locator(".form_note-failed")).toBeVisible();
    expect(await page.inputValue('input[name="email"]')).toBe(
      "ada@example.com",
    );
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test("GET forms send the fields as the query string", async ({ page }) => {
    let url = "";
    await page.route(`${origin}/api/contact?**`, async (r) => {
      url = r.request().url();
      await r.fulfill({ status: 200, body: "{}" });
    });
    await load(page, example("form").replace('method="post"', 'method="get"'));
    await init(page, "form", "initForm", ".form_wrap");
    await fillContact(page);
    await page.click('button[type="submit"]');
    await expect(page.locator(".form_wrap")).toHaveAttribute(
      "data-state",
      "sent",
    );
    expect(new URL(url).searchParams.get("email")).toBe("ada@example.com");
  });

  test("cleanup stops it handling submits", async ({ page }) => {
    await load(page, example("form"));
    await init(page, "form", "initForm", ".form_wrap");
    await page.evaluate(() =>
      (window as any).__cleanups.forEach((c: () => void) => c()),
    );
    // With the handler gone, a valid submit is a native navigation.
    await page.route(`${origin}/api/contact`, (r) =>
      r.fulfill({ contentType: "text/html", body: "<p id=done>native</p>" }),
    );
    await fillContact(page);
    await page.click('button[type="submit"]');
    await expect(page.locator("#done")).toHaveText("native");
  });
});

test.describe("range behavior", () => {
  test("keeps the fill, handle and shown value in step with the input", async ({
    page,
  }) => {
    await load(page, example("range"));
    await init(page, "range", "initRange", ".form-range");
    const root = page.locator(".form-range");
    await expect(root).toHaveClass(/is-drawn/);
    await page.locator(".form-range_input").fill("80");
    await expect(page.locator(".form-range_value")).toHaveText("80");
    expect(
      await root.evaluate((el) => el.style.getPropertyValue("--_progress")),
    ).toBe("0.8");
  });

  test("the keyboard moves it by its step", async ({ page }) => {
    await load(page, example("range"));
    await init(page, "range", "initRange", ".form-range");
    await page.locator(".form-range_input").focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".form-range_value")).toHaveText("45");
  });

  test("without the behavior the custom handle stays hidden", async ({
    page,
  }) => {
    await load(page, example("range"));
    await expect(page.locator(".form-range_handle")).toBeHidden();
  });

  test("cleanup removes is-drawn", async ({ page }) => {
    await load(page, example("range"));
    await init(page, "range", "initRange", ".form-range");
    await page.evaluate(() =>
      (window as any).__cleanups.forEach((c: () => void) => c()),
    );
    await expect(page.locator(".form-range")).not.toHaveClass(/is-drawn/);
  });
});

test("labels name their controls, and required fields are marked", async ({
  page,
}) => {
  await load(page, example("input") + example("textarea") + example("select"));
  await expect(page.getByLabel("Email")).toHaveAttribute("type", "email");
  await expect(page.getByLabel("Message")).toHaveJSProperty("required", true);
  await expect(page.getByLabel("Topic")).toHaveJSProperty("required", true);
  // A hidden label still names its field.
  await expect(page.getByLabel("Search")).toHaveAttribute("type", "search");
  await expect(page.locator(".field-star").first()).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});

test("textarea grows with its content up to its maximum", async ({ page }) => {
  await load(page, example("textarea"));
  const field = page.locator("textarea");
  const start = (await field.boundingBox())!.height;
  await field.fill("line\n".repeat(5));
  const grown = (await field.boundingBox())!.height;
  await field.fill("line\n".repeat(40));
  const capped = (await field.boundingBox())!.height;
  expect(grown).toBeGreaterThan(start);
  expect(capped).toBeGreaterThan(grown);
  expect(capped).toBeLessThan(start * 4);
});

test("select fades its prompt until a choice is made", async ({ page }) => {
  await load(page, example("select"));
  const color = () =>
    page.locator("select").evaluate((el) => getComputedStyle(el).color);
  const prompt = await color();
  await page.selectOption("select", "support");
  expect(await color()).not.toBe(prompt);
});

test("choices: clicking the label toggles, chips act as one radio group", async ({
  page,
}) => {
  await load(page, example("choice"));
  const toggle = page.getByLabel("Dark mode");
  await page.getByText("Dark mode").click();
  await expect(toggle).toBeChecked();
  await page.getByText("Yearly").click();
  await expect(page.getByLabel("Yearly")).toBeChecked();
  await expect(page.getByLabel("Monthly")).not.toBeChecked();
  // The chips' group is named by its fieldset legend.
  await expect(page.getByRole("group", { name: "Billing" })).toBeVisible();
});

test("fieldset columns split from 48rem and stack below", async ({ page }) => {
  const columns = async (width: number) => {
    await load(page, example("fieldset"), width);
    return page
      .locator(".form-fieldset.columns .form-fieldset_fields > *")
      .evaluateAll(
        (els) =>
          new Set(els.map((e) => Math.round(e.getBoundingClientRect().left)))
            .size,
      );
  };
  expect(await columns(1000)).toBe(2);
  expect(await columns(600)).toBe(1);
});

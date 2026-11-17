// Field help and errors: the documented example against the built
// stylesheet, and the Astro props on the field regression page.
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const example = readFileSync(
  "apps/shared/src/examples/field-message/example.html",
  "utf8",
);

async function loadExample(page: Page) {
  await page.setContent(
    `<!doctype html><html lang="en" class="theme-light"><body>${example}</body></html>`,
  );
  await page.addStyleTag({ content: css });
}
const borderColor = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => getComputedStyle(el).borderTopColor);
const statusError = (page: Page) =>
  page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.color = "var(--status-error)";
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });

test("help text describes the field without becoming part of its name", async ({
  page,
}) => {
  await loadExample(page);
  const email = page.getByRole("textbox", { name: "Email" });
  await expect(email).toHaveAccessibleName("Email");
  await expect(email).toHaveAccessibleDescription(
    "We only use it to send your receipt.",
  );
});

test("an error is described, marked invalid and bordered in the status color", async ({
  page,
}) => {
  await loadExample(page);
  const username = page.getByRole("textbox", { name: "Username" });
  await expect(username).toHaveAttribute("aria-invalid", "true");
  await expect(username).toHaveAccessibleDescription(
    "Letters, numbers and dashes. Usernames can't contain spaces. Try ada-lovelace.",
  );
  const error = await statusError(page);
  await expect.poll(() => borderColor(page, "#signup-name")).toBe(error);
  await expect(page.locator(".field-error")).toHaveCSS("color", error);
});

test("the browser's own validation borders a field only after the visitor interacts", async ({
  page,
}) => {
  await loadExample(page);
  const email = page.locator("#signup-email");
  const error = await statusError(page);
  expect(await borderColor(page, "#signup-email")).not.toBe(error);
  await email.fill("not-an-email");
  await email.blur();
  // The border color transitions, so wait for it to settle.
  await expect.poll(() => borderColor(page, "#signup-email")).toBe(error);
});

test.describe("Astro props", () => {
  test.beforeEach(({ page }) => page.goto("/field-regression"));

  test("a field without messages keeps the plain label markup", async ({
    page,
  }) => {
    const plain = page.locator("#plain");
    await expect(plain).not.toHaveAttribute("aria-describedby", /.*/);
    expect(await plain.evaluate((el) => el.parentElement!.tagName)).toBe(
      "LABEL",
    );
  });

  test("help and error render outside a <label for> and are linked", async ({
    page,
  }) => {
    const email = page.locator("#email");
    expect(await email.evaluate((el) => el.parentElement!.tagName)).toBe("DIV");
    await expect(page.locator('label[for="email"]')).toContainText("Email");
    await expect(email).toHaveAccessibleName("Email");
    await expect(email).toHaveAccessibleDescription(
      "We only use it to send your receipt.",
    );
    await expect(email).not.toHaveAttribute("aria-invalid", /.*/);

    const username = page.locator("#username");
    await expect(username).toHaveAttribute("aria-invalid", "true");
    await expect(username).toHaveAttribute(
      "aria-describedby",
      "username-help username-error",
    );
  });

  test("generated ids are unique and every reference resolves", async ({
    page,
  }) => {
    const problems = await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      const missing = [
        ...document.querySelectorAll("[aria-describedby], label[for]"),
      ].flatMap((el) =>
        (el.getAttribute("aria-describedby") ?? el.getAttribute("for")!)
          .split(" ")
          .filter((id) => !document.getElementById(id)),
      );
      return { dupes, missing };
    });
    expect(problems).toEqual({ dupes: [], missing: [] });
    await expect(
      page.getByRole("textbox", { name: "Message" }),
    ).toHaveAccessibleDescription("A few lines is plenty.");
    await expect(
      page.getByRole("combobox", { name: "Plan" }),
    ).toHaveAccessibleDescription("Choose a plan to continue.");
  });
});

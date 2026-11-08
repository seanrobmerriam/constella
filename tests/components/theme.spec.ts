import { expect, test } from "@playwright/test";
import { resolveTheme } from "../../apps/shared/src/behaviors/theme.ts";

test("resolveTheme precedence", () => {
  expect(resolveTheme(null, false, "inherit")).toBe("light");
  expect(resolveTheme(null, true, "inherit")).toBe("dark");
  expect(resolveTheme("light", true, "inherit")).toBe("light");
  expect(resolveTheme("dark", false, "inherit")).toBe("dark");
  expect(resolveTheme("light", true, "brand")).toBe("brand");
  expect(resolveTheme("dark", false, "light")).toBe("light");
});

test.describe("system dark", () => {
  test.use({ colorScheme: "dark" });
  test("follows system without a saved choice, saved choice wins", async ({
    page,
  }) => {
    await page.goto("/navbar-regression");
    await expect(page.locator("html")).toHaveClass(/theme-dark/);
    await page.locator("[data-theme-toggle]").click();
    await expect(page.locator("html")).toHaveClass(/theme-light/);
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/theme-light/);
  });
});

test("saved choice applies before first paint and system changes are ignored", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("constella-theme", "dark"),
  );
  await page.goto("/navbar-regression");
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
});

test("system change applies when nothing is saved", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/navbar-regression");
  await expect(page.locator("html")).toHaveClass(/theme-light/);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
});

test("blocked storage does not break first render or the toggle", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message + "\n" + e.stack));
  await page.goto("/navbar-regression");
  await expect(page.locator("html")).toHaveClass(/theme-light/);
  await page.locator("[data-theme-toggle]").click();
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  // Astro's own dev toolbar reads localStorage unguarded; only app errors count.
  expect(errors.filter((e) => !e.includes("dev-toolbar"))).toEqual([]);
});

test("locked layout theme wins and hides the toggle", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("constella-theme", "light"),
  );
  await page.goto("/theme-locked");
  await expect(page.locator("html")).toHaveClass(/theme-dark/);
  await expect(page.locator("[data-theme-toggle]")).toBeHidden();
});

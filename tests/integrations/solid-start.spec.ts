// SolidStart: every canonical example, converted to Solid by
// tests/fixtures/solid-start/convert.ts, rendered on the server and
// hydrated, against the built CSS and behaviors. Build with
// `bun run --cwd tests/fixtures/solid-start build`; Playwright starts its
// production server on port 4342 when PW_INTEGRATIONS is set.
import {
  expect,
  inExample,
  integrationChecks,
  openHydrated,
  serverRenderedChecks,
  test,
} from "./shared.ts";

const url = "http://localhost:4342/";

integrationChecks(openHydrated(url));
serverRenderedChecks(url);

test('a boolean attribute set to false is left off, not written as "false"', async ({
  page,
}) => {
  await openHydrated(url)(page);
  // The marquee's copy panel is inert; the original must not be.
  const panels = inExample(page, "marquee").locator(".marquee_panel");
  await expect(panels.nth(0)).not.toHaveAttribute("inert", /.*/);
  await expect(panels.nth(1)).toHaveAttribute("inert", "");
});

test("onCleanup runs the behavior's cleanup when the component unmounts", async ({
  page,
}) => {
  await page.goto(`${url}lifecycle`);
  const toggle = page.locator("[data-navbar-toggle]");
  // Hydrated once the menu answers.
  await page.setViewportSize({ width: 400, height: 800 });
  await expect(async () => {
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true", {
      timeout: 200,
    });
  }).toPass();
  // The navbar listens on document; its cleanup removes those listeners.
  await page.evaluate(() => {
    const w = window as unknown as { removed: string[] };
    w.removed = [];
    const remove = document.removeEventListener.bind(document);
    document.removeEventListener = (type: string, ...rest: never[]) => {
      w.removed.push(type);
      return remove(type, ...rest);
    };
  });
  await page.getByRole("button", { name: "Hide" }).click();
  await expect(page.locator("[data-navbar]")).toHaveCount(0);
  const removed = await page.evaluate(
    () => (window as unknown as { removed: string[] }).removed,
  );
  expect(removed).toEqual(expect.arrayContaining(["keydown", "click"]));

  // Shown again, it is a fresh, working navbar.
  await page.getByRole("button", { name: "Show" }).click();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
});

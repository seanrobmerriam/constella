// Automated accessibility checks: axe-core on every documented example, alone
// on a page with the built stylesheet and its behavior, in each theme. Each
// example sits in a Section and container, as it would on a real page. Build
// the shared package first (`bun run --cwd apps/shared build`).
import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { components } from "../../apps/shared/src/manifest.ts";

const css = readFileSync("apps/shared/dist/constella.css", "utf8");
const origin = "http://constella.test";
const themes = ["light", "dark", "brand"] as const;

const examples = components
  .filter((c) => c.status === "documented")
  .map((c) => ({ id: c.example!, behaviors: c.behaviors ?? [] }));

const behaviorScript = (names: string[]) =>
  names
    .map((name) =>
      readFileSync(`apps/shared/dist/behaviors/${name}.js`, "utf8").replace(
        /export\s*\{[^}]*\};?/,
        "",
      ),
    )
    .join("\n");

async function load(
  page: Page,
  id: string,
  theme: string,
  behaviors: string[],
) {
  const html = readFileSync(
    `apps/shared/src/examples/${id}/example.html`,
    "utf8",
  ).replace(/<script[\s\S]*?<\/script>/g, "");
  // The example's own script imports by path; run the same init calls here.
  const source = readFileSync(
    `apps/shared/src/examples/${id}/example.html`,
    "utf8",
  );
  const calls = [
    ...source.matchAll(/<script type="module">([\s\S]*?)<\/script>/g),
  ]
    .map((m) => m[1].replace(/import[\s\S]*?;\n/g, ""))
    .join("\n");
  await page.route(`${origin}/**`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html lang="en" class="theme-${theme}"><head><title>${id}</title><style>${css}</style></head>
<body><main><section class="section"><div class="container">${html}</div></section></main><script type="module">${behaviorScript(behaviors)}
${calls}
window.__ready = true;</script></body></html>`,
    }),
  );
  await page.goto(`${origin}/`);
  await page.waitForFunction(() => (window as any).__ready);
}

for (const { id, behaviors } of examples)
  for (const theme of themes)
    test(`${id} (${theme}): no axe violations`, async ({ page }) => {
      await load(page, id, theme, behaviors);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const summary = violations.map(
        (v) =>
          `${v.id} (${v.impact}): ${v.help} — ${v.nodes
            .slice(0, 3)
            .map((n) => n.target.join(" "))
            .join(", ")}`,
      );
      expect(summary).toEqual([]);
    });

// WCAG 1.4.10 Reflow: at 320 CSS px wide (1280px at 400% zoom) nothing may
// need horizontal scrolling. Sliders and marquees scroll sideways by design,
// inside their own box, so only the page itself is measured.
for (const { id, behaviors } of examples)
  test(`${id}: reflows at 320px without horizontal page scrolling`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await load(page, id, "light", behaviors);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

// WCAG 2.4.7 Focus visible: every stop in the tab order shows an indicator.
for (const { id, behaviors } of examples)
  test(`${id}: every tab stop has a visible focus indicator`, async ({
    page,
  }) => {
    await load(page, id, "light", behaviors);
    const seen = new Set<string>();
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const stop = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const path = (node: Element): string =>
          node.parentElement
            ? `${path(node.parentElement)}>${node.tagName}:${[...node.parentElement.children].indexOf(node)}`
            : node.tagName;
        const s = getComputedStyle(el);
        const outline =
          s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0;
        const ring = s.boxShadow !== "none";
        return {
          key: path(el),
          label: el.outerHTML.slice(0, 80),
          shown: outline || ring,
        };
      });
      if (!stop || seen.has(stop.key)) break;
      seen.add(stop.key);
      expect(stop.shown, `no focus indicator on ${stop.label}`).toBe(true);
    }
  });

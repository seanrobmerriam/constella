// Plain HTML: the built CSS and behaviors next to one page that pastes every
// canonical example.html unchanged. Build with
// `bun run --cwd tests/fixtures/plain-html build`.
import { resolve } from "node:path";
import { integrationChecks, test, expect } from "./shared.ts";
import { origin, serveStatic } from "./serve-static.ts";

const dir = resolve("tests/fixtures/plain-html/dist");

integrationChecks(async (page) => {
  await serveStatic(page, dir);
  await page.goto(`${origin}/`);
});

test("no framework runtime: only the behavior modules load", async ({
  page,
}) => {
  const scripts: string[] = [];
  page.on("request", (r) => {
    if (r.resourceType() === "script") scripts.push(new URL(r.url()).pathname);
  });
  await serveStatic(page, dir);
  await page.goto(`${origin}/`);
  await page.waitForLoadState("networkidle");
  expect(scripts.length).toBeGreaterThan(0);
  for (const path of scripts) expect(path).toMatch(/^\/behaviors\/\w+\.js$/);
});

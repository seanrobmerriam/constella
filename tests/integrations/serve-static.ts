// Serves a built static fixture from a fake origin through Playwright's
// router, so every request the page makes is a real browser request with a
// real content type, and nothing listens on a port.
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import type { Page } from "@playwright/test";

const types: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".json": "application/json",
};

export const origin = "http://fixture.test";

export async function serveStatic(page: Page, dir: string) {
  await page.route(`${origin}/**`, async (route) => {
    const path = new URL(route.request().url()).pathname;
    let file = normalize(join(dir, decodeURIComponent(path)));
    if (!file.startsWith(dir)) return route.fulfill({ status: 403 });
    try {
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      await route.fulfill({
        body: await readFile(file),
        contentType: types[extname(file)] ?? "application/octet-stream",
      });
    } catch {
      await route.fulfill({ status: 404, body: "not found" });
    }
  });
}

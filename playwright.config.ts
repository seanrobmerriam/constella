import { defineConfig } from "@playwright/test";

const viewport = { width: 1280, height: 800 };

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:4321", viewport },
  webServer: [
    {
      command: "bun run dev:site",
      url: "http://localhost:4321",
      reuseExistingServer: true,
    },
    {
      command: "bun run dev:docs",
      url: "http://localhost:4322",
      reuseExistingServer: true,
    },
  ],
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});

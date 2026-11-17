import { defineConfig } from "@playwright/test";

const viewport = { width: 1280, height: 800 };

type Browser = "chromium" | "firefox" | "webkit";
const browsers = (process.env.PW_BROWSERS ?? "chromium")
  .split(",")
  .map((name) => name.trim()) as Browser[];

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:4331", viewport },
  webServer: [
    {
      // Own port, never reused: another project may hold 4321.
      command: "bun run dev:site -- --port 4331 --ignore-lock",
      url: "http://localhost:4331",
      reuseExistingServer: false,
    },
    ...(process.env.PW_DOCS
      ? [
          {
            command:
              "bun run --cwd apps/docs astro dev --port 4332 --ignore-lock",
            url: "http://localhost:4332",
            reuseExistingServer: false,
          },
        ]
      : []),
    // Server-rendered integration fixtures, built by `bun run build:fixtures`.
    ...(process.env.PW_INTEGRATIONS
      ? [
          {
            command: "bun run --cwd tests/fixtures/tanstack-start start",
            url: "http://localhost:4341",
            env: { PORT: "4341" },
            reuseExistingServer: false,
          },
          {
            command: "bun run --cwd tests/fixtures/solid-start start",
            url: "http://localhost:4342",
            env: { PORT: "4342" },
            reuseExistingServer: false,
          },
        ]
      : []),
  ],
  // Chromium by default. PW_BROWSERS=firefox,webkit runs the other engines
  // (CI's "Other browsers" job). The computed-style baseline is a Chromium
  // snapshot: other engines serialize the same colors differently.
  projects: browsers.map((name) => ({
    name,
    use: { browserName: name },
    testIgnore: name === "chromium" ? [] : ["**/baseline.spec.ts"],
  })),
});

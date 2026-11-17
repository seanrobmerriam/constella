// TanStack Start: every canonical TSX example rendered on the server and
// hydrated, against the built CSS and behaviors. Build with
// `bun run --cwd tests/fixtures/tanstack-start build`; Playwright starts its
// production server on port 4341 when PW_INTEGRATIONS is set.
import {
  integrationChecks,
  openHydrated,
  serverRenderedChecks,
} from "./shared.ts";

const url = "http://localhost:4341/";

integrationChecks(openHydrated(url));
serverRenderedChecks(url);

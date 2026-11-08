# Baseline (Task 1)

- Source commit: `5b921a5` plus the uncommitted `apps/docs` Constella scaffold present at start.
- `bun install`: no changes. `bun run build` and `bun run check`: both succeeded for site and shared.
- Findings reconciled against the plan:
  - Docs package was named `docs`, so the root `--filter '@constella/docs'` matched nothing and docs was silently skipped by `build`. Renamed to `@constella/docs`; the `check` script already existed. Port 4322 is set in `dev`/`preview`.
  - The docs app is currently a Constella-flavoured Astro app (not Starlight); Task 9 decides how to proceed.
  - `apps/docs/package-lock.json` (untracked) and `apps/docs/bun.lock` (deleted in the working tree) removed; root `bun.lock` is the only lockfile. Hoisted linker retained.
- Docs `check` reports 3 unused-import hints in `src/pages/index.astro` (pre-existing, no errors).
- Browser tests: `@playwright/test` at root, `test:components` and `test:docs` scripts, dev servers as webServer (4321 site, 4322 docs). Viewport 1280x800, font Inter (site-configured).
- Baseline fixture: `tests/fixtures/baseline.json` holds computed styles for Section, written/secondary Button, Dropdown summary, Heading, Input, Select and Textarea. Regenerate only deliberately with `UPDATE_BASELINE=1`.
- Environment note: `bunx playwright install` fails here (bun run with scripts ignored); use `node node_modules/@playwright/test/cli.js install chromium`.

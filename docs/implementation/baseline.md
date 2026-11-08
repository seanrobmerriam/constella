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

## Correction (found during Task 4)

The first `baseline.json` was captured against a dev server on port 4321 that belonged to a different project (`~/workspace/lumos-skills`), because the Playwright config reused whatever was listening. It was regenerated from the original component code (commit `672763e`, checked out in a scratch worktree) and the current code produces byte-identical values, so Tasks 2–3 preserved defaults. The config now starts the site on its own port (4331) with `reuseExistingServer: false`. Astro 7 backgrounds `astro dev` in agent environments, which makes Playwright think the server exited, so the command passes `--ignore-lock`. Docs tests start docs on 4332 only when `PW_DOCS` is set (`test:docs` sets it).

## Docs app reset (found during Task 4)

While Task 4 was in progress, `apps/docs` was replaced outside the plan work with a fresh Starlight starter (empty package name, no `check` script, nested lockfile, "My Docs" branding), matching the baseline the plan describes. The previous Lumos-flavoured scaffold is in git history (commit `672763e`). The Task 1 fixes were re-applied to the new app: name `@constella/docs`, private, `check` script with `@astrojs/check` and `typescript`, port 4322, nested lockfile removed. Build and check pass (0 errors). Task 9 builds on Starlight as the plan assumes.

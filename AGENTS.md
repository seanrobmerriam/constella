# Constella monorepo

Bun workspaces monorepo. Every package lives under `apps/`.

| Path             | Package             | What it is                                                               |
| ---------------- | ------------------- | ------------------------------------------------------------------------ |
| `apps/constella` | `@constella/site`   | Reference Astro site. Owns the Astro components, layouts and site config |
| `apps/docs`      | `@constella/docs`   | Documentation site (Astro Starlight), port 4322                          |
| `apps/shared`    | `@constella/shared` | Framework-independent source: styles, behaviors, contracts, examples     |

`apps/constella` and `apps/docs` each have their own `AGENTS.md`. Read it before
working in that app. `apps/constella` also has `CONSTELLA.md` and `.agents/skills/`.

The remaining work is tracked in `docs/completion-plan.md`. Read it before
changing a component, its styles or its docs.

## Commands (run from the repo root)

- `bun install`: install everything. There is one lockfile, `bun.lock`, at the root.
  Don't add per-app lockfiles, and don't use npm or pnpm.
- `bun run dev`: run the site and docs together. Use `bun run dev:site` or
  `bun run dev:docs` to run one.
- `bun run build`, `bun run check`: build or type-check every package.
- `bun run format`: Prettier over the whole repo. The config is in the root `.prettierrc`.
- Add a dependency to one package: `bun add <pkg> --cwd apps/<dir>`.
- `bun run check:docs`: verify the component manifest against the source, examples
  and docs pages. `bun run check:docs-sync` does the per-branch docs check CI runs.
- `bun run test:components`, `bun run test:docs`: Playwright suites. Build the shared
  CSS first (`bun run --cwd apps/shared build`).

CI (`.github/workflows/ci.yml`) runs all of these on every pull request.

## Changing a component

A component change is one commit or PR that updates all of these together. CI fails
if the docs fall behind.

1. Stylesheet: `apps/shared/src/styles/components/<family>.css`, including its header
   comment (root, children, variants, state, tokens, `Docs:` line).
2. Behavior, if any: `apps/shared/src/behaviors/<name>.ts`, also listed in
   `apps/shared/scripts/build-css.ts`.
3. Astro component: `apps/constella/src/components/<group>/<Name>.astro`.
4. Example: `apps/shared/src/examples/<id>/{example.html,Example.tsx}` and its
   registry entry in `examples/index.ts`.
5. Manifest entry: `apps/shared/src/manifest.ts`. Set `status: "documented"` once the
   page exists.
6. Docs page: `apps/docs/src/content/docs/components/<id>.mdx`, starting from
   `apps/docs/src/content/docs/components/_template.mdx.txt`. The sections are required,
   in order: Example, Markup, Variants and props, States, Accessibility, Behavior,
   Tokens, Related.
7. Tests: `tests/components/` for behavior and styling, `tests/docs/` for the page.
8. Migration note if a public name or behavior changes (`docs/completion-plan.md` Phase 5).

If a change can't affect the docs (formatting, a refactor with identical output), add
`Docs-Skip: <reason>` to a commit message so `check:docs-sync` lets it through.

## Shared package

`@constella/shared` holds only framework-independent code. Astro components stay
in `apps/constella/src/components/`.

| Path in `apps/shared/src` | What it holds                                                     |
| ------------------------- | ----------------------------------------------------------------- |
| `styles/`                 | `index.css` entry, base/patterns/utilities, `components/*.css`    |
| `behaviors/`              | Optional DOM behavior: `init…(root)` returning a cleanup function |
| `contracts/`              | Data-only TypeScript types (controls, navigation)                 |
| `examples/`               | Canonical HTML and TSX examples used by the docs                  |

Apps depend on it with `"@constella/shared": "workspace:*"` and import through
its `exports` map:

```astro
---
import "@constella/shared/styles/index.css";
import { initAccordion } from "@constella/shared/behaviors/accordion.ts";
import type { NavbarConfig } from "@constella/shared/contracts/navigation.ts";
---
```

Its source needs no build step. `bun run --cwd apps/shared build` writes the
distributable `dist/constella.css` and `dist/behaviors/*.js` for non-Astro users.

Import paths need the file extension. Inside `apps/shared`, use relative imports
and avoid app-specific aliases like `@/*`.

## Install layout

`bunfig.toml` sets `linker = "hoisted"`. Keep it. Astro's prerender bundle
resolves some dependencies by walking up parent directories. With Bun's
isolated linker, those lookups can leave the repo and pick up stray packages
(for example, an old CommonJS `cookie` in a parent directory), and the build
fails.

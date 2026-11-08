# Constella monorepo

Bun workspaces monorepo. Every package lives under `apps/`.

| Path             | Package             | What it is                                          |
| ---------------- | ------------------- | --------------------------------------------------- |
| `apps/constella` | `@constella/site`   | Main Astro site, built on Constella for Astro       |
| `apps/docs`      | `@constella/docs`   | Documentation site (Astro Starlight), port 4322     |
| `apps/shared`    | `@constella/shared` | Components, layouts, styles, config and utils (src) |

Each app has its own `AGENTS.md`. Read it before working in that app.
`apps/constella` also has `CONSTELLA.md` and `.agents/skills/`.

## Commands (run from the repo root)

- `bun install`: install everything. There is one lockfile, `bun.lock`, at the root.
  Don't add per-app lockfiles, and don't use npm or pnpm.
- `bun run dev`: run the site and docs together. Use `bun run dev:site` or
  `bun run dev:docs` to run one.
- `bun run build`, `bun run check`: build or type-check every package.
- `bun run format`: Prettier over the whole repo. The config is in the root `.prettierrc`.
- Add a dependency to one package: `bun add <pkg> --cwd apps/<dir>`.

## Shared package

`@constella/shared` ships its source and has no build step. Apps depend on it
with `"@constella/shared": "workspace:*"` and import through its `exports` map:

```astro
---
import Card from "@constella/shared/components/Card.astro";
import { slugify } from "@constella/shared/utils/slug.ts";
---
```

Import paths need the file extension. Inside `apps/shared`, use relative imports
and avoid app-specific aliases like `@/*`.

## Install layout

`bunfig.toml` sets `linker = "hoisted"`. Keep it. Astro's prerender bundle
resolves some dependencies by walking up parent directories. With Bun's
isolated linker, those lookups can leave the repo and pick up stray packages
(for example, an old CommonJS `cookie` in a parent directory), and the build
fails.

# Constella

Monorepo for the Constella site, its documentation, and the code they share.

```
apps/
  constella/   @constella/site    main Astro site (Constella for Astro)
  docs/        @constella/docs    Starlight docs
  shared/      @constella/shared  shared components, layouts, styles, utils
```

## Getting started

You need [Bun](https://bun.sh) 1.4 or later and Node 22 or later.

```sh
bun install
bun run dev        # site on :4321, docs on :4322
```

| Script                              | What it does                               |
| ----------------------------------- | ------------------------------------------ |
| `bun run dev`                       | Runs the site and docs dev servers         |
| `bun run dev:site` / `dev:docs`     | Runs one app                               |
| `bun run build`                     | Builds the site and docs to `apps/*/dist/` |
| `bun run build:site` / `build:docs` | Builds one app                             |
| `bun run check`                     | Type-checks every package (`astro check`)  |
| `bun run format` / `format:check`   | Prettier, write or check only              |

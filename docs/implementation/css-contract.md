# CSS contract

- Entry: `apps/shared/src/styles/index.css` declares `@layer base, patterns, components, utilities;` and imports base, patterns, every component file, then utilities. Plain HTML therefore does not depend on BaseHead for layer order.
- Built artifact: `bun run build` in `apps/shared` writes `apps/shared/dist/constella.css` (one file, Vite CSS bundling, no unresolved asset references). Git-ignored; exported as `@constella/shared/dist/constella.css`.
- Astro site: `apps/constella/src/styles/global.css` is a one-line import of the shared entry.
- Selector order inside the components layer is now alphabetical by file instead of import order. The baseline computed-style test passes unchanged.
- Verification: `tests/components/plain-html.spec.ts` loads `tests/fixtures/plain-html/index.html` with no scripts and checks that the Button styles apply and no request fails.
- Control metrics (size/radius values) are recorded here in Task 3.

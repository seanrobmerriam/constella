# CSS contract

- Entry: `apps/shared/src/styles/index.css` declares `@layer base, patterns, components, utilities;` and imports base, patterns, every component file, then utilities. Plain HTML therefore does not depend on BaseHead for layer order.
- Built artifact: `bun run build` in `apps/shared` writes `apps/shared/dist/constella.css` (one file, Vite CSS bundling, no unresolved asset references). Git-ignored; exported as `@constella/shared/dist/constella.css`.
- Astro site: `apps/constella/src/styles/global.css` is a one-line import of the shared entry.
- Selector order inside the components layer is now alphabetical by file instead of import order. The baseline computed-style test passes unchanged.
- Verification: `tests/components/plain-html.spec.ts` loads `tests/fixtures/plain-html/index.html` with no scripts and checks that the Button styles apply and no request fails.
- Control metrics (size/radius values) are recorded here in Task 3.

## Control size and radius (Task 3)

- API: `ControlSize = small | main | large`, `ControlRadius = none | small | main | round` (`@constella/shared/contracts/controls.ts`). Components take optional `size`/`radius`; the HTML equivalents are `data-size` / `data-radius` on the component root (`.button_wrap`, `.dropdown_wrap`, and the `label.field` root of Input/Select/Textarea).
- Size sets the control font size to `--text-small` (14–16px fluid), `--text-main` (16–18px) or `--text-large` (18–20px). Existing paddings are in `em`, so they scale with it. Omitted size changes nothing.
- Radius maps to `0`, `--radius-small` (0.5rem), `--radius-main` (1rem), `--radius-round` (100vw). Omitted radius keeps per-variant defaults. The Button `link` variant ignores radius (it is an underline with no box). Dropdown radius applies to the panel; the trigger has no box.
- Dropdown size scales trigger and panel text/padding through inheritance. The panel stays a disclosure panel, not a select/listbox or ARIA menu.
- Checkbox, radio and range are not resized.
- `InputWrapper` replaces `ButtonWrapper` (class `.input-wrapper`); behaviour unchanged. The unused-by-site copy in `apps/docs` is replaced in Task 9.
- Tests in `tests/components/controls.spec.ts` run against `apps/shared/dist/constella.css`, so rebuild it first (`bun run build` in `apps/shared`).

## Details, Summary, Accordion (Task 4)

- `Details` (`.details_wrap`) forwards native `<details>` attributes (`open`, `name`) and has a named `summary` slot plus a default body slot (`.details_body`). `Summary` (`.details_summary`) emits the native `<summary>` as the first child; no nested button. `AccordionItem` is removed; its styles moved to `details.css` (`.accordion_item`→`.details_wrap`, `.accordion_toggle`→`.details_summary`, `.accordion_icon`→`.details_icon`, `.accordion_body`→`.details_body`).
- `Accordion` no longer rewrites child HTML. It renders `data-accordion` with `data-single`, `data-open-first`, `data-group` and `data-preview`. `initAccordion(root)` (`@constella/shared/behaviors/accordion.ts`) returns a cleanup function and only touches items whose nearest `details`/accordion ancestor is the root, so nested accordions and plain nested disclosures stay independent.
- Without a `group`, the browser generates a collision-checked name (`accordion-N`); nothing random is rendered on the server. For no-script native grouping, set the same `name` on each `Details`, or pass `group` and add `name` yourself.
- Initial-open precedence: `openFirst` opens the first owned item and closes the others; otherwise a single group keeps only its first initially-open item. `single={false}` leaves items independent.
- Design-mode preview removes grouping names and restores them when the preview ends; cleanup disconnects the observer and removes names it added.
- Tests: `tests/components/disclosures.spec.ts` against `/disclosure-regression` (a noindex fixture page).

## Heading eyebrow variants (Task 5)

- `Eyebrow` is removed. `Heading` gains `variant="eyebrow"` (marker) and `variant="eyebrow-tag"` (filled pill), and `tag` now also accepts `p` and `span`. With an eyebrow variant and no `tag`, the element is a `p`; an explicit `tag` is kept. Ordinary headings are unchanged (`h2` default, style follows the tag). Both eyebrow variants use the `small` text style and render as one element: `.heading.eyebrow` / `.heading.eyebrow-tag` (no wrapper, no `.eyebrow_wrap`).
- The eyebrow is a block (`width: fit-content`), not a flex container, because the global `text-box: trim-both` only trims block text; a flex heading made the first section 11.6px taller than baseline. The marker is an absolutely positioned `::before`.
- The eyebrow resets the heading margins (it carried none before), and a `.text` directly after it keeps its own top margin.
- Migrated: `Card`, the homepage badge and every `example-components` use. `.stacki/components.json` and `CONSTELLA.md` updated. The Webflow-import skill docs still describe `Typography/Eyebrow`; they are Webflow-mapping notes and were not rewritten.
- Tests: `tests/components/heading.spec.ts` against `/heading-regression`; the baseline test confirms identical computed section height.

## Layout composition (Task 6)

- `BaseLayout` takes SEO inputs and `theme`, keeps the `head` slot, and exposes `header` and `footer` slots directly under `<body>`, outside `<main id="main" tabindex="-1">` (the default slot). It no longer renders a navbar or footer and no longer accepts `overlap`. Skip is automatic.
- `SkipLink` is now `Skip` (`.skip-link` class kept; stylesheet `skip.css`).
- `CustomLayoutExample.astro` is the BaseHead recipe: it imports `global.css`, `BaseHead` and `Skip`, and supplies its own `main`. It needs `site` and the `--font-inter` `fonts` entry from `apps/constella/astro.config.mjs`, since BaseHead renders `<Font>` and the canonical URL.
- Pages place `<Nav slot="header" />` / `<Footer slot="footer" />` explicitly. `Nav` still has its own `overlap` prop (the 404 page passes it there); Task 7 replaces it with sticky semantics. `Section` is untouched.
- Examples: `/minimal` (no header/footer), `/full` (explicit navbar and footer), `/custom-layout`. Tests: `tests/components/layout.spec.ts`.

## Navbar, search and theme (Task 7)

- `Nav` is now `Navbar`. Props: `render`, `sticky=true`, `search=false`, `themeToggle=false`, `icons=[]`, `config` (default `src/config/navbar.ts`) and a `search` slot. `overlap` is removed; `sticky={false}` means normal flow (`.nav_wrap.static`); there is no fixed overlay. The 404 page now uses ordinary section padding instead of `navoverlap` (Section itself is unchanged).
- Contracts (`@constella/shared/contracts/navigation.ts`) are data only: `SiteLink`, `IconLink`, `Brand`, `SearchConfig`, `NavbarConfig`. `brand: { mode: "site-name" }` renders the site logo labelled with `SITE_NAME` from `consts.ts` (this keeps the existing look); `mode: "custom"` renders text or an `<img>` logo.
- Icons come from `src/config/icons.ts` (`github`, `linkedin`). An unknown key throws at build time naming the known keys; extend by adding an SVG and a registry entry.
- Search is a native `<form role="search" method="get">` using `action`/`name`/`label`. A non-empty `search` slot replaces it. `search` with neither config nor slot fails the build with a clear message (checked). `/search-example` is a labelled demo destination that echoes the query through `textContent` (escaped).
- Theme: `resolveTheme(preference, systemDark, lockedTheme)` is the only precedence implementation (locked > saved `light`/`dark` > system). The head bootstrap is `bootstrapTheme` from `behaviors/theme.ts`, serialized with `toString()` into an inline `<script>` in `BaseHead`, so it is authored in TypeScript and receives `resolveTheme` rather than re-implementing it. A layout `theme` other than `inherit` sets `data-theme-locked` on `<html>`; the toggle is hidden by CSS and `initThemeToggle` does nothing. Storage access is try/catch-guarded. Note: pages with `theme="inherit"` now follow the system preference instead of always rendering light.
- Behaviors: `initNavbar(root)` and `initThemeToggle(root)` are root-scoped and return cleanup; the Astro script rebinds on `astro:page-load` and cleans up on `astro:before-swap`. Control IDs are per instance (`navbar-N-menu`, `navbar-N-search`). No-script fallback keeps the links visible.
- Known limit: the site does not use Astro's client router, so repeated-navigation behavior is covered by the cleanup/rebind design and not by a browser test. Astro's dev toolbar throws on blocked storage; the test ignores that source only.
- Tests: `tests/components/navbar.spec.ts`, `theme.spec.ts`; fixtures `/navbar-regression`, `/theme-locked`, `/search-example`.

## Footer variants (Task 8)

- `Footer` props: `render`, `variant="simple"` (`simple | columns`), `config` (default `src/config/footer.ts`), `theme` (`inherit` by default; adds `theme-*` to the footer only), `spacing` (`small` default, `medium`, `large`, from the section spacing scale). Slots `brand`, `cta`, `bottom` replace their default regions (brand logo and description, nothing, copyright/legal/social); `cta` renders only when supplied.
- `FooterConfig` (shared contract): `brand`, `description?`, `links`, `groups: { label, links }[]`, `socialLinks: IconLink[]`, `legalLinks`, `copyright` (text after the year). Social icons reuse the Navbar icon registry. Empty collections render no empty nav/list.
- `simple` shows `links` in one row; `columns` shows brand with description and one `nav` per group (each labelled by its group name). The footer sits outside `main`.
- The year is rendered on the server; the old client script and its `#year` ID were removed, so repeated footers cannot collide.
- Tests: `tests/components/footer.spec.ts` against `/footer-regression` (variants, empty collections, slots, 320px wrap, no duplicate IDs, theme/spacing).

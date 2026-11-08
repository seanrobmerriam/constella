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

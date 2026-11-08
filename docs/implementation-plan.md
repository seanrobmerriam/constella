# Constella Implementation Plan

> **For agentic workers:** Use the executing-plans workflow to implement this plan task by task. Steps use checkbox syntax for tracking. This document plans the work; it does not authorize deployment, package publication, or merging.

**Goal:** Deliver the approved component APIs, portable CSS, and Constella documentation with equivalent HTML / CSS and generic React TSX examples.

**Architecture:** Keep Astro as the reference development environment. Put shared CSS, portable behavior, contracts, and example source in `apps/shared`; keep app configuration and Astro-specific composition in `apps/constella`. Starlight embeds isolated previews built from the same CSS and example source that users copy.

**Tech stack:** Bun workspaces, Astro, Starlight, CSS custom properties and layers, TypeScript, React TSX examples, and focused browser verification. Retain the installed versions unless a concrete compatibility issue requires a change.

**Spec:** [Constella requirements and changes](https://chatgpt.com/library?file_id=libfile_81a615cb36a481919e2f3f7c0ebf88bb&account_id=personal), version 2. Companion documents: [overview](https://chatgpt.com/library?file_id=libfile_0df2b83dcf4081919abde2a10d86ae06&account_id=personal) and [component inventory](https://chatgpt.com/library?file_id=libfile_20fda752ed488191a0d50723351ae015&account_id=personal). The requirements supersede older component names in the inventory.

## Global constraints

- Use Bun from the repository root, one root lockfile, and the existing hoisted linker.
- All new scripting and examples use TypeScript or TSX. Retain existing tool configuration files where their extensions are required.
- Astro remains the development environment; consumers must be able to use CSS without Astro.
- Section retains its existing API, defaults, spacing, themes, and behavior.
- Documentation examples default to HTML / CSS and offer a general React TSX tab.
- Honor the root and app-level AGENTS.md files and `apps/constella/CONSTELLA.md` before execution. Update authoring guidance where approved naming and shared CSS ownership supersede current rules.
- Preserve existing component defaults unless this plan explicitly changes them.
- Search and themeToggle default to false. Icons render only from supplied configuration.
- Keep custom classes, variants, tokens, CSS layers, and relative units consistent with the existing framework.
- Do not publish packages, add hosted search, build account/hosting infrastructure, or implement every proposed expansion component as part of this delivery.

## Baseline and execution boundaries

Source inspected: commit `5b921a59927a2b0de66c07b51ec84923764d636c`. No build or browser checks were run while creating this plan. Reconcile subsequent changes before editing.

Verified issues include: docs package has an empty name and lacks a check script; docs has a nested lockfile; shared source folders are placeholders; docs contains Starlight starter branding. BaseHead is already a separate file. Nav is sticky by default and overlap switches it to fixed positioning. Dropdown is a details/summary disclosure, not a native select. Accordion currently substitutes attributes into serialized child HTML.

Execute as three sequential workstreams with reviewable commits: component contracts and APIs (Tasks 1–8), documentation and portability (Tasks 9–12), then release readiness (Tasks 13–14). Each task must leave a buildable checkpoint. Do not use temporary aliases unless needed to preserve an intermediate checkpoint; remove internal obsolete usages before completion.

## Review focus

1. Mixed labeled controls and long labels at narrow widths must wrap without losing labels or keyboard order — Task 3.
2. Two accordions, nested disclosures, and explicit initial-open states must not share accidental grouping — Task 4.
3. A second Navbar/Dropdown instance and client navigation must not duplicate IDs or listeners — Tasks 6 and 7.
4. Blocked browser storage, saved theme choices, and a locked layout theme must not break first render or expose an ineffective toggle — Task 7.
5. CSS resets and custom properties in live previews must not leak into Starlight, and copied examples must not rely on hidden styles — Tasks 9 and 10.

## File ownership and interfaces

All paths below are repository-relative. New paths are planned, not assertions that files already exist.

| Path                                                                                    | Responsibility                                                                        |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `apps/shared/src/styles/{base,patterns,utilities,controls,index}.css`                   | Portable foundation, shared control tokens, stylesheet entry point and layer order.   |
| `apps/shared/src/styles/components/*.css`                                               | One canonical stylesheet per component family, extracted from existing global styles. |
| `apps/shared/src/contracts/{controls,navigation}.ts`                                    | Framework-independent control and navigation data types.                              |
| `apps/shared/src/behaviors/{accordion,dropdown,navbar,theme}.ts`                        | Optional DOM behavior with explicit initialization and cleanup.                       |
| `apps/shared/src/examples/<component>/`                                                 | Canonical HTML, CSS, TSX, optional behavior, and example metadata.                    |
| `apps/constella/src/config/{navbar,footer}.ts`                                          | Site-specific links, brand, search destination, footer groups.                        |
| `apps/constella/src/components/`                                                        | Astro wrappers and source of reference markup.                                        |
| `apps/constella/src/layouts/{BaseLayout,CustomLayoutExample}.astro`                     | Document shell and independent BaseHead recipe.                                       |
| `apps/constella/src/pages/{index,example-components,minimal,full,search-example}.astro` | Starter, regression examples, composition recipes, demonstrative search destination.  |
| `apps/docs/src/components/{ComponentExample,PreviewFrame}.astro`                        | Shared two-tab reference pattern and isolated preview container.                      |
| `apps/docs/src/pages/previews/[...example].astro`                                       | Static example documents that load shared CSS.                                        |
| `apps/docs/src/content/docs/`                                                           | Getting started, foundations, components, integrations, migration.                    |
| `tests/components/*.spec.ts`, `tests/docs/*.spec.ts`                                    | Behavior and documentation integration checks.                                        |
| `tests/fixtures/{plain-html,react,tanstack-start,solidstart}/`                          | Minimal integration consumers, outside production app workspaces.                     |
| `docs/implementation/`                                                                  | Source audit, upstream map, API contract decisions, validation evidence.              |

### Implementation choices resolved by this plan

These resolve details left open by the requirements; they are implementation choices, not claims about existing APIs.

- Keep public spelling `Dropdown` to match source.
- Navbar uses `sticky=true` by default, retaining current in-flow sticky behavior. False means normal flow; fixed overlay is not included.
- BaseLayout uses named `header`, `footer`, and existing `head` slots; its default slot is the sole main-content region. Keep Skip automatic in BaseLayout. Custom layouts include Skip explicitly.
- Use size `small | main | large` and radius `none | small | main | round`. Omitted props preserve existing per-variant styles; explicit values opt into shared token mappings. Do not force a new radius onto existing icon/link variants when omitted.
- Store site configuration in `apps/constella/src/config/`. Shared contracts contain data only, with no Astro asset imports or React components.
- Search uses a GET form with configurable action and parameter name. Provide a named search slot for application-owned behavior. Enabling search without configuration or a nonempty slot is a clear build-time error.
- Use no deprecated public aliases in the final release. Include a complete breaking-change migration table instead.
- Initially distribute a built, complete CSS artifact and optional behavior entry points from the shared source; public package publication/naming is a later action. Document the real downloadable/copyable artifact, not an invented npm install command.

## Task 1 — Establish a reproducible baseline

**Requirements:** R-03, R-05. **Files:** root `package.json`, `bun.lock`; `apps/docs/package.json`, `apps/docs/astro.config.mjs`, `apps/docs/bun.lock`; new `docs/implementation/baseline.md`, `playwright.config.ts`, `tests/components/baseline.spec.ts`.

- [ ] Read repository/app instructions, check current branch/working tree, and isolate feature work without overwriting user edits.
- [ ] Run `bun install`, `bun run build`, and `bun run check`; record existing failures before fixing anything.
- [ ] Name the docs package `@constella/docs`; add its check script and required checking dependencies. Configure port 4322. Verify the root filters reach both apps.
- [ ] Regenerate the root lockfile as necessary, then remove the redundant docs lockfile. Preserve the hoisted linker.
- [ ] Add one browser test dependency at the root if none exists; add `test:components` and `test:docs` scripts with tests restricted to their corresponding directories. Configure the root dev server as the browser test webServer.
- [ ] Capture representative current defaults in baseline fixtures: Section, written/icon/link Button, Dropdown, Heading, and forms. Record viewport and font setup so later comparisons are meaningful.
- [ ] Run `bun run build` and `bun run check`; expect success or an explicitly recorded unrelated blocker. Commit the baseline/configuration fix.

**Output:** Both apps are addressable by root scripts; regression evidence exists before visual changes.

## Task 2 — Audit CSS and establish portable source ownership

**Requirements:** R-03, R-04, R-06, R-08. **Files:** existing component styles and `apps/constella/src/styles/*`; new shared styles/contracts directories; `apps/shared/package.json`; `docs/implementation/component-audit.md` and `css-contract.md`.

- [ ] Audit all 35 component files, recording markup, class names, variants, dependencies, asset processing, scripts, native behavior, and documentation classification.
- [ ] Write a plain HTML fixture using the current Button markup and extracted CSS; demonstrate the missing-style failure before extraction.
- [ ] Move base/pattern/utility CSS and global component styles into the shared paths above, preserving selector order and defaults. Keep the Astro site's existing global.css as a thin import entry point.
- [ ] Declare layer order in shared index.css as well as the head recipe, so plain HTML does not depend on BaseHead for CSS ordering. Shared component files remain in the components layer.
- [ ] Remove duplicate component style definitions after their shared stylesheet is consumed. Update authoring guidance to identify shared component CSS as canonical for portable library components; custom site components retain their existing local ownership rule.
- [ ] Define a build step producing a complete distributable CSS file at `apps/shared/dist/constella.css`, using the existing CSS pipeline or one narrowly scoped build dependency if necessary. Include required assets or eliminate unresolved asset references. Export real source/build entry points from the shared manifest.
- [ ] Verify the plain HTML fixture has no Astro/React runtime dependency, all CSS/assets resolve, and baseline defaults match. Run build/check and commit.

**Output:** One CSS implementation consumed by the Astro reference, docs previews, and integration fixtures. Shared styles do not import app aliases.

## Task 3 — Shared control sizing and InputWrapper

**Requirements:** R-16, R-21, R-24; shared control vocabulary. **Files:** Button.astro; `form/{Input,Select,Textarea}.astro`; Dropdown.astro; replace `wrapper/ButtonWrapper.astro` with `InputWrapper.astro`; shared controls contract/styles; `tests/components/controls.spec.ts`.

**Interfaces:** Export `ControlSize = "small" | "main" | "large"` and `ControlRadius = "none" | "small" | "main" | "round"`. Components accept optional size/radius. HTML equivalents use `data-size` and `data-radius` on the component root. InputWrapper retains render and marginTop, forwards native attributes, and adds no validation or implicit group role.

- [ ] Add failing cases for explicit size/radius, omitted-prop default preservation, and mixed-control wrapping. Cover two buttons, two Dropdowns, Dropdown plus Button, native Select plus Button, and labeled Input plus Button.
- [ ] Define shared control metrics with relative tokens. Map explicit main to the baseline control font/padding, small to a smaller text/padding scale, and large to a larger one; record concrete values in css-contract.md after measuring current form controls. Use existing radius tokens; none maps to zero. Preserve omitted-prop variant-specific defaults.
- [ ] Apply size to Dropdown trigger metrics and its panel text/padding scale; radius applies to trigger and panel, without forcing a decorative border/background. Document this scope. A generic disclosure panel does not become a select/listbox or ARIA menu.
- [ ] Add matching optional control props to Input, Select, and Textarea. Do not resize checkbox/radio/range behavior merely because those are form controls.
- [ ] Rename wrapper usage and selectors throughout source, patterns, and examples. Preserve inherited alignment from ContentWrapper. Make wrapping and bottom alignment work for labeled controls using existing layout utilities.
- [ ] Test narrow widths, long labels, focus visibility, disabled buttons, link rendering, icon variants, and all explicit radius values; verify omitted props against baseline. Run check/build and commit.

**Output:** Consistent opt-in control metrics and a generic control-layout wrapper without changes to Section.

## Task 4 — Reusable Details and Summary

**Requirements:** R-17. **Files:** replace AccordionItem.astro; new `interactive/{Details,Summary}.astro`; Accordion.astro; shared accordion styles/behavior; `tests/components/disclosures.spec.ts`.

**Interfaces:** Details forwards native details attributes including open/name and accepts a named `summary` slot; Summary emits the native summary element. Accordion retains single/openFirst/preview and adds optional `group: string`. `initAccordion(root: HTMLElement): () => void` enhances only details owned by that root.

- [ ] Write failing tests for standalone Details, two independent single-open groups, nested groups, openFirst, single=false, and preview mode. Verify a nested summary does not close an unrelated parent disclosure.
- [ ] Split current item styling into Details body/root and Summary trigger/icon styles. Keep Summary as the first details child, with no nested button trigger. Migrate existing heading content into Summary.
- [ ] Remove serialized HTML substitution. Explicit group/name values support native server-rendered grouping. When no group is supplied, browser initialization generates a group name without collisions; do not render unstable random IDs that create hydration mismatches.
- [ ] Initialize direct owned items only; nested Accordion roots own their descendants. Apply openFirst before display where possible and document explicit group/name markup for native no-script grouping. Preserve native standalone disclosure behavior without scripts.
- [ ] Preserve design-mode preview behavior and restore grouping when preview ends. Return cleanup for listeners/observers. Record initial-open precedence: openFirst opens the first owned item; single groups normalize other initial-open items closed.
- [ ] Run browser keyboard/open-state tests with and without enhancement, then check/build and commit.

**Output:** Reusable disclosure primitives and documented progressive enhancement without rendered-HTML rewriting.

## Task 5 — Merge Eyebrow into Heading

**Requirements:** R-20. **Files:** Heading.astro; remove Eyebrow.astro after migration; shared heading styles; all usages; `tests/components/heading.spec.ts`.

- [ ] Add failing assertions: eyebrow and eyebrow-tag omit tag and render p; explicit h3 remains h3; ordinary Heading still defaults to h2 and its existing visual default.
- [ ] Extend semantic tag support to p/span and add the two eyebrow variants. Preserve marker and tag appearances with the smallest markup needed.
- [ ] Migrate every Eyebrow import/use, including homepage badge styling. Preserve maxWidth and native attribute forwarding.
- [ ] Verify heading outline and baseline styling; run check/build and commit.

**Output:** One public typography component with independent semantic tag and visual style.

## Task 6 — Explicit layout composition, BaseHead, and Skip

**Requirements:** R-15, R-18, R-22, R-23 and layout composition. **Files:** BaseLayout.astro; rename SkipLink.astro to Skip.astro; BaseHead.astro; new CustomLayoutExample.astro and minimal/full pages; `tests/components/layout.spec.ts`.

**Interfaces:** BaseLayout retains SEO/theme inputs and head slot, exposes header/footer slots outside `<main id="main" tabindex="-1">`, and keeps Skip automatic. It no longer accepts overlap. CustomLayoutExample imports BaseHead and styles directly and supplies its own Skip/main.

- [ ] Write failing assertions for no implicit navbar/footer, exactly one main, explicit header/footer outside main, working Skip focus, and one title/canonical in a custom layout.
- [ ] Add named regions directly under body; avoid a short header-slot wrapper that constrains sticky positioning. Initially place the existing Nav/Footer explicitly in callers; Task 7 renames Nav.
- [ ] Rename Skip and update imports/target use. Remove layout overlap forwarding. Do not change Section or silently apply nav-overlap padding.
- [ ] Keep BaseHead usable inside the custom document head and retain current font/metadata support. Verify the recipe includes necessary Astro font configuration and site URL, not just the import.
- [ ] Create minimal and full examples, then test landmarks, focus, duplicate metadata, and Section regression. Run check/build and commit.

**Output:** Composable document shell and a working independent BaseHead recipe.

## Task 7 — Configurable Navbar, search, and theme behavior

**Requirements:** R-19; shared links, lifecycle, and feature defaults. **Files:** rename Nav.astro to Navbar.astro; NavLink.astro; shared navigation contract and navbar/theme behaviors; `src/config/navbar.ts`; BaseHead/BaseLayout; search-example.astro; `tests/components/navbar.spec.ts`, `theme.spec.ts`.

**Interfaces:** `SiteLink { label: string; href: string }`; `IconLink extends SiteLink { icon: string }`; `Brand = { mode: "site-name" } | { mode: "custom"; text: string; logo?: { src: string; alt: string } }`; `SearchConfig { action: string; name: string; label: string; placeholder?: string }`. Navbar accepts render, sticky=true, search=false, themeToggle=false, icons: IconLink[]=[], config defaulting to navbar.ts, and an optional search slot. Config supplies brand, links, optional search. Initial icon registry supports github/linkedin with a documented extension path.

- [ ] Add failing tests for defaults, custom/site-name brand, configured links/icons, missing search configuration, two instances, menu dismissal, sticky scrolling, and normal-flow mode.
- [ ] Render links/configuration without hardcoded destinations. Resolve site-name from consts.ts. Keep shared link data free of framework-specific asset objects. Reject unknown icon keys clearly rather than silently dropping links.
- [ ] Build the native GET search form. Slot content overrides configured rendering. For the starter demonstration, submit to search-example with a query parameter and visibly echo the escaped query; label it a demo destination, not a search index. Production guides show application-owned actions.
- [ ] Add `resolveTheme(preference, systemDark, lockedTheme)` and `initThemeToggle(root): () => void`. Persist explicit light/dark choice with storage errors handled; system changes apply only without a saved choice. An explicit non-inherit layout theme locks the theme and hides toggles.
- [ ] Put theme initialization before visible content in the head path. Keep any inline bootstrapping authored in TypeScript through the supported Astro build mechanism; avoid a hidden handwritten JavaScript implementation with different precedence rules.
- [ ] Add `initNavbar(root): () => void` with per-instance control IDs, root-scoped listeners, and cleanup. Bind/unbind through Astro navigation events and document equivalent React lifecycle cleanup. Preserve the usable no-script navigation fallback.
- [ ] Verify keyboard/touch menu operation, active links, multiple instances, repeated navigation, blocked storage, saved/system theme precedence, locked themes, and no hydration mismatch. Run check/build and commit.

**Output:** Optional configured Navbar with functional search hooks and predictable theme/positioning semantics.

## Task 8 — Configurable Footer variants

**Requirements:** R-23; shared link data. **Files:** Footer.astro; `src/config/footer.ts`; shared footer styles; full starter; `tests/components/footer.spec.ts`.

**Interfaces:** Footer accepts render, variant=`simple`, config, theme/spacing consistent with existing conventions, and slots `brand`, `cta`, `bottom`. FooterConfig contains Brand, description, SiteLink[] links, `{ label: string; links: SiteLink[] }[]` groups, IconLink[] socialLinks, SiteLink[] legalLinks, and copyright text.

- [ ] Add failing fixtures for simple/columns, empty optional collections, long link groups, custom slots, and two footer instances.
- [ ] Implement both variants; slots replace their corresponding default regions instead of duplicating them. Reuse Navbar contracts/icon rendering. Configuration supplies content without source edits.
- [ ] Reuse tokens for theme/spacing and keep footer outside main. Use server-rendered copyright output; if client year refresh is retained, scope it by data attribute rather than a duplicate year ID.
- [ ] Verify narrow layouts, slot precedence, labels and link destinations, then run check/build and commit.

**Output:** Two usable Footer variants and an explicit full starter composition.

## Task 9 — Replace docs starter and add isolated examples

**Requirements:** R-02, R-04, R-07. **Files:** docs config/homepage/example pages; shared examples; ComponentExample.astro, PreviewFrame.astro, preview route; `tests/docs/examples.spec.ts`.

**Interfaces:** `ExampleDefinition { id: string; title: string; html: string; css?: string; tsx: string; behaviorEntry?: string }`. Preview documents load the shared CSS and the declared optional behavior entry; the component shell displays the same canonical source.

- [ ] Replace starter branding, artwork, links, and pages with Constella navigation and useful landing content.
- [ ] Add failing checks for HTML / CSS selected initially, keyboard tab switching, complete copied source, titled iframe, and absence of framework reset leakage into docs navigation/code blocks.
- [ ] Generate static same-origin preview documents from a closed example registry. Embed them in titled iframes; use trusted source only, never arbitrary user-supplied HTML or URLs. Make resize communication origin/source checked if implemented.
- [ ] Render generic React TSX as source text; do not add React hydration to every docs page merely to display code. Include stylesheet prerequisites and behavior entry imports alongside examples.
- [ ] Add complete Button, InputWrapper, Details/Accordion, Navbar, and Footer examples first. Compile their actual TSX source through the React fixture, avoiding handwritten copies in a test folder.
- [ ] Verify copying, tabs, preview scrolling, focus, mobile sizing, and docs style isolation. Run docs build/check and commit.

**Output:** A reusable documentation page pattern grounded in actual portable source.

## Task 10 — Adapt Lumos material and document the library

**Requirements:** R-01, R-09, R-10. **Files:** `docs/implementation/lumos-docs-map.md`; docs content under getting-started, foundations, components; component catalog.

- [ ] Identify the exact upstream Lumos source/revision and reuse terms; record page-level retain/adapt/replace/omit decisions and attribution. If the source cannot be established, write original pages from the verified Constella contracts and record the migration gap without blocking independent work.
- [ ] Publish getting-started instructions using the real CSS artifact from Task 2, with assets and layer/import order.
- [ ] Write foundation pages for tokens, themes, typography, spacing, responsive layout, patterns, variants, utilities, and authoring conventions.
- [ ] Cover every audited component through a page, parent section, or explicit internal/integration-only classification. Include native markup, props where applicable, states, accessibility, dependencies, and canonical examples. BaseHead remains an Astro utility, not a fictitious CSS equivalent.
- [ ] Update the catalog to the new public names while preserving a historical migration mapping. Verify all examples use real classes/tokens and no hidden demo CSS.
- [ ] Check every internal link and code sample; compile TSX and run docs tests/build/check. Commit in coherent component-family batches.

**Output:** Source-backed reference coverage rather than renamed upstream documentation with stale assumptions.

## Task 11 — Portable behavior and remaining component parity

**Requirements:** R-08, R-10, R-12. **Files:** remaining interactive component scripts, shared behaviors, shared examples; `tests/components/interactive-parity.spec.ts`; behavior audit record.

- [ ] Use Task 2's audit to enumerate non-native behavior for Modal, Tabs/TabLink, Slider, Marquee, Dropdown, and other scripted components. Each behavior must have an explicit owner: native HTML, optional shared enhancement, or framework state.
- [ ] Move portable behavior behind root-scoped initialization/cleanup functions. Keep Astro-only designer hooks separate from required production interaction. Extract Dropdown enhancement and scope Escape to the active dropdown rather than every open instance.
- [ ] Add interaction tests for the audited contracts: focus return/dismissal, tab selection, slider controls, motion pause, multiple instances, and lifecycle cleanup. Assert actual semantics; do not apply ARIA menu roles to generic panels.
- [ ] Supply complete HTML and React behavior integration for each public interactive example. React effects use cleanup; server rendering does not read browser globals.
- [ ] Verify no-script fallbacks, reduced motion, and documented browser support; fix blocking accessibility defects and record any remaining limitation. Commit by interactive family.

**Output:** Interactive examples that work when copied into consumers, with behavior dependencies made explicit.

## Task 12 — Verify five integration environments

**Requirements:** R-06, R-11. **Files:** fixtures for plain HTML, React, TanStack Start, SolidStart; Astro starter; integration guides; fixture build scripts and evidence.

- [ ] Add minimal fixture manifests/configuration using official current setup instructions at implementation time. Keep isolated framework dependencies out of production app packages and avoid unrelated framework upgrades.
- [ ] Reuse the CSS artifact, canonical TSX examples, and shared behavior entries. Plain HTML consumes no framework runtime. React fixture compiles the examples users copy.
- [ ] Add TanStack Start stylesheet/SSR lifecycle verification and SolidStart-specific JSX/reactivity adaptation. Do not label generic React TSX as directly interchangeable with Solid.
- [ ] Exercise representative layout, mixed form controls, disclosure, navbar/theme, and one additional interactive example per environment.
- [ ] Run each fixture's named build script through root `test:integrations`; record exact versions and commands in `docs/implementation/integrations.md`. Verify browser requests for CSS/assets and server/client rendering.
- [ ] Write integration guides from the tested setup. Commit fixtures and guides together.

**Output:** Evidence for each claimed integration, beyond CSS importing successfully.

## Task 13 — Migration, accessibility, and release readiness

**Requirements:** R-12, R-13, all component migration criteria. **Files:** migration guide, CHANGELOG.md, root scripts/CI, validation evidence.

- [ ] Document ButtonWrapper→InputWrapper, AccordionItem→Details/Summary, Nav→Navbar, Eyebrow→Heading variants, SkipLink→Skip, and explicit Footer/Navbar composition. Explain overlap removal and new sticky semantics with before/after markup.
- [ ] State the source of truth for framework release versus private app versions. Do not assign/publish a release version without the project's chosen release action.
- [ ] Verify source has no unintended obsolete component imports or serialized accordion substitution. Compare Section against its captured baseline.
- [ ] Run automated accessibility checks plus manual keyboard/focus review on interactive examples. Review contrast, long content, zoom, mobile overflow, reduced motion, and assistive technology behavior. Record tested environments and any limitations.
- [ ] Run `bun run build`, `bun run check`, `bun run format:check`, `bun run test:components`, `bun run test:docs`, and `bun run test:integrations`. Repair regressions attributable to the branch; document genuine external blockers.
- [ ] Add the appropriate checks to CI once their local commands work. Record results and requirement coverage; prepare a reviewable PR/diff without merging or publishing.

**Output:** An internally consistent implementation and documentation set with verification evidence and actionable migration guidance.

## Task 14 — Select the first expansion increment

**Requirements:** R-14. **Files:** component catalog and a follow-up scoped implementation plan.

- [ ] Reconcile the proposed additions against the delivered variants and compositions; avoid duplicate components.
- [ ] Recommend a small first increment from Badge, Alert, Avatar, Table, Breadcrumbs, Pagination, and form help/error patterns, using demonstrated gaps from the new examples.
- [ ] Define the selected increment's markup/API, states, accessibility, and documentation deliverables in a separate plan. Do not silently implement the entire candidate catalog.

**Output:** A concrete expansion proposal after the existing framework is usable and documented. Selection is the only scope gate here; it does not block Tasks 1–13.

## Requirement coverage

| Requirements                                                               | Owning tasks                      |
| -------------------------------------------------------------------------- | --------------------------------- |
| R-01 / R-02                                                                | 10 / 9                            |
| R-03 / R-04 / R-05                                                         | 1–2 / 2 and 9 / 1                 |
| R-06 / R-07 / R-08                                                         | 2 and 12 / 9 / 4, 7, 11           |
| R-09 / R-10 / R-11                                                         | 10 / 9–11 / 12                    |
| R-12 / R-13 / R-14                                                         | 3–13, final audit in 13 / 13 / 14 |
| R-15 / R-16 / R-17 / R-18                                                  | 1, 6, 13 / 3 / 4 / 6              |
| R-19 / R-20 / R-21 / R-22                                                  | 7 / 5 / 3 / 6                     |
| R-23 / R-24                                                                | 6 and 8 / 3 and 11                |
| Shared tokens/links, multiple instances, feature defaults, starter layouts | 3 / 7–8 / 4, 7, 11 / 7 / 6–8      |

## Completion definition

Tasks 1–13 complete the approved current-library and documentation scope when their evidence passes. Task 14 produces the next expansion scope. Update requirement checkboxes only after implementation and verification, recording the corresponding commit/PR. This plan itself does not mark any requirement complete.

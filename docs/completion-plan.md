# Constella Completion Plan

This plan replaces Tasks 10–14 of [`implementation-plan.md`](implementation-plan.md). Tasks 1–9 of that plan are done. The commit history and [`implementation/css-contract.md`](implementation/css-contract.md) record them, but nobody ticked their checkboxes, so the old plan reads as if nothing has started. This document is now the single place that tracks progress. Tick the boxes as you go.

It covers three things:

1. How the stylesheets are organized, and why (§1).
2. One repeatable procedure for adding or changing a component that always updates its documentation, with checks that enforce it (§2).
3. The order of the remaining work (§3–§8).

---

## 1. How the stylesheets work today

### Not CSS Modules

The project does not use CSS Modules, and it should not start. Every file in `apps/shared/src/styles/components/` is a plain global stylesheet. Each file wraps its rules in `@layer components { … }` and uses ordinary class names like `.button_wrap` and `.details_summary`. Nothing is hashed or scoped by a build tool.

CSS Modules would break the framework's main promise. Constella's public contract is _class names in HTML_. A plain-HTML user writes `<a class="button_wrap secondary">`, a React user writes `className="button_wrap secondary"`, and the docs' copyable examples show exactly that. CSS Modules rename classes at build time, so the classes in the HTML would no longer match the stylesheet, and non-bundler consumers could not use it at all.

### How the files fit together

```
apps/shared/src/styles/
├── index.css            ← the only entry point. Declares layer order, imports everything once.
├── base.css             ← imported into @layer base   (tokens, themes, reset, element defaults)
├── patterns.css         ← imported into @layer patterns (section/container, field structure…)
├── controls.css         ← @layer components: data-size / data-radius for any control
├── components/*.css     ← @layer components: one file per component family
└── utilities.css        ← imported into @layer utilities
```

- **The Astro site** uses it through `apps/constella/src/styles/global.css`, which is one line: `@import "@constella/shared/styles/index.css"`.
- **Docs previews** load `index.css` inside an isolated iframe document. The Starlight shell never loads it.
- **Everyone else** gets `apps/shared/dist/constella.css`, built by `bun run --cwd apps/shared build`. Vite inlines every `@import` into that one file.

### Why one file per component

Before Task 2, each Astro component carried its own `<style is:global>` block. Task 2 moved each block into its own file in `apps/shared` instead of merging them all into one stylesheet. The split is for maintainers:

- **Ownership.** One component family maps to one file, which maps to one docs page. A change to Dropdown touches `dropdown.css` and nothing else.
- **Reviewable diffs.** A file with 4,000 lines of mixed component CSS is hard to review.
- **Future selective imports.** A consumer could import only the files they need. This is not supported or documented yet (see §4, step 1.5).

Users never need to know about the split. They load one stylesheet.

### Problems this plan fixes

| Problem                                                                                                                                                           | Fixed in   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| None of the above is written down for users or for contributors.                                                                                                  | Phase 1    |
| Some file names don't match the component: `nav.css` holds Navbar, and `accordion.css` is 5 lines.                                                                | Phase 1    |
| Many components have no stylesheet of their own (Section, Paragraph, Input, Img, Video…) because they use patterns or base. Nothing maps component to file.       | Phase 1    |
| `index.css` claims alphabetical import order but isn't alphabetical (for example, `details` comes before `button`).                                               | Phase 1    |
| Root `AGENTS.md` says `apps/shared` holds components and layouts. Those folders are empty `.gitkeep` placeholders; the Astro components live in `apps/constella`. | Phase 0    |
| The docs cover 6 of 35 components, and nothing detects when a component changes without its docs.                                                                 | Phases 2–3 |
| There is no CI, so `build`, `check` and the tests only run when someone remembers.                                                                                | Phase 2    |

---

## 2. The component change procedure

This procedure is the "docs update every time a component changes" rule. Any change to a public component, whether new, a new variant or prop, a rename, or a behavior change, is one commit or PR that touches all of the following together:

| #   | Artifact                            | Path                                                                        |
| --- | ----------------------------------- | --------------------------------------------------------------------------- |
| 1   | Stylesheet                          | `apps/shared/src/styles/components/<family>.css`                            |
| 2   | Behavior, if any                    | `apps/shared/src/behaviors/<family>.ts` (+ add to `build-css.ts`)           |
| 3   | Astro reference component           | `apps/constella/src/components/<group>/<Name>.astro`                        |
| 4   | Canonical example                   | `apps/shared/src/examples/<id>/{example.html,Example.tsx}` + registry entry |
| 5   | Manifest entry                      | `apps/shared/src/manifest.ts` (new, Phase 2)                                |
| 6   | Docs page                           | `apps/docs/src/content/docs/components/<id>.mdx`                            |
| 7   | Test                                | `tests/components/<family>.spec.ts` and/or `tests/docs/`                    |
| 8   | Migration note, if renamed/breaking | `apps/docs/src/content/docs/migration.mdx` (Phase 5)                        |

Every docs page uses the same sections in the same order: **Overview → Example → Markup (root, children, required attributes) → Variants & props (one table showing the Astro prop, HTML equivalent and default) → States → Accessibility → Behavior (init / cleanup, or "none: native HTML") → Tokens it reads → Related.**

The procedure is enforced at three levels, so it doesn't depend on anyone remembering:

1. **Manifest coverage check.** `bun run check:docs` fails when a public component has no CSS family, example, or docs page, when a stylesheet belongs to no component, or when a stylesheet isn't imported by `index.css`.
2. **Change-sync check.** In CI, a PR that changes a component's CSS, behavior, Astro file or example without changing that component's docs page fails. Writing `Docs-Skip: <reason>` in a commit message bypasses it for true no-ops like formatting.
3. **Written guidance.** The procedure goes into root `AGENTS.md` and into a PR template checklist.

---

## 3. Phase 0 — Clean up the plan status (small, do first)

- [x] Add a status note at the top of `docs/implementation-plan.md`: Tasks 1–9 are done (each linked to its commit), and Tasks 10–14 are replaced by this document.
- [x] Correct the table in root `AGENTS.md`: `apps/shared` holds styles, behaviors, contracts and examples, and `apps/constella` holds the Astro components. Delete the empty `apps/shared/src/{components,layouts,config,utils}` placeholders and their `exports` entries, unless we decide to move the Astro components into shared. **Recommendation: don't move them.** The current split already works, and moving them adds churn with no benefit.
- [x] Resolve or explicitly defer the open decision on upstream docs provenance (R-01, "Lumos" source and reuse terms). The old plan links the spec to ChatGPT library files, which are not in the repo. Commit the spec text, or note that `docs/requirements.md` is now the source of truth. **Default if undecided:** write original pages (old Task 10's fallback) and don't block on it.

**Outcome (2026-11-16):** status table added to the old plan; `AGENTS.md` corrected and the empty `apps/shared` placeholders and exports removed (Astro components stay in `apps/constella`); spec links now point to `docs/requirements.md`, the in-repo source of truth; R-01 deferred there, so docs pages are written from scratch and no Lumos text is copied until the source and terms are recorded.

**Done when:** a new contributor can read `AGENTS.md` and this plan and know what is finished and what comes next.

## 4. Phase 1 — Organize and document the stylesheets

- [x] **1.1 Rename for 1:1 mapping.** Rename `nav.css` to `navbar.css`. Fold `accordion.css` (one rule) into `details.css`, since Accordion is part of the Details family. Rename any other file whose name doesn't match its family. Class names stay the same, so nothing breaks for users.
- [x] **1.2 Header comment on every stylesheet.** Each `components/*.css` file starts with: family name, root class, child classes, variants, data attributes, tokens consumed, and docs page URL. The coverage check reads only the manifest, not these comments; the comments are for readers.
- [x] **1.3 Sort `index.css`** alphabetically, and give `controls.css` a comment explaining it is cross-cutting and must load after the component files. Confirm `tests/components/baseline.spec.ts` still passes, since import order changes source order inside the layer.
- [x] **1.4 Write a component-to-style map** for components without their own stylesheet (Section → `patterns.css`, Input / Textarea → `patterns.css` field rules + `textarea.css`, Paragraph → base typography, and so on). This goes into the manifest in Phase 2, so there is one map, not two.
- [x] **1.5 Decide whether to support per-component imports.** **Recommendation: not yet.** Document `dist/constella.css` as the only supported entry, and leave per-file imports for after the 1.0 release. Selective imports would make `base.css` and `patterns.css` dependencies part of the public contract.
- [x] **1.6 Docs: Foundations section** (old Task 10, item 3). New pages under `apps/docs/src/content/docs/foundations/`:
  - `styles-architecture.mdx`: §1 of this plan, rewritten for users. Covers the layers, the single entry point, the `dist` artifact, why the classes are global and why that is safe, and that CSS Modules aren't used.
  - `tokens.mdx`, `themes.mdx`, `typography.mdx`, `spacing-and-layout.mdx`, `utilities.mdx`: generated or hand-written from `base.css` / `utilities.css`. Each token table must list real custom properties.
  - `authoring.mdx`: the user-facing version of `project-guidelines.md` §5–§8 (`_wrap` roots, root-qualified variants, no reaching into internals, when to use a utility vs. a variant).
- [x] Run `bun run build`, `bun run check`, `bun run test:components`, `bun run test:docs`, then commit.

**Outcome (2026-11-16):**

- `nav.css` is now `navbar.css`, and `accordion.css` is folded into `details.css`. Every other file already matched its family. Legacy root class names (`.layout`, `.form-choice`, `.icon`, `.grid` and others) are public, so they were kept and documented, not renamed.
- Every `components/*.css` file has a header comment. `index.css` is sorted and commented.
- No CSS behavior changed. Computed styles of every element on all 12 site pages, at 375px and 1280px, are identical before and after. The component, docs and React-example test suites pass.
- 1.4: the stylesheet map on the styles-architecture docs page is generated from the header comments. Its six pattern-based rows are hand-written until the Phase 2 manifest replaces them.
- 1.5: `dist/constella.css` is documented as the only supported entry point.
- 1.6: the seven Foundations pages are live. Token, theme, utility and stylesheet tables are generated from the CSS at build time, so they can't drift. The Foundations sidebar group uses `autogenerate`, which does the Foundations half of 2.3.

**Done when:** the "why individual files / are these CSS Modules" question is answered on a public docs page, and every stylesheet name matches the component it styles.

## 5. Phase 2 — Make documentation drift impossible

- [x] **2.1 Component manifest** at `apps/shared/src/manifest.ts`. It is typed, data only, and has one entry per public component:
  ```text
  { id: "dropdown", name: "Dropdown", family: "dropdown",
    status: "documented" | "planned" | "internal" | "astro-only",
    astro: "interactive/Dropdown.astro", styles: ["components/dropdown.css", "controls.css"],
    behavior?: "dropdown", example?: "dropdown", docs?: "components/dropdown" }
  ```
  `internal` is for parts like NavLink and TabLink that are documented inside their parent's page. `astro-only` is for BaseHead, FormattedDate, BaseLayout and Section helpers that are integration utilities with no HTML/CSS equivalent. `planned` is allowed only until Phase 3 finishes.
- [x] **2.2 `bun run check:docs`** (`scripts/check-docs.ts`). It fails when:
  - an `.astro` file under `apps/constella/src/components` has no manifest entry,
  - a `components/*.css` file has no manifest owner, or isn't imported in `index.css`,
  - a `documented` entry is missing its example registry id, its docs `.mdx`, or its sidebar presence,
  - an example registry id has no manifest entry.
    Add it to `test:docs`.
- [x] **2.3 Generate the sidebar.** Change `apps/docs/astro.config.mjs` to use Starlight `autogenerate` for `components/` and `foundations/`, so a new page can't be forgotten in the sidebar. Order pages with frontmatter `sidebar.order`.
- [x] **2.4 Change-sync check** (`scripts/check-docs-sync.ts`). Given `git diff --name-only origin/main...HEAD`, map changed files to manifest ids, and fail if a component's files changed but its docs `.mdx` didn't, unless a commit carries `Docs-Skip:`.
- [x] **2.5 CI.** Add `.github/workflows/ci.yml`, which runs `bun install --frozen-lockfile`, `bun run --cwd apps/shared build`, `bun run build`, `bun run check`, `bun run check:examples`, `bun run check:docs`, the docs-sync check (on PRs), and the Playwright suites. Install Chromium with `node node_modules/@playwright/test/cli.js install --with-deps chromium`, per `implementation/baseline.md`. Fix the known `format:check` failure in `constella-import-webflow/SKILL.md` (wrap the unparseable block, or add the file to `.prettierignore`) and add `format:check`.
- [x] **2.6 Contributor guidance.** Add the §2 procedure to root `AGENTS.md`. Add `.github/pull_request_template.md` with the eight-item checklist. Add the docs-page section template as `apps/docs/src/content/docs/components/_template.mdx.txt` (not built).
- [x] **2.7 Backfill the 6 existing pages** (Button, InputWrapper, Details, Accordion, Navbar, Footer) into the standard section order, so they serve as the model for Phase 3.

**Outcome (2026-11-16):**

- The manifest is `apps/shared/src/manifest.ts`. It uses `behaviors: string[]` (Navbar needs two) and a `root` class per entry. Statuses are `documented`, `planned` and `astro-only`. Parts like NavLink, Summary and TabLink are listed under their parent entry instead of having an `internal` status. The Foundations stylesheet table now reads the manifest, which replaces the six hand-written rows from Phase 1.
- `bun run check:docs` also checks each stylesheet's header `Docs:` line and the required page sections, in order. It runs in `test:docs` and CI.
- `bun run check:docs-sync [base]` ignores the foundation files (base, patterns, controls, utilities, index), since their docs pages are generated.
- The CI jobs are checks, docs-sync (pull requests only) and browser tests. The `format:check` failure in the Webflow skill file is fixed: a `{ … }` placeholder became a CSS comment.
- The six existing pages now follow the standard sections. Each page's Tokens section is generated from its stylesheets by `ComponentTokens.astro`.
- Both sidebar groups use `autogenerate`, so pages are listed alphabetically.

**Done when:** CI is green, and deliberately deleting a docs page or adding an undocumented `.astro` file turns it red.

## 6. Phase 3 — Document every component (old Tasks 10 + 11)

Work in family batches. Each batch is one PR that follows §2 for every component in it. Static families come first because they need no behavior work. Interactive families come last because each one first needs its script extracted into `apps/shared/src/behaviors/` with init and cleanup (old Task 11).

| Batch | Family / components                                                                  | Extra work before docs                                                                                                                                   |
| ----- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1   | **Layout:** Section, ContentWrapper, Grid (InputWrapper done)                        | Section must keep its baseline values (R-15). Assert against `baseline.json`.                                                                            |
| 3.2   | **Typography:** Heading (incl. eyebrow variants), Paragraph, RichText                | None.                                                                                                                                                    |
| 3.3   | **Media:** Img, Video, Icon, Overlay                                                 | Decide whether Img/Video are `astro-only` (they wrap Astro asset handling) or documented with a plain `<img>`/`<video>` equivalent.                      |
| 3.4   | **Content:** Card                                                                    | None.                                                                                                                                                    |
| 3.5   | **Forms:** Form, Fieldset, Input, Textarea, Select, Choice, Range                    | Extract the Form and Range scripts into behaviors. Document size/radius on Input, Select and Textarea. Choice, Range and checkbox/radio are not resized. |
| 3.6   | **Global:** Skip (Navbar/Footer done; NavLink `internal`)                            | None.                                                                                                                                                    |
| 3.7   | **Disclosure:** Dropdown                                                             | Extract `behaviors/dropdown.ts`, and scope Escape to the active instance only.                                                                           |
| 3.8   | **Overlay:** Modal                                                                   | Extract the behavior. Return focus to the trigger on close, keep native `<dialog>` semantics, add a test.                                                |
| 3.9   | **Tabs:** Tabs + TabLink (`internal`)                                                | Extract the behavior. Use roving tabindex, implement the ARIA tabs pattern, move the `<style>` block left in `Tabs.astro` into `tabs.css`.               |
| 3.10  | **Motion:** Slider, Marquee                                                          | Extract the behaviors. Respect reduced motion, provide a pause control, test multiple instances.                                                         |
| 3.11  | **Astro integration page:** BaseHead, BaseLayout, CustomLayoutExample, FormattedDate | One `integrations/astro.mdx` page with complete recipes and no fake HTML tab (guidelines §13).                                                           |

Progress:

- [x] 3.1 Layout: Section, ContentWrapper and Grid are documented. `tests/components/layout-components.spec.ts` tests the documented examples. The docs tests and `check:docs` now read the manifest, so there are no hand-written example lists. The `content-wrapper.css` header listed `.overlay` as a variant; it's a child, and the header is fixed.
- [x] 3.2 Typography: Heading, Paragraph and RichText are documented, and `tests/components/typography-components.spec.ts` tests them. The Heading page now says an eyebrow must open its block, because it has no margins of its own.
- [ ] 3.3 Media
- [ ] 3.4 Content
- [ ] 3.5 Forms
- [ ] 3.6 Global
- [ ] 3.7 Disclosure
- [ ] 3.8 Overlay
- [ ] 3.9 Tabs
- [ ] 3.10 Motion
- [ ] 3.11 Astro integration page

For each batch:

- [ ] Leftover `<style>` blocks in the Astro files are moved into shared CSS. `Navbar.astro`, `Tabs.astro` and `BaseHead.astro` still have one each; check whether each is truly site-specific or should be shared.
- [ ] Example HTML and TSX are added to the registry, `check:examples` compiles them, and previews render.
- [ ] Manifest status goes to `documented`, and `check:docs` passes.
- [ ] Interactive batches: keyboard and focus tests, multiple-instance tests, a cleanup test, and the no-script fallback.

**Done when:** the manifest has no `planned` entries.

## 7. Phase 4 — Integrations (old Task 12)

No change in scope: add fixtures for plain HTML, React, TanStack Start and SolidStart under `tests/fixtures/`, plus `test:integrations`, plus guide pages under `apps/docs/src/content/docs/integrations/`. Wait until Phase 3 is done, so the fixtures exercise the full set of behaviors and not just the first six examples.

## 8. Phase 5 — Release readiness (old Task 13) and Phase 6 — Expansion (old Task 14)

- Phase 5: migration page (ButtonWrapper→InputWrapper, AccordionItem→Details/Summary, Nav→Navbar, Eyebrow→Heading variants, SkipLink→Skip, explicit layout slots), accessibility pass, browser-support statement, and all checks in CI. It is no longer a large documentation push, because Phases 2–3 already kept the docs current.
- Phase 6: unchanged. Pick a small first increment (for example Badge + Alert), and add each new component through §2 from its first commit.

---

## Recommended order and rough size

| Phase | Size                                                 | Can start                                                                   |
| ----- | ---------------------------------------------------- | --------------------------------------------------------------------------- |
| 0     | ½ day                                                | now                                                                         |
| 1     | 1–2 days                                             | after 0                                                                     |
| 2     | 2 days                                               | after 0. Can run in parallel with 1, but 2.7 waits for 1.6's page template. |
| 3     | 11 batches, ~1 day each (interactive batches longer) | after 2                                                                     |
| 4     | 2–3 days                                             | after 3                                                                     |
| 5     | 1–2 days                                             | after 4                                                                     |

Decisions this plan has already made, so they don't block anyone:

- No CSS Modules. Classes stay global inside `@layer components`.
- One stylesheet per component family, named after the family. Users load only `index.css` or `dist/constella.css`.
- Astro components stay in `apps/constella`. `apps/shared` holds framework-independent source only.
- A typed manifest is the single list of components, and CI enforces docs coverage and docs-change sync.

Decisions still open (owner: project lead):

- R-01 upstream docs provenance (default: write original pages).
- Whether Img/Video get HTML equivalents or are `astro-only` (decide during batch 3.3).
- Public package name and distribution, before Phase 5.

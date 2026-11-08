# Constella — Requirements and Changes to Make

Status: working requirements; component API changes and associated design recommendations approved  
Repository baseline: `5b921a59927a2b0de66c07b51ec84923764d636c`  
Companion documents: [Project Overview](constella-overview.md) · [Component Catalog](constella-components.md)

## How to use this document

This is the working record of changes required to turn the current Astro reference implementation and Starlight starter into documented, broadly usable Constella. Unchecked items are not completion claims. Priorities indicate recommended execution order, not agreed deadlines.

| Priority | Meaning                                                                                |
| -------- | -------------------------------------------------------------------------------------- |
| P0       | Establish an accurate baseline and documentation foundation.                           |
| P1       | Deliver the existing library with reproducible documentation and integration examples. |
| P2       | Expand the library after the foundation is established.                                |

When an item is completed, record its PR or commit, validation evidence, and any remaining limitation. Keep proposed component additions separate from the verified inventory.

## Confirmed requirements

- Constella remains a CSS framework usable across frameworks and plain HTML.
- Lumos documentation provides the starting material for Constella documentation.
- Astro remains the primary framework development environment.
- The monorepo contains the reference site and documentation site.
- Component examples default to an HTML / CSS tab and provide a general React TSX tab.
- Documentation addresses Astro, React, TanStack Start, SolidStart, and plain HTML.
- The library is intended to expand beyond its inherited component set.

## P0 — Baseline and documentation foundation

### R-01 — Establish upstream documentation provenance

- [ ] Identify the exact Lumos documentation site/repository and source revision.
- [ ] Record applicable reuse terms and preserve required attribution/notices.
- [ ] Map upstream pages to Constella destinations: retain, adapt, replace, or omit.

**Acceptance:** A migration map records the source, destination, disposition, and reason for each selected upstream page. Webflow- or Lumos-specific workflows are not presented as Constella requirements without verification.

### R-02 — Replace the Starlight starter content

- [ ] Replace `My Docs`, upstream starter links, welcome copy, starter artwork, and example pages.
- [ ] Set Constella branding, repository links, page titles, and descriptions.
- [ ] Add navigation for Getting started, Foundations, Components, Integrations, and Migration.

**Acceptance:** Navigation leads to real Constella pages or clearly labeled work in progress. No starter content appears as product documentation, and internal links resolve.

### R-03 — Audit existing components and styles

- [ ] Use the component catalog as the initial file inventory.
- [ ] Read each component and record markup, classes, variants, states, assets, props, slots, scripts, and dependencies.
- [ ] Identify which conventions belong to Astro and which form the portable CSS contract.
- [ ] Record reusable tokens, patterns, utilities, themes, and stylesheet load order.

**Acceptance:** Every inventoried component has a source-backed contract or an explicit unresolved item. File existence is not used as evidence of completed accessibility or framework support.

### R-04 — Establish one source for shared styles and demonstrations

- [ ] Decide which CSS, utilities, and examples belong in `apps/shared`.
- [ ] Make both apps consume the same relevant source without duplicating component CSS.
- [ ] Isolate live examples so framework CSS does not unintentionally restyle the documentation shell.

**Acceptance:** A change to the shared component styles is visible in the reference example and documentation preview. Documentation navigation and code blocks retain their intended styling. Any isolation approach preserves an accurate preview.

### R-05 — Reconcile workspace configuration

- [ ] Resolve the observed `apps/docs/bun.lock` against the root instruction requiring one root lockfile.
- [ ] Confirm app package names match the root workspace filters.
- [ ] Keep the configured hoisted Bun linker and root dependency workflow.

**Acceptance:** A clean checkout installs from the root with Bun; root development, build, and check scripts address the intended packages. Any redundant lockfile is removed only after verifying the root lockfile covers the workspace.

## P1 — Existing library and framework usability

### R-06 — Define stylesheet consumption and distribution

- [ ] Choose the initial supported delivery method and public entry points.
- [ ] Document imports, load order, reset/base effects, font and asset handling, and optional component styles.
- [ ] Decide whether releases ship a complete stylesheet, individual stylesheets, source files, or a combination.
- [ ] Keep examples free of invented package names and unpublished installation commands.

**Acceptance:** A clean plain HTML example loads real Constella styles using the documented method. Its required assets resolve, and its setup does not require Astro to render the page. Publishing automation and package names remain explicit decisions until implemented.

### R-07 — Implement the two-tab example pattern

- [ ] Provide HTML / CSS as the default example tab.
- [ ] Provide TSX as the second tab using a general React component.
- [ ] Show matching content, classes, variants, and visual states in both examples.
- [ ] Include stylesheet prerequisites and any additional CSS.
- [ ] Make the tab control keyboard accessible and code easy to copy.

**Acceptance:** A user can reproduce the HTML example and compile the TSX example with documented prerequisites. The React example does not import Astro components. Neither example depends on hidden demo-only CSS or behavior.

### R-08 — Define behavior for interactive components

- [ ] Classify behavior as native HTML, optional TypeScript enhancement, or framework-owned state.
- [ ] Document initialization, cleanup, event handling, focus, and instance identity where relevant.
- [ ] Avoid requiring an application runtime merely to obtain component styling.
- [ ] State fallback behavior when a script is unavailable.

**Acceptance:** Interactive examples work with keyboard and pointer input, multiple instances do not interfere, and framework navigation does not create duplicated listeners or hydration errors. CSS-only functionality is claimed only where demonstrated.

### R-09 — Write foundation guides

- [ ] Cover tokens, color, typography, spacing, layout, responsive behavior, themes, patterns, utilities, and variants.
- [ ] Document actual class naming and CSS layer conventions.
- [ ] Explain semantic markup and the separation of heading level from visual style.
- [ ] Explain how to customize a theme without modifying many component files.

**Acceptance:** Guide examples use verified token/class names and match the source. A user can change a representative theme value and observe consistent changes across several components.

### R-10 — Document the current component inventory

- [ ] Publish pages for public components and explain helper components in their parent pages where appropriate.
- [ ] Include preview, example tabs, variants, states, customization, accessibility, and dependencies.
- [ ] Separate site-specific compositions and Astro utilities from portable CSS components.

**Acceptance:** Every file in the verified catalog is covered by a page, a parent-page section, or a documented internal-only classification. Public examples reproduce the implementation being documented.

### R-11 — Add framework integration guides

| Environment    | Required proof                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Plain HTML     | Stylesheet import, representative layout/form/content examples, and documented interactive behavior.     |
| Astro          | Reference components, CSS loading, props/slots, assets, and behavior after navigation where applicable.  |
| React          | Global CSS import, generic TSX composition, attribute conversion, event/state handling, and asset paths. |
| TanStack Start | React setup plus verified stylesheet delivery and server/client behavior in that environment.            |
| SolidStart     | Global CSS plus Solid-specific JSX/reactivity, runtime ownership, and server/client behavior.            |

- [ ] Create a minimal reproducible example for each supported environment.
- [ ] Record the versions used for verification.
- [ ] Explain when the general React TSX example needs adaptation.

**Acceptance:** Each claimed integration builds and renders representative static and interactive examples. A working CSS import alone does not establish complete component compatibility.

### R-12 — Verify accessibility and responsive states

- [ ] Check semantics, accessible names, labels, errors, focus visibility, keyboard order, and disabled states.
- [ ] Check interactive focus management, dismissal, and state announcements where applicable.
- [ ] Review contrast, reduced motion, narrow layouts, zoom, and long content.
- [ ] Combine automated checks with manual keyboard and assistive technology review for interactive patterns.

**Acceptance:** Findings include tested states and environments. Blocking defects are resolved before declaring the affected example ready; limitations are documented without making unsupported compliance claims.

### R-13 — Add migration and release guidance

- [ ] Document verified differences from Lumos, including markup, classes, tokens, components, and runtime expectations.
- [ ] Define how framework releases relate to app/package versions.
- [ ] Establish a changelog and a process for flagging breaking changes.

**Acceptance:** Migration examples show real before/after changes. Release guidance identifies the authoritative version and includes upgrade instructions for breaking changes.

## P1 — Requested component API changes

These changes were requested by Sean after the initial draft. They supersede the old public names where noted, but do not imply that source files have already been renamed. Section stays unchanged. The associated design recommendations are approved requirements. Remaining open decisions concern implementation details, not whether these requirements are in scope.

| ID   | Current component         | Requested direction                                                                                      |
| ---- | ------------------------- | -------------------------------------------------------------------------------------------------------- |
| R-15 | Section                   | Keep the existing API and behavior for now.                                                              |
| R-16 | ButtonWrapper             | Replace with InputWrapper, retaining action grouping and extending it to all input/control combinations. |
| R-17 | Accordion / AccordionItem | Keep Accordion; generalize its item composition to reusable Details and Summary components.              |
| R-18 | BaseHead                  | Make independently usable and documented for custom layouts.                                             |
| R-19 | Nav                       | Rename to Navbar; remove automatic insertion by BaseLayout; add configuration and optional features.     |
| R-20 | Heading / Eyebrow         | Absorb Eyebrow into Heading as an eyebrow variant.                                                       |
| R-21 | Button                    | Add size and radius props.                                                                               |
| R-22 | SkipLink                  | Rename to Skip.                                                                                          |
| R-23 | Footer                    | Remove automatic insertion by BaseLayout; make independently composable and customizable.                |
| R-24 | Dropdown                  | Add size and radius props; confirm whether the public spelling remains Dropdown or changes to DropDown.  |

### R-15 — Preserve Section

- [ ] Retain current props, defaults, spacing, themes, and behavior.
- [ ] Update composition examples only where surrounding components change.

**Acceptance:** Existing Section usages continue to behave the same. Any layout compensation for navbar positioning is explicitly documented rather than silently changing Section.

### R-16 — Generalize ButtonWrapper to InputWrapper

- [ ] Introduce InputWrapper as the replacement public component.
- [ ] Preserve existing button-group layout and alignment capabilities.
- [ ] Support two dropdowns, dropdown plus button, input plus button, and other control combinations.
- [ ] Document responsive wrapping and consistent alignment without assuming every child is a button.
- [ ] Update imports, demonstrations, and migration guidance.

**Acceptance:** Demonstrations cover two buttons, two dropdowns, a dropdown plus button, and a labeled input plus button. Controls retain their labels, semantics, focus order, and usable sizing at narrow widths. Exact layout/width props remain to be designed.

**Required design:** Keep InputWrapper a layout primitive. It must not own field validation or automatically assign group roles. Use Fieldset for semantic groups. Reuse existing variants/utilities for gap, alignment, and wrapping; add focused layout props only where those cannot express the supported layouts.

### R-17 — Generalize accordion items to Details and Summary

- [ ] Keep Accordion and its existing grouping capabilities.
- [ ] Introduce reusable Details and Summary components that render native details/summary markup.
- [ ] Allow Details/Summary to be used outside Accordion for an independent disclosure.
- [ ] Migrate AccordionItem usage and document the replacement composition.
- [ ] Preserve existing single-open, open-first, and preview behavior unless an incompatibility is explicitly resolved.

**Acceptance:** Standalone disclosures work independently. Multiple Accordion groups and nested disclosures do not accidentally share open-state grouping. Summary retains native keyboard behavior, and the documented initial-open behavior is deterministic.

**Required design:** Details owns disclosure state and Summary owns trigger styling. Portable implementations must not derive grouping behavior by rewriting serialized child HTML. Define an explicit grouping contract across Astro, React, and plain HTML.

### R-18 — Make BaseHead a first-class component

- [ ] Document BaseHead as an independently imported component usable inside a custom document head.
- [ ] Keep its use in BaseLayout compatible with standalone use; independence does not require removing the default head from BaseLayout.
- [ ] Provide a complete custom-layout recipe covering head metadata, required styles, body, main landmark, and Skip target.

**Acceptance:** A custom Astro layout uses BaseHead without importing BaseLayout, receives the documented metadata, and does not produce duplicate head elements/titles. Clearly distinguish this Astro convenience from portable CSS usage.

**Baseline:** BaseHead already exists as a separate source file; the work is to formalize its public contract, documentation, and independent usage, plus any changes found necessary by that review.

### R-19 — Rename Nav to Navbar and make it optional

- [ ] Replace Nav with Navbar as the public component name.
- [ ] Remove automatic Navbar insertion from BaseLayout.
- [ ] Include Navbar explicitly in the example starter page.
- [ ] Move navigation links and brand settings into a typed `navbar.ts` configuration file.
- [ ] Support brand selection using SITE_NAME from `consts.ts` or CUSTOM content defined in `navbar.ts`.
- [ ] Replace overlap with sticky: true uses in-flow sticky positioning at the top; false uses normal flow. Document this as a behavior change rather than a direct rename.
- [ ] Add `search: boolean` to show/hide a search field.
- [ ] Add `themeToggle: boolean` to show/hide a light/dark control.
- [ ] Add configurable icon links, including GitHub and LinkedIn.
- [ ] Remove or migrate BaseLayout's existing overlap forwarding.

**Acceptance:** BaseLayout renders without a Navbar when none is supplied. The starter explicitly includes it. Navbar reads configured links/brand without editing component markup; optional controls appear only when enabled/configured. Navigation, icon links, search, and theme controls are labeled and work in narrow layouts. Search behavior and sticky behavior are documented and verified.

**Required positioning:** `sticky=true` keeps Navbar in flow and sticks it to the top; `sticky=false` uses normal flow. Current overlap uses fixed positioning, so migration guidance must explain the difference. Do not overload sticky with fixed/overlay behavior. A separate fixed/overlay mode is not required for this change.

**Required configuration:** Use structured icon-link entries with an icon key, destination, and accessible label. Brand settings use an explicit `site-name` or `custom` mode plus custom text/logo data. Keep configuration data separate from framework component imports. The precise TypeScript schema and configuration directory remain implementation details.

**Required search contract:** The boolean controls visibility. Configure the search destination separately through a form action/query parameter or an application callback/slot. Enabled search must function with the documented configuration; do not ship an inert search field or silently add a hosted search dependency.

**Required theme behavior:** Respect and persist an explicit user choice; use system preference when there is no saved choice. Initialize the selected theme before visible content to avoid a theme flash and keep server/client rendering consistent. A layout that explicitly locks its theme takes precedence and must not display an ineffective theme toggle.

### R-20 — Fold Eyebrow into Heading

- [ ] Add `eyebrow` as a Heading variant and migrate Eyebrow usages.
- [ ] Preserve the distinction between semantic tag and visual variant.
- [ ] Preserve both existing Eyebrow appearances through Heading variants `eyebrow` and `eyebrow-tag`.

**Acceptance:** An eyebrow can render as non-heading text, such as a paragraph, without adding a false heading level. Existing heading-level/style behavior remains valid. Both current Eyebrow appearances have an explicit migration outcome.

**Required design:** Both `eyebrow` and `eyebrow-tag` default to a paragraph when no semantic tag is supplied. An explicit tag remains independent from visual styling. Preserve the marker appearance in `eyebrow` and the tag appearance in `eyebrow-tag`.

### R-21 — Add Button size and radius

- [ ] Add typed size and radius props mapped to framework tokens/classes.
- [ ] Define supported values and defaults after auditing current tokens and dimensions.
- [ ] Preserve current appearance when the new props are omitted unless a separate default change is approved.

**Acceptance:** Size and radius work across supported Button variants and link/button rendering modes. Focus styles and usable targets survive each combination, and public HTML / CSS examples show the equivalent class or attribute contract.

### R-22 — Rename SkipLink to Skip

- [ ] Rename the public component and update imports, examples, and migration notes.
- [ ] Preserve its skip-navigation behavior and visible-on-focus presentation.
- [ ] Verify that it still reaches the main landmark when Navbar and Footer are explicitly composed.

**Acceptance:** Keyboard users can activate Skip and reach the documented main-content target in both BaseLayout and the custom-layout example. Missing/duplicate target IDs are avoided.

### R-23 — Make Footer independent and customizable

- [ ] Remove automatic Footer insertion from BaseLayout.
- [ ] Document explicit Footer composition and retain it on the example starter page.
- [ ] Provide simple and columns variants, typed content configuration, and named slots for custom content as specified below.

**Acceptance:** A layout without Footer has no footer markup. A layout that includes it places the site footer outside main content. Documented customization changes content/layout without editing Footer's source or adding selectors that reach into it.

**Required Footer design:**

| Mechanism                 | Required responsibility                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `variant="simple"`        | Brand, a short link list, and copyright. Default appearance close to the current footer.                                   |
| `variant="columns"`       | Brand/description, grouped navigation columns, and a legal row.                                                            |
| Content props/config      | Brand, description, link groups, social links, legal links, and copyright text.                                            |
| Named slots / composition | Optional custom brand, call to action, and bottom-row content. Avoid a separate boolean for every possible footer section. |
| Theme and spacing         | Reuse existing framework conventions/tokens where appropriate.                                                             |

Provide a typed `footer.ts` data file mirroring the navbar configuration approach. Footer content inputs must support brand, description, navigation groups, social links, legal links, and copyright text. Named slots support custom brand, call-to-action, and bottom-row content. Compose newsletter forms as content; Footer must not own subscription behavior.

### R-24 — Add Dropdown size and radius

- [ ] Add size and radius props using the same vocabulary/token mapping as Button where their meanings match.
- [ ] Document whether size affects the trigger, menu options, or both; define the radius scope as well.
- [ ] Retain current defaults unless changed separately.
- [ ] Resolve the spelling difference: the existing file is `Dropdown.astro`; the request uses DropDown.

**Acceptance:** Trigger/panel sizing is predictable, options remain usable, and radius does not clip focus indicators or menu content. Verify open/closed, disabled, long-label, narrow-screen, and keyboard states supported by the actual component.

## Composition and migration implications

- [ ] Make BaseLayout a document shell with explicit regions for Navbar, main content, and Footer.
- [ ] Document a composition equivalent to BaseLayout containing Navbar, Section content, and Footer, while keeping site navigation/footer outside the main landmark.
- [ ] Provide named regions for Navbar/header and Footer, outside the default main-content region. BaseLayout owns the main landmark; its default slot contains page content only.
- [ ] Keep Skip and its main target coordinated in the chosen layout contract.
- [ ] Update the example starter, component examples, imports, public names, and two-tab documentation together.
- [ ] Document every breaking rename and removal; decide whether temporary deprecated aliases are useful before adding them.

**Acceptance:** Named header/footer regions render outside the single main landmark. The starter has one main landmark, a working Skip target, and explicitly supplied Navbar/Footer. Minimal custom layouts can omit either. No source change is required to opt out of the site chrome.

## Additional required API and starter behavior

The following recommendations are now approved requirements:

- [ ] Share size/radius vocabulary across Button, Dropdown, and form controls where the dimensions mean the same thing; aligned mixed controls are a primary InputWrapper use case.
- [ ] Use one typed link-data shape for navbar/footer destinations and social links, while keeping rendering and active-route behavior framework-specific.
- [ ] Verify multiple component instances, stable unique IDs, and navigation lifecycle cleanup as interactive components become portable.
- [ ] Default `search` and `themeToggle` to false; render icon links only from provided configuration. Document Navbar's sticky default explicitly during API implementation.
- [ ] Provide complete minimal and full starter layouts so the new explicit composition model is easy to learn.

**Acceptance:** Mixed controls align using the shared size/radius vocabulary; navbar/footer consume the common typed link schema; multiple instances have distinct IDs and clean up navigation listeners; optional navbar features follow the documented defaults; both minimal and full starter layouts build and render.

## P2 — Component expansion

### R-14 — Select and implement additions incrementally

- [ ] Review the proposed additions in the component catalog and select an initial subset.
- [ ] Prefer a variant or composition of an existing component when it satisfies the use case.
- [ ] Define markup, variants, states, accessibility behavior, and dependencies before implementation.
- [ ] Ship each addition with the same HTML / CSS and TSX documentation standard.

**Acceptance:** Only selected additions become committed scope. Each delivered component has working examples and verification appropriate to its behavior. Naming a component in the proposed catalog does not mark it implemented.

## Validation for a documentation delivery

- Run the repository's relevant build, check, and formatting commands with Bun.
- Check navigation, search, code copying, tabs, and live previews in the rendered docs.
- Compile the documented TSX examples and exercise their key states.
- Verify required stylesheet and asset requests succeed.
- Compare representative documentation previews with the Astro reference.
- Record the source revision and the integration versions tested.

## Open decisions

| Decision                                                                       | Needed before                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Exact Lumos documentation source and reuse terms                               | Importing or adapting upstream content.                                              |
| Public distribution method, package names, and entry points                    | Publishing installation instructions.                                                |
| Remaining public names and aliases (including Dropdown spelling)               | Finalizing exports and the migration guide.                                          |
| Exact search configuration schema, configuration directory, and sticky default | Implementing R-19 within the confirmed positioning/search/default feature contracts. |
| Exact Footer prop/config types and named-slot names                            | Implementing the required Footer variants/content model and explicit layout regions. |
| Concrete size/radius token values and mappings                                 | Implementing R-21 and R-24 with the required shared vocabulary.                      |
| Ownership of interactive behavior and optional dependencies                    | Completing portable interactive examples.                                            |
| Shared source organization and preview isolation                               | Connecting docs previews to framework source.                                        |
| Browser support policy and accessibility target                                | Publishing support and quality claims.                                               |
| First expansion subset                                                         | Starting P2 implementation.                                                          |

## Change log

| Entry                    | Change                                                                                                                                                                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Recommendations approved | Promoted all component-design feedback and additional ideas to requirements, including Footer variants/configuration, named layout regions, sticky semantics, shared control tokens/link data, theme/search behavior, and starter examples. No implementation marked complete. |
| Component API update     | Added requested changes R-15 through R-24, composition/migration criteria, and separately labeled API recommendations and open decisions.                                                                                                                                      |
| Initial draft            | Recorded confirmed direction, source-backed baseline, proposed priorities, and acceptance criteria. No implementation items marked complete.                                                                                                                                   |

## Evidence

Repository observations come from the [inspected source revision](https://github.com/seanrobmerriam/constella/tree/5b921a59927a2b0de66c07b51ec84923764d636c), root `AGENTS.md`, `apps/constella/CONSTELLA.md`, the docs configuration/homepage, and the shared package manifest. Priorities, proposed additions, and acceptance criteria are recommendations for this work, not claims about existing implementation.

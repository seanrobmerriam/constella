# Constella Project Guidelines

## Purpose and authority

Constella is a CSS framework for building consistent, functional, accessible websites and applications. Its architecture should make the right styling decision easy to locate: shared visual decisions live in tokens, reusable appearances live in variants, and small instance adjustments use utilities.

These guidelines explain how the pieces fit together and why the rules exist. They combine the inspected source conventions with the approved component requirements. They do not claim that the planned API changes or shared package extraction are already implemented.

Use the requirements document for scope and acceptance criteria, the implementation plan for execution order, and this document for architectural reasoning. When these differ from legacy examples, the approved requirements take precedence over the old API.

## 1. The framework has three related contracts

| Contract | What it defines                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------ |
| Styling  | Tokens, layers, patterns, component classes, variants, states, and utilities.                                      |
| Markup   | Semantic elements, child structure, classes, attributes, labels, and IDs needed by each component.                 |
| Behavior | Native interaction plus any optional TypeScript enhancement, initialization, cleanup, and application-owned state. |

Astro components are the reference implementation of those contracts. React, TanStack Start, SolidStart, and plain HTML consumers must be able to reproduce the styling and intended behavior without rendering Astro components.

CSS supplies appearance. Markup supplies structure and semantics. Scripts supply behavior that native HTML cannot provide. Do not hide a required script behind an example described as HTML / CSS only.

## 2. Cascade order

The framework declares this order before component styles load:

```css
@layer base, patterns, components, utilities;
```

| Layer        | Responsibility             | Typical contents                                                                                       |
| ------------ | -------------------------- | ------------------------------------------------------------------------------------------------------ |
| `base`       | Common foundation          | Tokens, theme mappings, reset, element defaults, typography styles, focus and reduced-motion defaults. |
| `patterns`   | Reusable combinations      | Section/container layout, field structure, text spacing, media patterns, and alignment-aware layouts.  |
| `components` | Owned component appearance | Root/child styles, variants, states, and responsive behavior.                                          |
| `utilities`  | Focused instance overrides | Margin, padding, gap, alignment, sizing, radius, and display adjustments.                              |

For competing normal author declarations, later layers beat earlier layers before selector specificity is compared. Within the same layer, specificity and then source order resolve otherwise tied rules. HTML class order does not decide the winner.

Unlayered normal author rules outrank layered normal rules. Normal inline declarations also outrank normal stylesheet rules. `!important` reverses layer precedence: earlier layers win, and layered important rules outrank unlayered important rules. Origins, importance, animations/transitions, and applicable scope rules also participate; the four-layer order describes the framework's normal styling policy, not the entire browser cascade. [CSS cascade reference](https://www.w3.org/TR/css-cascade-5/#cascade-sort).

### What the order achieves

A pattern establishes a useful default. A component deliberately refines it. A utility makes a small, explicit change at one call site. A utility can therefore override a more specific component selector without increasing selector specificity.

This example is illustrative; `example_wrap` is not a shipped component:

```css
@layer components {
  .example_wrap {
    padding: var(--space-5);
  }
}

@layer utilities {
  .padding-2 {
    padding: var(--space-2);
  }
}
```

```html
<div class="example_wrap padding-2">Smaller padding for this instance.</div>
```

Do not treat changing stylesheet import order as the normal way to select a design. Keep the layer-order declaration stable and explicit in every standalone entry point, including plain HTML exports and preview documents.

### Loading styles correctly

The current global entry imports base, patterns, and utilities into their layers. Component styles currently enter through global component style blocks under `@layer components`.

```css
@layer base, patterns, components, utilities;

@import "./base.css" layer(base);
@import "./patterns.css" layer(patterns);
@import "./utilities.css" layer(utilities);
```

When extracting canonical CSS into shared files, assign a stylesheet to its intended layer once. A file already wrapped in `@layer components` should not also be imported into another components layer that unintentionally nests it. Load component styles once and preserve their order within the layer.

Keep first-party framework styling inside the four layers. Do not introduce a broad unlayered stylesheet that bypasses their contract. When integrating third-party CSS, inspect its reset and layer behavior explicitly; a scoped class name alone does not establish lower precedence.

### Use important declarations sparingly

Do not use `!important` to make an ordinary component variant win. The current reduced-motion fallback uses important declarations in base as a deliberate accessibility exception. Preserve that protection when moving styles; do not use the exception as a pattern for component styling.

Inline custom properties can carry a computed component value, such as a text width. Treat them as deliberate inputs: a later normal utility cannot override an inline assignment of the same property simply by being in utilities.

## 3. Tokens express shared decisions

Tokens describe values that should change together. Components consume them instead of independently choosing colors, spacing, typography, radii, and motion durations.

| Kind               | Existing examples                                | Purpose                                                  |
| ------------------ | ------------------------------------------------ | -------------------------------------------------------- |
| Primitive          | `--light-100`, `--dark-900`, `--brand-500`       | Palette ingredients.                                     |
| Semantic           | `--background`, `--text`, `--border`             | Roles within the current theme.                          |
| Component role     | `--button-background`, `--button-text`           | Shared appearance for a component family.                |
| Scale/layout       | `--space-4`, `--site-gutter`, `--max-width-main` | Consistent sizing and rhythm.                            |
| Internal parameter | `--_alignment`, `--_gap-size`, `--_mw`           | Implementation or composition inputs with limited scope. |

Prefer semantic tokens in components. A button using `--button-background` can respond to theme changes; one using a literal palette color cannot do so unless its own styles are also changed.

Use `--_` for internal parameters. They are not automatically public customization promises. Some, such as alignment, are intentionally shared between related wrappers; document that relationship rather than letting unrelated components depend on an accidental variable.

Custom properties inherit by default, but a declaration on a child beats an inherited value even if the inherited value came from a later layer. Token aliases are resolved where they are computed; do not assume changing an ingredient on a descendant recalculates every alias inherited from an ancestor. Change theme mappings at the appropriate scope or redeclare dependent aliases there. [Custom property reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties).

## 4. Themes redefine roles

Current themes include light, dark, brand, and contextual inversion. Theme selectors remap semantic and component-role tokens, then apply foreground/background colors at the themed boundary.

Components should consume those roles without needing a separate hardcoded dark-mode stylesheet. Local theme boundaries should be intentional and remain readable when nested. Verify actual invert selector behavior; do not assume an unlimited automatic alternating theme algorithm.

A global light/dark toggle manages preference; a local brand section manages a visual region. These are different responsibilities. The approved behavior is to persist an explicit user choice, use the system preference when none exists, and respect a layout that deliberately locks its theme. A locked layout must not display an ineffective toggle.

Do not equate `color-scheme` with an entire theme. It also affects browser-rendered controls and should agree with their intended contrast. Changing the framework palette still requires checking text, borders, focus indicators, and controls.

## 5. Patterns, components, variants, and utilities

| Need                                                   | Correct location                            |
| ------------------------------------------------------ | ------------------------------------------- |
| The whole project needs different spacing/color/type   | Token or theme mapping.                     |
| Several unrelated elements need the same combination   | Reusable pattern.                           |
| One component family needs another coherent appearance | Component variant.                          |
| One instance needs a small independent adjustment      | Utility.                                    |
| A new subtree owns genuinely new styling or behavior   | Small custom component.                     |
| Content differs between instances                      | Content prop, slot, or typed configuration. |

A pattern is a reusable CSS arrangement, not necessarily a framework component. Existing examples include field controls and section/container structure. A component combines appropriate markup, patterns, styling, and optional behavior behind a named API.

A variant describes one coherent design choice. If several utilities must always travel together to make a particular card appearance, that appearance belongs in a Card variant. If the same utility is repeated everywhere, reconsider the token, component default, or variant rather than repeating the override.

Utilities should remain explicit, limited adjustments. Do not silently redefine a common utility to satisfy one component. Avoid conflicting utilities on the same property; their order in the HTML does not make intent deterministic.

## 6. Composition follows ownership

Build ordinary page structure directly from Section, Grid, ContentWrapper, Heading, Paragraph, InputWrapper, and other existing primitives. A shorter page file is not by itself a reason to add a custom component.

Create a custom component when a subtree owns custom CSS or a script. Choose the smallest boundary that owns that behavior. A custom card normally belongs inside an existing Grid; it should not absorb the surrounding section merely because they appear together once.

- Put role-specific content compositions such as HeroBlog or CtaMain in `src/components/content/`.
- Use `src/components/section/` only when custom behavior/style acts on the section itself.
- Keep constant copy in the composition; expose content that changes per instance.
- Use a Fragment only where multiple siblings must occupy a named slot and an extra real element would change structure or semantics.

ContentWrapper coordinates text and child layout alignment through the shared alignment parameter. Preserve that relationship so centering the wrapper does not require separately centering every paragraph and action group.

InputWrapper owns layout for buttons and other controls. It does not own validation or create a semantic group automatically. Related controls that need a group label use Fieldset.

## 7. Style the HTML a component owns

Callers may pass utility classes to library component instances. They must not pass custom classes to reach into library internals or override them with ancestor selectors. Add a supported variant when the component needs another reusable appearance.

Custom selectors belong to plain semantic HTML inside the custom component that owns them. Compose a library component without styling its descendants from outside its implementation.

New component root classes end in `_wrap`; child classes share the same family:

```css
@layer components {
  .feature-card_wrap {
    border: var(--border-width) solid var(--border);

    &.compact {
      padding: var(--space-3);
    }
  }

  .feature-card_title {
    color: var(--text);
  }
}
```

Name children by their role: `_layout`, `_list`, `_title`, `_body`. Do not name them after the current layout mechanism, such as `_flex`, when that mechanism may change.

Bare variant classes are qualified by their root, for example `.feature-card_wrap.compact`. Never define a generic global `.compact` selector as a component variant. Existing legacy roots such as `.heading` or `.section` do not establish an exception for every new component; migrate them only as part of a deliberate compatibility change.

Keep selectors shallow and use low-specificity constructs where they fit. Layers reduce the need for specificity competition; they do not make broad descendant selectors harmless.

## 8. Stylesheet ownership during the transition

The existing Astro convention keeps component styles in the owning file, using `<style is:global>` and `@layer components`; pages carry no custom CSS. The approved portable architecture extracts reusable library CSS into canonical shared component stylesheets.

| Code                             | Intended owner                                                       |
| -------------------------------- | -------------------------------------------------------------------- |
| Portable library styles          | Shared CSS source consumed by reference site, exports, and previews. |
| Site-specific custom composition | Its owning Astro component under the components layer.               |
| Shared token/pattern/utility     | Its designated shared stylesheet.                                    |
| Page                             | Composition and content; no independent styling implementation.      |

During extraction, move styles instead of copying them. Avoid leaving a second definition in an Astro style block or docs demo. Shared source must not depend on the reference app's `@/` alias.

A distributed CSS entry must establish its own layer order and resolve its assets without BaseHead or an Astro runtime.

## 9. Responsive design and units

Use the existing fluid scales rather than adding unrelated sizes at each breakpoint. Read current breakpoint values from Grid; do not copy remembered values into new components.

| Unit                      | Use                                                                           |
| ------------------------- | ----------------------------------------------------------------------------- |
| `rem`                     | Layout lengths, spacing, and token-based dimensions.                          |
| `em`                      | Details that should scale with text, such as icon size and letter spacing.    |
| `ch`                      | Text measure and readable line lengths.                                       |
| `%`, `fr`, viewport units | Proportions, flexible tracks, and deliberate viewport relationships.          |
| `cqw`                     | A scalable artboard whose contents must resize together.                      |
| Unitless values           | Ratios, suitable line heights, and mathematical inputs to fluid calculations. |

Do not add pixel-based layout values. Existing source contains some pixel-based accessibility utility values; treat those as legacy implementation details to review, not permission to introduce pixel-based component layouts.

Keep responsive rules near the component/variant they change and consolidate related changes into a readable breakpoint block. Introduce a new breakpoint only when content behavior justifies it. Support long labels, zoom, translated content, and narrow screens without changing logical reading order to match a visual arrangement.

For an element-built scalable graphic, use a container artboard with an aspect ratio and container units throughout its interior. Mixing unrelated rem dimensions into its internal coordinate system prevents it from scaling as a single piece.

## 10. Component APIs should expose intent

Public props express content, variants, and supported behavior. They should not reproduce every CSS property as a prop.

- Keep shared prop names, descriptions, defaults, and ordering consistent.
- Follow the existing render/content/variant/variant-specific/settings ordering; put class and rest attributes last.
- For renderable components, `render=false` omits their output; missing required content must not leave empty decorative structure.
- Use discriminated unions for variant-specific inputs and reject incompatible inputs rather than silently ignoring them.
- Forward appropriate native attributes without accidentally forwarding framework-only props into HTML.
- Reuse existing component prop types in Astro wrappers instead of maintaining parallel copies.
- Preserve default appearance when adding optional size/radius inputs. Share their vocabulary across controls where their meanings match.

Document Head metadata utilities separately from renderable body widgets; a universal render prop is not a reason to break BaseHead's existing metadata contract.

Heading's semantic tag and visual variant are independent. Eyebrow appearances belong to Heading variants and default to paragraph semantics unless a tag is explicitly chosen. A visually large heading need not be h1, and a small visual style need not be a paragraph.

## 11. Layout, configuration, and interaction stay separate

The approved BaseLayout is a document shell with a main-content region and named header/footer regions. Navbar and Footer are explicitly supplied; they are not automatic page chrome. Keep both outside main. BaseHead is independently usable for custom layouts, and Skip must point to a real main-content target.

Navbar/footer content belongs in typed data configuration. Shared link types describe labels, destinations, and icon keys; framework-specific rendering and route detection stay in the adapter. Keep custom branding and reusable content data out of component source.

Sticky means in-flow sticky positioning; it does not mean fixed overlap. Search visibility and search destination are separate inputs. A search field must have a working configured action or application-owned implementation.

Details owns disclosure state; Summary owns trigger presentation. Accordion coordinates grouping without requiring serialized HTML rewriting. Native controls keep native semantics unless the component implements and verifies a different interaction pattern.

## 12. Behavior must be portable and accessible

Use native HTML behavior when it satisfies the component's needs. Add TypeScript enhancement for defined gaps, with explicit initialization and teardown. Do not add a frontend framework merely to provide styles.

Each enhanced instance owns its IDs, state, listeners, and observers. Multiple instances and repeated client navigation must not interfere or accumulate handlers. Server rendering must not require browser globals, and hydration must not change IDs unpredictably.

Visual state should follow meaningful attributes where possible: open, disabled, aria-expanded, aria-selected, or aria-pressed as appropriate. Do not assign a menu/listbox role to a generic dropdown merely because it opens a panel.

Preserve visible focus, accessible names, field labels, useful errors, reading order, focus return, reduced motion, and no-script behavior where applicable. A component file is not evidence of accessibility compliance; review real states in real rendered examples.

## 13. Documentation is part of the contract

Every public component needs a live preview, default HTML / CSS tab, and generic React TSX tab where a React example is meaningful. Integration utilities such as BaseHead require a complete framework-specific recipe instead of an invented CSS equivalent.

Both tabs show the same content, classes, and states. Declare required styles, assets, and behavior; copyable examples must not depend on hidden preview-only code. Keep SolidStart-specific syntax and lifecycle guidance in its integration guide.

Render previews in an isolated document so framework reset/theme styles cannot restyle the documentation shell. Use the same canonical CSS and example source for preview, copied code, and verification.

Distinguish shipped features, approved changes awaiting implementation, and candidate additions. Update source examples, reference docs, and migration notes together when public names or behavior change.

## 14. Debugging and review

When a style behaves unexpectedly, inspect the rendered element and computed styles before adding a selector:

1. Confirm markup, required classes, attributes, and stylesheet/assets are present.
2. Identify the winning declaration, its layer, importance, specificity, and source.
3. Check local token definitions versus inherited values and active theme boundaries.
4. Check state attributes, responsive rules, inline inputs, and unlayered third-party styles.
5. Fix the owning token, pattern, variant, utility, or behavior rather than adding a page-specific patch.

Before accepting a component change, confirm:

- The change belongs at the chosen ownership boundary.
- Repeated values/default overrides have been fixed at their source.
- Component styling stays in its intended layer and canonical location.
- Existing defaults and Section behavior remain stable unless explicitly changed.
- Multiple instances, keyboard operation, narrow layouts, long content, and reduced motion work where relevant.
- HTML and TSX examples reproduce the same contract.
- Relevant Bun build/check/format and behavior checks pass; migration notes explain breaking changes.

## Source basis

Repository styling and conventions were read from `apps/constella/CONSTELLA.md` and `src/styles/{global,base,patterns,utilities}.css` in [the Constella repository](https://github.com/seanrobmerriam/constella). The recorded baseline for the existing project documents is commit `5b921a59927a2b0de66c07b51ec84923764d636c`.

Approved changes are defined in [constella-requirements-and-changes.md](https://chatgpt.com/library?file_id=libfile_81a615cb36a481919e2f3f7c0ebf88bb&account_id=personal). Execution choices are described in the [implementation plan](https://chatgpt.com/library?file_id=libfile_20c0ed25f8a08191aa655144fc3d945d&account_id=personal).

Browser cascade behavior follows [CSS Cascading and Inheritance Level 5](https://www.w3.org/TR/css-cascade-5/); custom property behavior is documented in [MDN's custom property guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties).

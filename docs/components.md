# Constella — Component Catalog

Status: verified source-file inventory plus proposed expansion backlog  
Repository baseline: `5b921a59927a2b0de66c07b51ec84923764d636c`  
Companion documents: [Project Overview](constella-overview.md) · [Requirements and Changes](constella-requirements-and-changes.md)

## Reading this catalog

The inspected repository contains **35 Astro component files** under `apps/constella/src/components`. “Present” means the file exists; it does not mean its complete API, behavior, accessibility, or cross-framework portability has been audited. Purpose descriptions below are orientation notes based on names and repository conventions, not verified API specifications.

All existing entries still need a documentation/API audit and portable HTML / CSS and TSX examples where applicable. Proposed additions are a candidate backlog, not implemented components or an approved commitment to build every item.

## Existing source inventory

### Actions

| Component | Intended role / audit note    | Source path relative to components/ |
| --------- | ----------------------------- | ----------------------------------- |
| Button    | Action or navigation control. | `Button.astro`                      |

### Form

| Component | Intended role / audit note                                             | Source path relative to components/ |
| --------- | ---------------------------------------------------------------------- | ----------------------------------- |
| Choice    | Choice control; confirm checkbox/radio modes and grouping from source. | `form/Choice.astro`                 |
| Fieldset  | Related form controls and group labeling.                              | `form/Fieldset.astro`               |
| Form      | Form composition and submission boundary.                              | `form/Form.astro`                   |
| Input     | Single-line input; supported types and validation states need audit.   | `form/Input.astro`                  |
| Range     | Range input and its label/value presentation.                          | `form/Range.astro`                  |
| Select    | Selection field; verify native/custom behavior.                        | `form/Select.astro`                 |
| Textarea  | Multiline text input.                                                  | `form/Textarea.astro`               |

### Global

| Component | Intended role / audit note                         | Source path relative to components/ |
| --------- | -------------------------------------------------- | ----------------------------------- |
| Footer    | Site footer composition.                           | `global/Footer.astro`               |
| Nav       | Site navigation composition.                       | `global/Nav.astro`                  |
| NavLink   | Navigation link helper.                            | `global/NavLink.astro`              |
| SkipLink  | Bypass repeated navigation and reach main content. | `global/SkipLink.astro`             |

### Interactive

| Component     | Intended role / audit note                                                                   | Source path relative to components/ |
| ------------- | -------------------------------------------------------------------------------------------- | ----------------------------------- |
| Accordion     | Disclosure group composition.                                                                | `interactive/Accordion.astro`       |
| AccordionItem | Individual disclosure item.                                                                  | `interactive/AccordionItem.astro`   |
| Dropdown      | Dropdown surface and trigger; verify its semantic role before documenting keyboard behavior. | `interactive/Dropdown.astro`        |
| Marquee       | Moving content presentation; requires motion and pause review.                               | `interactive/Marquee.astro`         |
| Modal         | Dialog surface; verify focus management and dismissal.                                       | `interactive/Modal.astro`           |
| Slider        | Sliding content presentation; verify carousel behavior and controls.                         | `interactive/Slider.astro`          |
| TabLink       | Tab-related trigger/link helper; verify its relationship to Tabs.                            | `interactive/TabLink.astro`         |
| Tabs          | Tabbed content composition.                                                                  | `interactive/Tabs.astro`            |

### Item

| Component | Intended role / audit note                                | Source path relative to components/ |
| --------- | --------------------------------------------------------- | ----------------------------------- |
| Card      | Content container with documented variants to be audited. | `item/Card.astro`                   |

### Media

| Component | Intended role / audit note                               | Source path relative to components/ |
| --------- | -------------------------------------------------------- | ----------------------------------- |
| Icon      | Icon asset presentation.                                 | `media/Icon.astro`                  |
| Img       | Image presentation and source handling.                  | `media/Img.astro`                   |
| Overlay   | Media/surface overlay; inspect layering and interaction. | `media/Overlay.astro`               |
| Video     | Video presentation and playback-related options.         | `media/Video.astro`                 |

### Typography

| Component | Intended role / audit note                                  | Source path relative to components/ |
| --------- | ----------------------------------------------------------- | ----------------------------------- |
| Eyebrow   | Short introductory text above a heading or content block.   | `typography/Eyebrow.astro`          |
| Heading   | Semantic heading with a separately selectable visual style. | `typography/Heading.astro`          |
| Paragraph | Paragraph text styling.                                     | `typography/Paragraph.astro`        |
| RichText  | Styling for structured prose and rich content.              | `typography/RichText.astro`         |

### Utility

| Component     | Intended role / audit note                                            | Source path relative to components/ |
| ------------- | --------------------------------------------------------------------- | ----------------------------------- |
| BaseHead      | Astro document metadata helper; not a portable CSS widget.            | `utility/BaseHead.astro`            |
| FormattedDate | Date formatting/presentation helper; formatting semantics need audit. | `utility/FormattedDate.astro`       |

### Wrapper

| Component      | Intended role / audit note                                                                     | Source path relative to components/ |
| -------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------- |
| ButtonWrapper  | Layout and alignment for grouped actions.                                                      | `wrapper/ButtonWrapper.astro`       |
| ContentWrapper | Content composition and alignment; repository instructions describe shared alignment behavior. | `wrapper/ContentWrapper.astro`      |
| Grid           | Responsive layout composition and breakpoint reference.                                        | `wrapper/Grid.astro`                |
| Section        | Section spacing, theme, and container composition.                                             | `wrapper/Section.astro`             |

## Documentation classification

| Category                                | Documentation treatment                                                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Portable visual components              | Show the CSS/markup contract first, with equivalent generic React TSX.                                                    |
| Interactive components                  | Include the visual contract and a working behavior implementation or explicit dependency/setup.                           |
| Composition wrappers                    | Explain the resulting HTML, classes, alignment, layout, and responsive behavior; show when a plain element is sufficient. |
| Site compositions                       | Present Nav and Footer as adaptable compositions until their reusable public API is verified.                             |
| Helper components                       | Explain AccordionItem, TabLink, and NavLink alongside their parent patterns where that is clearer than separate pages.    |
| Astro metadata and formatting utilities | Document BaseHead and FormattedDate as integration utilities; do not invent a portable CSS equivalent.                    |

“Zero JavaScript for styling” is distinct from “zero JavaScript for every interaction.” Audit existing behavior before assigning either claim to a component.

## Proposed expanded library

These entries are recommendations for selecting future work. Reconcile them with existing variants before creating new components.

| Area                 | Candidate additions                                                    | Scope and behavior considerations                                                                        |
| -------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Actions              | Button group, icon button, text link                                   | Prefer existing Button/Wrapper variants when sufficient; require accessible names for icon-only actions. |
| Content and identity | Badge, avatar, divider, list, description list, blockquote, code block | Define semantic markup and token-driven variants; avoid unnecessary wrappers.                            |
| Feedback             | Alert, toast, progress, spinner, skeleton, empty state                 | Distinguish persistent content from live announcements; provide reduced-motion treatment.                |
| Navigation           | Breadcrumbs, pagination, sidebar, navigation menu                      | Define current-page state, overflow, and mobile behavior; build on Nav where appropriate.                |
| Forms                | Field, label, help text, error message, switch, file input             | First audit existing Input, Choice, and Fieldset coverage; define validation and grouping.               |
| Overlays             | Tooltip, popover, confirmation dialog, drawer                          | Reuse Modal where practical; define focus, dismissal, positioning, and touch behavior.                   |
| Data presentation    | Table, sortable table pattern, statistic, timeline                     | Start with semantic tables; sorting is behavior layered over presentation.                               |
| Layout               | Container, stack, cluster, app shell, split layout                     | Check Section, Grid, ContentWrapper, and utilities before adding named components.                       |
| Complex controls     | Combobox, command menu, date picker                                    | Defer until a concrete use case justifies their state and accessibility complexity.                      |

### Suggested first expansion candidates

If the current audit finds no equivalent variants, start with Badge, Alert, Avatar, Table, Breadcrumbs, Pagination, and form help/error patterns. They cover common website and application needs without making the first expansion depend on complex widgets. Confirm the subset before implementation.

## Required component record

For each public component, maintain the following fields:

| Field             | What to record                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------- |
| Name and category | Stable public name, implementation name, and navigation category.                           |
| Source and status | Source path/revision; present, audited, documented, verified, or proposed.                  |
| Purpose           | When to use it and relevant alternatives.                                                   |
| Markup contract   | Semantic elements, required classes, data attributes, IDs, and child structure.             |
| Styling API       | Variants, sizes, tokens, themes, states, and responsive rules actually supported.           |
| Framework API     | Astro props/slots and the general React TSX example where appropriate.                      |
| Behavior          | Native behavior, TypeScript enhancement, framework state, lifecycle, and dependencies.      |
| Accessibility     | Names, roles, labels, keyboard interaction, focus, motion, and announcements as applicable. |
| Assets            | Images, icons, fonts, paths, and required processing.                                       |
| Examples          | Preview, default HTML / CSS tab, TSX tab, variants, and edge cases.                         |
| Evidence          | Build/example verification, manual checks, known limitations, and last reviewed revision.   |

Do not expose every internal helper as a new public component merely because it has its own source file.

## Example standard

1. Use the same content and CSS classes in both tabs.
2. Make HTML / CSS the selected tab initially.
3. Show a general React component in a `.tsx` file, with TypeScript types where useful.
4. Keep Astro, TanStack Start, and SolidStart setup details in their integration guides.
5. Disclose global stylesheet imports and any local additions.
6. Include or link required interactive behavior; static styling alone is not a working interactive example.
7. Use unique IDs for repeated instances when labels, triggers, and panels depend on them.
8. Use real class/token names confirmed against source; placeholders are only acceptable in explicitly illustrative planning examples.

## Completion checklist

- [ ] Public role and relationship to existing variants are clear.
- [ ] Source, markup, variants, and dependencies are audited.
- [ ] Preview and copied examples use the actual framework styles.
- [ ] HTML / CSS and TSX examples produce equivalent output where applicable.
- [ ] Relevant keyboard, focus, semantics, motion, and responsive states are reviewed.
- [ ] Claimed integration examples compile and render.
- [ ] Limitations and verification evidence are recorded.

## Sources and limits

Inventory source: [component directory at the inspected revision](https://github.com/seanrobmerriam/constella/tree/5b921a59927a2b0de66c07b51ec84923764d636c/apps/constella/src/components).

Authoring guidance: [CONSTELLA.md](https://github.com/seanrobmerriam/constella/blob/5b921a59927a2b0de66c07b51ec84923764d636c/apps/constella/CONSTELLA.md).

This catalog inventories filenames and uses repository guidance for orientation. It does not claim that every component implementation was read or tested. The upstream Lumos inventory has not yet been compared with this list, so inherited versus new components remain unclassified.

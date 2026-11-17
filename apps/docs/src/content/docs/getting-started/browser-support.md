---
title: Browser support
description: Which browsers Constella supports, what each feature needs, and what older browsers see.
---

Constella supports current versions of Chrome, Edge, Firefox and Safari, on desktop and mobile, back to:

| Browser            | Minimum | Set by        |
| ------------------ | ------- | ------------- |
| Chrome, Edge       | 111     | `color-mix()` |
| Firefox            | 121     | `:has()`      |
| Safari, iOS Safari | 16.2    | `color-mix()` |

Below these versions, colors or layout break, not just polish. Internet Explorer and pre-Chromium Edge aren't supported.

## Tested

CI runs the component, accessibility and integration suites in three engines: **Chromium**, **Firefox** and **WebKit**, the engine behind Safari. Each uses the version that ships with the Playwright release the repo pins. Older versions aren't tested automatically. The minimums above come from the features the built stylesheet uses.

## What the minimum versions are for

The stylesheet needs these. Without them, colors or layout break:

| Feature                   | Used for                                              | Chrome | Firefox | Safari |
| ------------------------- | ----------------------------------------------------- | ------ | ------- | ------ |
| Cascade layers (`@layer`) | The order of base, patterns, components and utilities | 99     | 97      | 15.4   |
| `color-mix()`             | Borders, secondary text, hover and theme colors       | 111    | 113     | 16.2   |
| `:has()`                  | Layouts and states that depend on their content       | 105    | 121     | 15.4   |
| Container units (`cqw`)   | The Marquee's strip width                             | 105    | 110     | 16     |
| `svh`, `dvh`              | Full-height sections and the open mobile menu         | 108    | 101     | 15.4   |

CSS nesting is flattened when the stylesheet is built, so it isn't a requirement.

## Older browsers in the supported range

These features are newer than the minimums. Browsers without them still work, with the difference described. Versions are from caniuse and the browsers' release notes as of November 2026. "none" means no stable release yet:

| Feature                                     | Without it                                                           | Chrome | Firefox | Safari |
| ------------------------------------------- | -------------------------------------------------------------------- | ------ | ------- | ------ |
| `<details name>` (exclusive groups)         | Accordion items open independently instead of one at a time          | 120    | 130     | 17.2   |
| `lh` unit                                   | Textarea ignores its minimum and maximum line counts                 | 109    | 120     | 16.4   |
| `interpolate-size` with `::details-content` | Details and accordions open and close without animating their height | 131    | none    | none   |
| `@starting-style`, `allow-discrete`         | Dropdowns and modals appear without fading in                        | 117    | 129     | 17.5   |
| `text-box-trim`                             | Text keeps the space above capitals and below the baseline           | 133    | 154     | 18.2   |
| `field-sizing: content`                     | Textareas keep their starting height instead of growing as you type  | 123    | none¹   | 26.2   |
| `scrollend` event                           | The Slider ends a mouse drag after a short delay instead             | 114    | 109     | 26.2   |

¹ Firefox accepts `field-sizing: content`, but Firefox 159, the version CI tests, doesn't size a textarea to its content. Textareas there keep their starting height and scroll.

## JavaScript

The behavior modules are ES2022 modules. They use `<dialog>` and `showModal()`, `ResizeObserver`, `IntersectionObserver`, `MutationObserver` and `matchMedia`. All of these are in every supported browser.

Every component works without JavaScript, with less behavior. Each component page's **Behavior** section says what changes.

## Reporting a problem

If something breaks in a supported browser, open an issue with the browser, its version and the component. Screenshots help.

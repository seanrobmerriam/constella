# Changelog

All notable changes to Constella. The framework's version is the `version` in
`apps/shared/package.json` (`@constella/shared`); see
[`docs/releasing.md`](docs/releasing.md). Entries under **Breaking** need a
matching section on the docs [Migration](apps/docs/src/content/docs/migration.mdx)
page.

## Unreleased

Everything since the first monorepo commit (`5b921a5`). No version has been
released yet.

### Breaking

- `ButtonWrapper` is now `InputWrapper`, and `.button-wrapper` is now
  `.input-wrapper`. It groups any controls, not only buttons.
- `AccordionItem` is replaced by `Details` and `Summary`. The `.accordion_item`,
  `.accordion_toggle`, `.accordion_icon` and `.accordion_body` classes are now
  `.details_wrap`, `.details_summary`, `.details_icon` and `.details_body`.
  Accordion items no longer share a `name` without JavaScript.
- `Eyebrow` is merged into `Heading` as the `eyebrow` and `eyebrow-tag`
  variants. `.eyebrow_wrap`, `.eyebrow_marker` and `.eyebrow_text` are gone.
- `Nav` is now `Navbar`, and `BaseLayout` no longer adds it: place it in the
  `header` slot. The navbar's links come from `src/config/navbar.ts`.
- `BaseLayout` no longer adds `Footer`: place it in the `footer` slot. Its
  content comes from `src/config/footer.ts`.
- `BaseLayout`'s `overlap` option is removed, with no replacement.
- `SkipLink` is now `Skip`.
- `--brand-500` is now `#ebe65b` (was `#c6fb50`).
- Light-theme accent words are dark text on a yellow highlight, not brand-colored
  text. New token: `--heading-accent-background`.

### Added

- Badge: an inline label for a status, category or count, in neutral, brand
  and status tones, sized relative to the surrounding text.
- Alert: info, success, warning and error tones, an optional title and icon,
  and an optional dismiss button (`behaviors/alert.js`) that moves focus on
  instead of losing it.
- Field help and errors: `help` and `error` props on Input, Textarea and
  Select, and the `.field-help` and `.field-error` classes. Messages sit
  outside the label and are linked with `aria-describedby`; an error also sets
  `aria-invalid`. The control gets an error border from `aria-invalid` or the
  browser's `:user-invalid`.
- Status color tokens: `--status-error`, `--status-success`,
  `--status-warning`, `--status-info`, each at least 4.5:1 on its theme's
  backgrounds.
- `@constella/shared`: one stylesheet per component family, bundled as
  `dist/constella.css`, plus optional behavior modules in `dist/behaviors/`
  (accordion, dropdown, form, marquee, modal, navbar, range, slider, tabs,
  theme). Each `init…(root)` returns a cleanup function.
- Button `size` and `radius` props, shared by all controls through
  `data-size` and `data-radius`.
- Navbar options: `sticky`, `search`, `themeToggle`, `icons`. A light/dark
  theme toggle with saved and system preferences, and locked layout themes.
- Footer options: `variant`, `theme`, `spacing`.
- `BaseHead` can be used on its own in a custom layout.
- Documentation site: a page for every component, with a live preview, HTML and
  React TSX examples, tokens and accessibility notes; foundations pages;
  integration guides for plain HTML, React, TanStack Start, SolidStart and
  Astro; and this migration guide.
- Browser support: Chrome and Edge 111, Firefox 121, Safari 16.2 and later.
  CI runs the component, accessibility and integration suites in Firefox and
  WebKit as well as Chromium. See the docs Browser support page.
- Accessibility checks in CI: axe-core on every example in light, dark and
  brand, reflow at 320px, and a visible focus indicator on every tab stop
  (`bun run test:a11y`). A Foundations page says what is and isn't tested.
- Checks: a component manifest and `check:docs`, `check:docs-sync`,
  `check:examples`, and Playwright suites for components, docs and the four
  integration fixtures, all run in CI.

### Changed

- `--text-2` is the text color at 70% opacity (was 60%), so secondary text
  keeps at least 4.5:1 contrast in every theme. Unselected tabs, navbar links,
  rich-text list markers and the dropdown's hover color now use it instead of
  their own 60% mix.
- Slider markers are 24px targets around the same 12px dot, and sit 24px apart.
- Marquee holds still, with its toggle hidden, until its script runs. Pressing
  play now works under reduced motion.
- Components that had inline scripts (Form, Range, Dropdown, Modal, Tabs,
  Slider, Marquee) use the shared behavior modules.

### Fixed

- Form: `method="get"` forms always failed to send.
- Dropdown: Escape closed every open dropdown and moved focus.
- Dropdown and Details: content couldn't take focus while opening.
- Tabs: the pause button couldn't keep auto-rotation paused.
- Slider: after a mouse drag, the next click in the slider was ignored.
- Marquee: text-only strips clipped descenders.
- Modal: focus returns to the opener in browsers that don't do it themselves.
- Light-theme heading accents had too little contrast.

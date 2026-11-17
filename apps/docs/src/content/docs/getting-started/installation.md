---
title: Installation
description: Add the Constella stylesheet and optional behavior to a page.
---

Constella is not published to a package registry yet, so there is no `npm install` command. The distributable files are built from the repository:

```sh
bun install
bun run --cwd apps/shared build
```

This writes `apps/shared/dist/`:

- `constella.css`: the complete stylesheet. It declares `@layer base, patterns, components, utilities;` itself, so it does not depend on any framework.
- `behaviors/*.js`: optional ES modules, one per component that needs a script: `accordion`, `dropdown`, `form`, `marquee`, `modal`, `navbar`, `range`, `slider`, `tabs` and `theme`. Each component's page says which one it needs.

`constella.css` is the only supported entry point. The per-component source files are not meant to be loaded on their own; [How the stylesheets work](/foundations/styles-architecture/) explains why.

## Plain HTML

Copy the files next to your page and link the stylesheet:

```html
<link rel="stylesheet" href="constella.css" />
```

Examples that need behavior include a module script, for example:

```html
<script type="module">
  import { initAccordion } from "./behaviors/accordion.js";
  document
    .querySelectorAll("[data-accordion]")
    .forEach((root) => initAccordion(root));
</script>
```

Each `init…` function returns a cleanup function. Call it if you remove the element. The [Plain HTML guide](/integrations/html/) covers the rest, including the theme and pasting several examples on one page.

## React

Import the stylesheet once, then use the TSX examples. They call the same behavior in `useEffect` and return its cleanup. The [React guide](/integrations/react/) covers the setup, the theme and converting HTML to TSX.

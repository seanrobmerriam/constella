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
- `behaviors/accordion.js`, `behaviors/navbar.js`, `behaviors/theme.js`: optional ES modules.

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

Each `init…` function returns a cleanup function. Call it if you remove the element.

## React

Import the stylesheet once, then use the TSX examples. They call the same behavior in `useEffect` and return its cleanup.

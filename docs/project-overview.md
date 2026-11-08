# Constella — Project Overview

Status: working project brief  
Repository: https://github.com/seanrobmerriam/constella  
Companion documents: [Component Catalog](constella-components.md) · [Requirements and Changes](constella-requirements-and-changes.md)

## Purpose

Constella is a CSS framework for quickly building beautiful, functional, and accessible websites and web applications. It is a fork of Lumos, expanded beyond its original environment to support Astro, React, TanStack Start, SolidStart, plain HTML, and other environments that consume CSS stylesheets.

The core product is the styling system: CSS custom properties, reusable patterns, utilities, component styles, and the markup those styles expect. Framework components make that system convenient to use; the styling system should remain useful without them.

## Product direction

Constella should give developers a coherent visual foundation and a broad component library without requiring a particular application framework. A developer should be able to start with a working example, customize the design through tokens and variants, and keep the same visual language as the application grows.

Astro is the primary development environment. It hosts the reference implementation, component demonstrations, and development pages. Framework support describes where developers can use Constella; it does not change the choice of Astro for developing the framework itself.

The initial audience includes individual developers, design engineers, and teams building marketing sites, content sites, dashboards, and application interfaces.

## Confirmed decisions

| Area          | Decision                                                                        |
| ------------- | ------------------------------------------------------------------------------- |
| Foundation    | Fork Lumos and adapt its documentation as the starting point.                   |
| Scope         | A CSS framework with an expanded component library.                             |
| Development   | Use the Astro installation for ongoing framework development.                   |
| Repository    | Maintain the development site and documentation in one monorepo.                |
| Documentation | Explain the common CSS and markup first.                                        |
| Example tabs  | Default to HTML / CSS, with a second TSX tab showing a general React component. |
| Integrations  | Cover Astro, React, TanStack Start, SolidStart, and plain HTML.                 |

The TSX tab is a general React example, not a promise that the same component source works unchanged in Solid. Solid-specific behavior and syntax belong in its integration guide.

## Current repository baseline

The repository was inspected at commit `5b921a59927a2b0de66c07b51ec84923764d636c`. These observations describe source presence, not a completed runtime or accessibility audit.

| Location         | Current role and observed state                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/constella` | Astro reference site; contains 35 Astro component files, a component example page, styles, layouts, and utilities.                      |
| `apps/docs`      | Starlight documentation app; configuration and homepage still contain starter branding and example content.                             |
| `apps/shared`    | Source package with export paths for components, layouts, styles, config, and utilities; inspected source folders contain placeholders. |
| Repository root  | Bun workspace scripts for development, builds, checking, and formatting.                                                                |

The component release badge on the reference homepage says `v1.0.2`; it should not be treated as proof of a published package version. The private app/package versions and framework release have separate meanings in the repository instructions.

## Architecture direction

1. **CSS foundation:** tokens, themes, typography, reusable patterns, and utilities.
2. **Component contracts:** semantic markup, required classes, supported variants, states, and optional behavior.
3. **Framework conveniences:** Astro components and documented React TSX examples; additional wrappers can follow demonstrated demand.
4. **Documentation and examples:** installation, foundations, component reference, integration guides, and migration guidance.

The shared package is the intended home for source genuinely used by both apps. Extracting shared CSS and examples should avoid creating a second implementation that can drift from the reference site. Public package structure and distribution remain decisions to make.

## Styling and contribution principles

The existing `apps/constella/CONSTELLA.md` establishes conventions that should inform public guidance:

- Compose pages from existing components and layouts before adding abstractions.
- Prefer tokens and component variants; use utilities for individual overrides.
- Keep custom styling with the smallest component that owns it.
- Place component styling under `@layer components` and retain the established class naming rules.
- Use relative lengths: `rem`, `em`, and `ch` as appropriate; the repository documents a separate container-unit convention for scalable graphics.
- Keep visual heading styles independent from semantic heading levels.
- Keep prop names, defaults, and descriptions consistent across related components.

Some conventions are Astro authoring rules, such as `render` and slot handling. Public CSS documentation must distinguish those conveniences from requirements of plain HTML consumers.

## Documentation experience

Use Lumos documentation as source material, then validate every carried-over concept against Constella. Retain applicable explanations and attribution, rewrite environment-specific instructions, and add coverage for new components and integrations. The exact upstream documentation source and reuse terms still need to be recorded.

Each component page should provide:

1. A description and guidance on when to use it.
2. A live preview of the documented example.
3. HTML / CSS and TSX tabs showing equivalent output.
4. Variants, states, required markup, and customization points.
5. Keyboard behavior, semantics, focus behavior, and other relevant accessibility notes.
6. An explicit statement of any runtime behavior or dependency required.

HTML / CSS examples should disclose the Constella stylesheet import and any additional styles. Interactive examples must include or link the behavior needed to reproduce them; a styled mockup should not be presented as a functioning widget.

## Delivery boundaries

The immediate work is to document the existing framework, make its CSS consumption clear, and define a manageable path toward broader support and component coverage. Hosting customer sites, account systems, databases, billing, visual builders, and deployment orchestration are outside this framework documentation effort.

Framework compatibility is a goal until a corresponding guide and working example have been verified. Component file presence similarly does not establish portability, completeness, or accessibility compliance.

## Success criteria

- A new user can create a styled plain HTML page from the getting-started guide.
- A React user can copy a TSX example without importing an Astro component.
- The Astro reference implementation and published examples show equivalent component structure and styling.
- Existing components have documentation covering their actual states and behavior.
- Integrations explain CSS loading, assets, runtime behavior, and relevant rendering constraints.
- The documentation clearly distinguishes available features, planned work, and unresolved decisions.

## Sources

- [Repository README](https://github.com/seanrobmerriam/constella/blob/5b921a59927a2b0de66c07b51ec84923764d636c/README.md)
- [Repository instructions](https://github.com/seanrobmerriam/constella/blob/5b921a59927a2b0de66c07b51ec84923764d636c/AGENTS.md)
- [Constella authoring conventions](https://github.com/seanrobmerriam/constella/blob/5b921a59927a2b0de66c07b51ec84923764d636c/apps/constella/CONSTELLA.md)
- [Source tree](https://github.com/seanrobmerriam/constella/tree/5b921a59927a2b0de66c07b51ec84923764d636c)
- Product direction and documentation example format confirmed by Sean in this project conversation.

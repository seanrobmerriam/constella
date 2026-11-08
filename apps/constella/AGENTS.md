# Constella for Astro

This is **Constella for Astro**, an Astro component framework styled with plain CSS
and custom properties. Do not apply conventions from **upstream Webflow framework**.
Project conventions live in `CONSTELLA.md` and `.agents/skills/`.

## Development

Start the dev server in background mode:

```
astro dev --background
```

Use `astro dev stop`, `astro dev status`, and `astro dev logs` to manage it.

## Astro documentation

Use the relevant [Astro documentation](https://docs.astro.build) before working
on these areas:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Building

Read [CONSTELLA.md](CONSTELLA.md) before adding pages, components, or styles.

## Skills

Task-specific procedures live in `.agents/skills/<name>/SKILL.md`, alongside
any scripts they need.

- `constella-import-figma` — build pages or variables from a Figma file.
- `constella-audit-props` — check prop order and tooltip consistency.
- `constella-scaling-graphic` — build an editable graphic that scales as one piece.
- `constella-import-webflow` — migrate a Webflow export and connect its CMS.
- `constella-upgrade-version` — upgrade Constella without losing customizations.

`.agents/skills/` is the source of truth. Claude Code loads the same skills from
relative symlinks in `.claude/skills/`. For each new skill, add
`.claude/skills/<name>` pointing to `../../.agents/skills/<name>`.

- Codex: use `$constella-import-figma` or ask for the skill by name. Restart Codex
  if a new skill does not appear.
- Claude Code: use `/constella-import-figma` or let it load the skill when relevant.
- Other assistants: read `SKILL.md` directly. Instructions are Markdown and
  scripts are Node.

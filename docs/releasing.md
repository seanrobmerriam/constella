# Releasing Constella

## Which version is Constella's

The framework is `@constella/shared`: the stylesheet and behaviors people
install. Its `version` in `apps/shared/package.json` is **the** Constella
version, and the only one a release changes.

The other packages are private and have no release of their own:

| Package                              | Version means                            |
| ------------------------------------ | ---------------------------------------- |
| `@constella/shared`                  | The framework version. Released.         |
| `@constella/site`, `@constella/docs` | Nothing. Private apps, never published.  |
| `@constella/fixture-*`               | Nothing. Test fixtures, never published. |

The reference site's home page shows this version, read from
`apps/shared/package.json` at build time, so it always matches.

No version has been released, and nothing is published to a registry yet. A
release needs the project owner's go-ahead. These steps don't publish anything
on their own.

## Version numbers

Semantic versioning, applied to what users write:

- **Major:** a breaking change. A class, token, custom property, `data-`
  attribute, behavior export or Astro prop is renamed or removed, or markup
  that worked stops working.
- **Minor:** something new that existing markup doesn't need: a component,
  variant, prop, token or behavior option.
- **Patch:** a fix that keeps the documented markup and API.

Before 1.0.0, a minor version may include breaking changes. The changelog
still lists them under **Breaking**.

## Every pull request

1. Add a line to `CHANGELOG.md` under **Unreleased**, in Breaking, Added,
   Changed or Fixed. Skip this only for changes users can't see (tests,
   tooling, internal docs).
2. A **Breaking** entry also needs a section on the docs Migration page
   (`apps/docs/src/content/docs/migration.mdx`), with real before and after
   markup.
3. The pull request template's checklist asks for both.

## Cutting a release

1. Choose the version from the **Unreleased** entries, using the rules above.
2. Set `version` in `apps/shared/package.json`.
3. Rename **Unreleased** in `CHANGELOG.md` to `## <version> — <date>` and start
   a new, empty **Unreleased** section.
4. Run every check: `bun run build`, `bun run check`, `bun run format:check`,
   `bun run check:docs`, `bun run test:components`, `bun run test:docs` and
   `bun run test:integrations`.
5. Build the distributable: `bun run --cwd apps/shared build`.
6. Merge, then tag the merge commit `v<version>`.

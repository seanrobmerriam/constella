/**
 * bun run check:docs-sync [base-ref]
 *
 * For a branch or pull request: if a documented component's source changed
 * (its Astro files, its own stylesheet, its behavior or its example), its docs
 * page must change in the same branch. Shared foundation files (base,
 * patterns, controls, utilities, index.css) are exempt: the Foundations pages
 * are generated from them.
 *
 * To skip for a change with no documentation impact (formatting, a refactor
 * with identical output), add a `Docs-Skip: <reason>` line to a commit message
 * on the branch.
 *
 * base-ref defaults to $DOCS_SYNC_BASE, then origin/main.
 */
import { $ } from "bun";
import { components } from "../apps/shared/src/manifest.ts";

const base = process.argv[2] ?? process.env.DOCS_SYNC_BASE ?? "origin/main";
const range = `${base}...HEAD`;

const changed = new Set(
  (await $`git diff --name-only ${range}`.text()).split("\n").filter(Boolean),
);
const messages = await $`git log --format=%B ${base}..HEAD`.text();
const skip = messages.match(/^Docs-Skip:\s*(.+)$/m);

const foundation = new Set([
  "base.css",
  "patterns.css",
  "controls.css",
  "utilities.css",
  "index.css",
]);

const missing: { name: string; docs: string; because: string[] }[] = [];
for (const c of components) {
  if (c.status !== "documented" || !c.docs) continue;
  const sources = [
    ...c.astro.map((f) => `apps/constella/src/components/${f}`),
    ...c.styles
      .filter((s) => !foundation.has(s))
      .map((s) => `apps/shared/src/styles/${s}`),
    ...(c.behaviors ?? []).map((b) => `apps/shared/src/behaviors/${b}.ts`),
  ];
  const because = sources.filter((f) => changed.has(f));
  if (c.example)
    for (const f of changed)
      if (f.startsWith(`apps/shared/src/examples/${c.example}/`))
        because.push(f);
  const page = `apps/docs/src/content/docs/${c.docs}.mdx`;
  if (because.length && !changed.has(page))
    missing.push({ name: c.name, docs: page, because });
}

if (missing.length === 0) {
  console.log(
    `check:docs-sync passed (${changed.size} files changed since ${base}).`,
  );
  process.exit(0);
}

const report = missing
  .map(
    (m) =>
      `  ✗ ${m.name}: ${m.because.join(", ")} changed, but ${m.docs} did not.`,
  )
  .join("\n");

// A behavior can be shared (theme is used by Navbar and documented on the
// Themes page), so a shared file can flag a component whose page truly needs
// no change. Docs-Skip covers that case.
if (skip) {
  console.log(
    `check:docs-sync: skipped by "Docs-Skip: ${skip[1].trim()}". Would have flagged:\n${report}`,
  );
  process.exit(0);
}
console.error(
  `check:docs-sync: component source changed without its docs page.\n\n${report}\n\n` +
    `Update the page, or, if the change cannot affect the docs, add a\n` +
    `"Docs-Skip: <reason>" line to a commit message on this branch.`,
);
process.exit(1);

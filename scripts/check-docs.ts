/**
 * bun run check:docs
 *
 * Verifies that the component manifest (apps/shared/src/manifest.ts) matches
 * the source tree, and that every documented component has its stylesheet,
 * example, docs page and the standard page sections. Fails with a list of
 * every problem found, so one run shows everything to fix.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import {
  ASTRO_INTEGRATION_DOCS,
  components,
  requiredDocsSections,
} from "../apps/shared/src/manifest.ts";

const root = join(import.meta.dir, "..");
const p = (...parts: string[]) => join(root, ...parts);
const COMPONENTS = p("apps/constella/src/components");
const LAYOUTS = p("apps/constella/src/layouts");
const STYLES = p("apps/shared/src/styles");
const BEHAVIORS = p("apps/shared/src/behaviors");
const EXAMPLES = p("apps/shared/src/examples");
const DOCS = p("apps/docs/src/content/docs");

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

function walk(dir: string, ext: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? walk(join(dir, e.name), ext)
      : e.name.endsWith(ext)
        ? [join(dir, e.name)]
        : [],
  );
}

// Ids are unique.
const seen = new Set<string>();
for (const c of components) {
  if (seen.has(c.id)) fail(`manifest: duplicate id "${c.id}"`);
  seen.add(c.id);
}

// Every Astro component file belongs to exactly one entry, and every listed
// file exists.
const owners = new Map<string, string[]>();
for (const c of components)
  for (const file of c.astro)
    owners.set(file, [...(owners.get(file) ?? []), c.id]);
for (const file of walk(COMPONENTS, ".astro").map((f) =>
  relative(COMPONENTS, f),
)) {
  const ids = owners.get(file);
  if (!ids)
    fail(
      `apps/constella/src/components/${file} has no manifest entry. Add it to apps/shared/src/manifest.ts.`,
    );
  else if (ids.length > 1)
    fail(`${file} is listed by more than one entry: ${ids.join(", ")}`);
}
for (const file of owners.keys())
  if (!existsSync(join(COMPONENTS, file)))
    fail(
      `manifest lists apps/constella/src/components/${file}, which does not exist`,
    );

// Stylesheets exist, every component stylesheet has an owner, and index.css
// imports exactly the files on disk.
const componentSheets = readdirSync(join(STYLES, "components"))
  .filter((f) => f.endsWith(".css"))
  .map((f) => `components/${f}`);
const styleOwners = new Map<string, string[]>();
for (const c of components)
  for (const s of c.styles) {
    if (!existsSync(join(STYLES, s)))
      fail(`${c.id}: stylesheet ${s} does not exist`);
    styleOwners.set(s, [...(styleOwners.get(s) ?? []), c.id]);
  }
for (const s of componentSheets)
  if (!styleOwners.has(s))
    fail(`styles/${s} belongs to no component in the manifest`);

const index = readFileSync(join(STYLES, "index.css"), "utf8");
const imported = [...index.matchAll(/@import\s+"\.\/([^"]+)"/g)].map(
  (m) => m[1],
);
for (const s of imported)
  if (!existsSync(join(STYLES, s)))
    fail(`index.css imports ${s}, which does not exist`);
for (const s of [
  ...componentSheets,
  "base.css",
  "patterns.css",
  "controls.css",
  "utilities.css",
])
  if (!imported.includes(s)) fail(`index.css does not import ${s}`);

// Each component stylesheet's header names its docs pages, and those match
// the documented components that use it.
for (const s of componentSheets) {
  const css = readFileSync(join(STYLES, s), "utf8");
  const header = css.match(/^\/\*([\s\S]*?)\*\//)?.[1];
  if (!header || !/Component:/.test(header)) {
    fail(
      `styles/${s} is missing its header comment (see other component files)`,
    );
    continue;
  }
  const docsLine =
    header.match(/Docs:([\s\S]*?)(?=\n\s*\*\s*\w+:|$)/)?.[1] ?? "";
  const listed = [...docsLine.matchAll(/\/(components\/[\w-]+)\//g)]
    .map((m) => m[1])
    .sort();
  const expected = components
    .filter((c) => c.status === "documented" && c.styles.includes(s))
    .map((c) => c.docs!)
    .sort();
  if (listed.join() !== expected.join())
    fail(
      `styles/${s} header "Docs:" lists [${listed.map((d) => `/${d}/`).join(", ") || "none"}], expected [${expected.map((d) => `/${d}/`).join(", ") || "none"}]`,
    );
}

// Behaviors exist and are built into dist.
const buildScript = readFileSync(p("apps/shared/scripts/build-css.ts"), "utf8");
const built = buildScript.match(/const behaviors = \[([^\]]*)\]/)?.[1] ?? "";
for (const c of components)
  for (const b of c.behaviors ?? []) {
    if (!existsSync(join(BEHAVIORS, `${b}.ts`)))
      fail(`${c.id}: behavior ${b} has no apps/shared/src/behaviors/${b}.ts`);
    if (!built.includes(`"${b}"`))
      fail(`${c.id}: behavior ${b} is not in the build-css.ts behaviors list`);
  }

// Examples: the registry and the manifest agree.
const registry = readFileSync(join(EXAMPLES, "index.ts"), "utf8");
const registryIds = [...registry.matchAll(/^\s*id:\s*"([\w-]+)"/gm)].map(
  (m) => m[1],
);
const manifestExamples = new Set(
  components.flatMap((c) => (c.example ? [c.example] : [])),
);
for (const id of registryIds)
  if (!manifestExamples.has(id))
    fail(`example "${id}" is in the registry but no manifest entry uses it`);
for (const c of components) {
  if (!c.example) continue;
  if (!registryIds.includes(c.example))
    fail(`${c.id}: example "${c.example}" is not in examples/index.ts`);
  for (const f of ["example.html", "Example.tsx"])
    if (!existsSync(join(EXAMPLES, c.example, f)))
      fail(`${c.id}: missing examples/${c.example}/${f}`);
}

// Every example's TSX is compiled and server-rendered by check:examples.
const reactFixture = readFileSync(p("tests/fixtures/react/render.tsx"), "utf8");
for (const id of registryIds)
  if (!reactFixture.includes(`/examples/${id}/Example"`))
    fail(
      `example "${id}" is not rendered by tests/fixtures/react/render.tsx (check:examples)`,
    );

// Docs pages.
const docsPages = new Set(
  walk(join(DOCS, "components"), ".mdx").map((f) =>
    relative(DOCS, f).replace(/\.mdx$/, ""),
  ),
);
const manifestDocs = new Set(
  components.flatMap((c) => (c.docs ? [c.docs] : [])),
);
for (const page of docsPages)
  if (!manifestDocs.has(page))
    fail(
      `docs page ${page}.mdx has no manifest entry. Set its entry's status to "documented".`,
    );

for (const c of components) {
  if (c.status !== "documented") continue;
  if (!c.example) fail(`${c.id}: documented but has no example`);
  if (!c.docs) {
    fail(`${c.id}: documented but has no docs page`);
    continue;
  }
  const file = join(DOCS, `${c.docs}.mdx`);
  if (!existsSync(file)) {
    fail(`${c.id}: docs page ${c.docs}.mdx does not exist`);
    continue;
  }
  const mdx = readFileSync(file, "utf8");
  if (!mdx.includes(`<ComponentExample id="${c.example}"`))
    fail(
      `${c.docs}.mdx does not render <ComponentExample id="${c.example}" />`,
    );
  const headings = [...mdx.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  let at = 0;
  for (const h of headings) if (h === requiredDocsSections[at]) at++;
  if (at < requiredDocsSections.length)
    fail(
      `${c.docs}.mdx: section "## ${requiredDocsSections[at]}" is missing or out of order. Required order: ${requiredDocsSections.join(" → ")}`,
    );
}

// Astro-only utilities and the site layouts have no HTML preview. They are
// documented as recipes on one page, which must name each of them.
const integrationFile = join(DOCS, `${ASTRO_INTEGRATION_DOCS}.mdx`);
const integration = existsSync(integrationFile)
  ? readFileSync(integrationFile, "utf8")
  : "";
if (!integration) fail(`${ASTRO_INTEGRATION_DOCS}.mdx does not exist`);
for (const c of components) {
  if (c.status !== "astro-only") continue;
  if (c.docs !== ASTRO_INTEGRATION_DOCS)
    fail(
      `${c.id}: astro-only entries are documented on ${ASTRO_INTEGRATION_DOCS}`,
    );
  else if (integration && !integration.includes(`<${c.name}`))
    fail(`${ASTRO_INTEGRATION_DOCS}.mdx has no recipe using <${c.name}>`);
}
for (const file of walk(LAYOUTS, ".astro")) {
  const name = relative(LAYOUTS, file).replace(/\.astro$/, "");
  if (integration && !integration.includes(`layouts/${name}.astro`))
    fail(
      `apps/constella/src/layouts/${name}.astro is not covered on ${ASTRO_INTEGRATION_DOCS}.mdx`,
    );
}

for (const c of components)
  if (c.status === "planned" && c.docs && docsPages.has(c.docs))
    fail(
      `${c.id}: has a docs page but is still "planned"; mark it "documented"`,
    );

const counts = Object.groupBy(components, (c) => c.status);
const summary = Object.entries(counts)
  .map(([k, v]) => `${v!.length} ${k}`)
  .join(", ");

if (errors.length) {
  console.error(`check:docs found ${errors.length} problem(s):\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error(`\nManifest: ${summary}.`);
  process.exit(1);
}
console.log(`check:docs passed. Manifest: ${summary}.`);

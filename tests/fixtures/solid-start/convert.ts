/**
 * Converts each canonical React example (apps/shared/src/examples/<id>/
 * Example.tsx) to Solid, into src/examples/<id>.tsx. The markup and classes
 * stay the same; only what differs between React and Solid JSX changes.
 * These are the rules integrations/solid-start.mdx documents:
 *
 * - `useRef` → a `let` variable that `ref={…}` assigns; `.current` goes.
 * - `useEffect(() => init(el), [])` → `onMount(() => onCleanup(init(el)))`.
 * - `useId` → `createUniqueId`.
 * - `className` → `class`, `htmlFor` → `for`, `tabIndex` → `tabindex`.
 * - camelCase SVG attributes and style keys → their CSS/SVG names.
 * - `defaultChecked` / `defaultValue` → `checked` / `value` (Solid sets them
 *   once; it has no controlled inputs).
 * - A boolean attribute set from an expression (`inert={x}`) → `bool:inert`,
 *   so `false` removes it instead of writing inert="false".
 * - `key` props go: Solid tracks list items by reference.
 * - `ReactNode` → `JSX.Element`.
 *
 * The output is generated on every build and not committed. The script
 * fails if anything React-specific is left over.
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const examples = fileURLToPath(
  new URL("../../../apps/shared/src/examples/", import.meta.url),
);
const out = fileURLToPath(new URL("./src/examples/", import.meta.url));

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

export function toSolid(source: string): string {
  let s = source;
  // React imports become Solid's.
  s = s.replace(/import[^;]*?from "react";\n/g, "");
  s = `import { createUniqueId, onCleanup, onMount, type JSX } from "solid-js";\n${s}`;
  // Refs.
  s = s.replace(/const (\w+) = useRef<([^>]+)>\(null\);/g, "let $1!: $2;");
  // One-line effects that start a behavior.
  s = s.replace(
    /useEffect\(\(\) => \((\w+)\.current \? (\w+)\(\1\.current\) : undefined\), \[\]\);/g,
    "onMount(() => onCleanup($2($1)));",
  );
  s = s.replace(
    /useEffect\(\(\) => (\w+)\((\w+)\.current!\), \[\]\);/g,
    "onMount(() => onCleanup($1($2)));",
  );
  // Block effects: the returned cleanup becomes onCleanup.
  s = s.replace(/useEffect\(\(\) => \{/g, "onMount(() => {");
  s = s.replace(/\}, \[\]\);/g, "});");
  s = s.replace(/return (\(\) =>[^;]+);/g, "onCleanup($1);");
  s = s.replace(/\.current!?/g, "");
  s = s.replace(/useId\(\)/g, "createUniqueId()");
  // Attributes.
  s = s.replace(/\bclassName=/g, "class=");
  s = s.replace(/\bhtmlFor=/g, "for=");
  s = s.replace(/\btabIndex=/g, "tabindex=");
  s = s.replace(/\bdefaultChecked\b/g, "checked");
  s = s.replace(/\bdefaultValue=/g, "value=");
  s = s.replace(/\s+key=\{[^}]+\}/g, "");
  s = s.replace(/\b(inert)=\{/g, "bool:$1={");
  s = s.replace(/\bplaysInline\b/g, "playsinline");
  s = s.replace(/\bReactNode\b/g, "JSX.Element");
  s = s.replace(
    /\b(vectorEffect|strokeWidth|strokeLinecap|strokeLinejoin|fillRule|clipRule|autoComplete|inputMode|playsInline|srcLang)=/g,
    (_, name: string) =>
      /^(autoComplete|inputMode|playsInline|srcLang)$/.test(name)
        ? `${name.toLowerCase()}=`
        : `${kebab(name)}=`,
  );
  // Style objects: camelCase keys to CSS names; Solid needs no cast.
  s = s.replace(
    /\b(strokeWidth|fontWeight|lineHeight):/g,
    (_, k: string) => `"${kebab(k)}":`,
  );
  s = s.replace(/ as CSSProperties/g, "");

  const left = s.match(
    /\b(useEffect|useRef|useId|useState|className|htmlFor|defaultChecked|defaultValue|CSSProperties|ReactNode|playsInline|from "react")\b/,
  );
  if (left)
    throw new Error(`React-specific "${left[0]}" left after converting`);
  return s;
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const ids = (await readdir(examples, { withFileTypes: true }))
  .filter((e) => e.isDirectory())
  .map((e) => e.name);
for (const id of ids) {
  const source = await readFile(`${examples}${id}/Example.tsx`, "utf8");
  try {
    await writeFile(`${out}${id}.tsx`, toSolid(source));
  } catch (error) {
    throw new Error(`${id}: ${(error as Error).message}`);
  }
}
console.log(`converted ${ids.length} examples to src/examples/`);

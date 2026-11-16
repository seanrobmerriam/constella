/**
 * Reads the shared stylesheets as text at build time, so the Foundations
 * pages list the real tokens, utilities and component stylesheets instead of
 * hand-copied tables that drift. Nothing here loads CSS into the docs shell.
 */
import baseCss from "@constella/shared/styles/base.css?raw";
import utilitiesCss from "@constella/shared/styles/utilities.css?raw";

export interface Block {
  selector: string;
  body: string;
}

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Top-level rule blocks (`selector { body }`), comments removed. */
export function topLevelBlocks(css: string): Block[] {
  const src = stripComments(css);
  const blocks: Block[] = [];
  let depth = 0;
  let start = 0;
  let open = 0;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === "{") {
      if (depth === 0) open = i;
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0) {
        blocks.push({
          selector: src.slice(start, open).trim().replace(/\s+/g, " "),
          body: src.slice(open + 1, i),
        });
        start = i + 1;
      }
    }
  }
  return blocks;
}

/** Custom properties declared directly in a block body, in source order. */
export function declarations(body: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of body.matchAll(/(?:^|[;{\s])(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out.set(m[1], m[2].trim().replace(/\s+/g, " "));
  }
  return out;
}

function findBlock(css: string, selectorStart: string): Block {
  const block = topLevelBlocks(css).find((b) =>
    b.selector.startsWith(selectorStart),
  );
  if (!block) throw new Error(`No block starting with "${selectorStart}"`);
  return block;
}

export interface TokenRow {
  name: string;
  value: string;
  /** Present for fluid tokens: pixel range across the fluid viewport range. */
  fluid?: { min: string; max: string };
}

/** Root design tokens from base.css. */
export function rootTokens(): Map<string, string> {
  return declarations(findBlock(baseCss, ":root").body);
}

/**
 * Tokens whose names match `pattern`. A fluid token (`--x` with `--x-min`
 * and `--x-max`) is reported once, with its range; the -min/-max inputs are
 * folded into it.
 */
export function tokenRows(pattern: RegExp): TokenRow[] {
  const all = rootTokens();
  const rows: TokenRow[] = [];
  for (const [name, value] of all) {
    if (!pattern.test(name)) continue;
    const base = name.replace(/-(min|max)$/, "");
    if (base !== name && all.has(base) && all.get(base)!.startsWith("clamp("))
      continue;
    const min = all.get(`${name}-min`);
    const max = all.get(`${name}-max`);
    if (value.startsWith("clamp(") && min && max) {
      rows.push({ name, value, fluid: { min: `${min}px`, max: `${max}px` } });
    } else {
      rows.push({ name, value });
    }
  }
  return rows;
}

export function viewportRange(): { min: string; max: string } {
  const all = rootTokens();
  return {
    min: `${all.get("--viewport-min")}px`,
    max: `${all.get("--viewport-max")}px`,
  };
}

export const themeNames = ["light", "dark", "brand"] as const;
export type ThemeName = (typeof themeNames)[number];

/** Role tokens per theme, from the three theme blocks in base.css. */
export function themeRoles(): {
  roles: string[];
  values: Record<ThemeName, Map<string, string>>;
} {
  const values = {
    light: declarations(findBlock(baseCss, ":root, .theme-light").body),
    dark: declarations(findBlock(baseCss, ".theme-dark,").body),
    brand: declarations(findBlock(baseCss, ".theme-brand").body),
  };
  return { roles: [...values.light.keys()], values };
}

export interface UtilityGroup {
  title: string;
  /** Class families, e.g. `padding-top-{0, 1, …}`. */
  families: { stem: string; suffixes: string[] }[];
}

/** utilities.css grouped by its `/* Section *\/` comments. */
export function utilityGroups(): UtilityGroup[] {
  const groups: UtilityGroup[] = [];
  const parts = utilitiesCss.split(/^\/\*\s*(.+?)\s*\*\/\s*$/m);
  // parts: [preamble, title1, body1, title2, body2, …]
  const sections: [string, string][] = [["Flex item", parts[0]]];
  for (let i = 1; i < parts.length; i += 2)
    sections.push([parts[i], parts[i + 1]]);
  for (const [title, body] of sections) {
    const names = [
      ...new Set(
        [...stripComments(body).matchAll(/^\s*\.([a-z][\w-]*)/gm)].map(
          (m) => m[1],
        ),
      ),
    ];
    if (names.length === 0) continue;
    const byStem = new Map<string, string[]>();
    for (const name of names) {
      const cut = name.lastIndexOf("-");
      const stem = cut > 0 ? name.slice(0, cut) : name;
      const suffix = cut > 0 ? name.slice(cut + 1) : "";
      byStem.set(stem, [...(byStem.get(stem) ?? []), suffix]);
    }
    groups.push({
      title,
      families: [...byStem].map(([stem, suffixes]) => ({ stem, suffixes })),
    });
  }
  return groups;
}

const sheetSources = import.meta.glob<string>(
  [
    "../../../shared/src/styles/components/*.css",
    "../../../shared/src/styles/controls.css",
  ],
  { query: "?raw", import: "default", eager: true },
);

/**
 * Design tokens read by the given stylesheets (paths relative to
 * `apps/shared/src/styles/`, as in the manifest). Only component files and
 * controls.css are scanned; foundation files style many components at once.
 * A "design token" is any custom property declared in base.css (on :root or
 * in a theme), so private `--_*` values are left out, while a role token a
 * variant redeclares (like `--button-background` in `.secondary`) is kept.
 */
export function tokensReadBy(styles: readonly string[]): string[] {
  const known = new Set([...rootTokens().keys(), ...themeRoles().roles]);
  const tokens = new Set<string>();
  for (const style of styles) {
    const entry = Object.entries(sheetSources).find(([path]) =>
      path.endsWith(`/styles/${style}`),
    );
    if (!entry) continue;
    const css = entry[1].replace(/\/\*[\s\S]*?\*\//g, "");
    for (const m of css.matchAll(/var\((--[\w-]+)/g))
      if (known.has(m[1])) tokens.add(m[1]);
  }
  return [...tokens].sort();
}

/**
 * Plain HTML fixture: what someone gets by following Installation, with no
 * framework and no bundler. Copies dist/constella.css and dist/behaviors/
 * next to one page, and pastes every canonical example.html into it
 * unchanged, scripts included. Run `bun run --cwd apps/shared build` first.
 *
 * Writes tests/fixtures/plain-html/dist/.
 */
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const shared = fileURLToPath(new URL("../../../apps/shared/", import.meta.url));
const out = `${here}dist/`;

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(`${shared}dist/constella.css`, `${out}constella.css`);
await cp(`${shared}dist/behaviors`, `${out}behaviors`, { recursive: true });

const ids = (await readdir(`${shared}src/examples`, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const blocks = await Promise.all(
  ids.map(async (id) => {
    const html = await readFile(
      `${shared}src/examples/${id}/example.html`,
      "utf8",
    );
    return `<div data-example="${id}">\n${html}\n</div>`;
  }),
);

await writeFile(
  `${out}index.html`,
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Plain HTML fixture</title>
    <link rel="stylesheet" href="constella.css" />
    <script type="module">
      import { bootstrapTheme, resolveTheme, THEME_KEY } from "./behaviors/theme.js";
      bootstrapTheme("inherit", resolveTheme, THEME_KEY);
    </script>
  </head>
  <body>
    <button class="button_wrap secondary" type="button" data-theme-toggle aria-pressed="false">
      <span class="button_text text-style-trim">Dark mode</span>
    </button>
    <script type="module">
      import { initThemeToggle } from "./behaviors/theme.js";
      initThemeToggle(document.body);
    </script>
${blocks.join("\n")}
  </body>
</html>
`,
);

console.log(`wrote ${out}index.html with ${ids.length} examples`);

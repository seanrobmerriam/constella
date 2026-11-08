import { build } from "vite";
import { rename, rm, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const tmp = `${root}dist/.tmp`;

// Bundle the shared stylesheet entry (resolving @import and layer order) into one file.
await writeFile(`${root}dist-entry.ts`, 'import "./src/styles/index.css";\n');
await build({
  root,
  logLevel: "warn",
  build: {
    outDir: tmp,
    emptyOutDir: true,
    cssCodeSplit: false,
    cssTarget: "safari15.4",
    lib: { entry: `${root}dist-entry.ts`, formats: ["es"], fileName: "unused" },
  },
});
await mkdir(`${root}dist`, { recursive: true });
await rename(`${tmp}/unused.css`, `${root}dist/constella.css`);
await rm(tmp, { recursive: true, force: true });
await rm(`${root}dist-entry.ts`);
console.log("wrote dist/constella.css");

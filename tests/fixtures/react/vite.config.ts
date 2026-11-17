// React fixture: renders every canonical TSX example against the built
// distributable, the way a React app consumes Constella. `constella/*` points
// at apps/shared/dist (run `bun run --cwd apps/shared build` first).
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const dist = fileURLToPath(
  new URL("../../../apps/shared/dist/", import.meta.url),
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^constella\/behaviors\/(.+)$/,
        replacement: `${dist}behaviors/$1.js`,
      },
      {
        find: /^constella\/constella\.css(\?.*)?$/,
        replacement: `${dist}constella.css$1`,
      },
    ],
  },
  build: { outDir: "dist", emptyOutDir: true },
});

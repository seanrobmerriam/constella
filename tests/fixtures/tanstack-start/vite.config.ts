// TanStack Start fixture: server-renders every canonical TSX example and
// hydrates it, against the built distributable. `constella/*` points at
// apps/shared/dist (run `bun run --cwd apps/shared build` first).
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

const dist = fileURLToPath(
  new URL("../../../apps/shared/dist/", import.meta.url),
);

export default defineConfig({
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
  // React's plugin must come after Start's.
  plugins: [tanstackStart(), viteReact()],
});

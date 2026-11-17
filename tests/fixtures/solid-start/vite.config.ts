// SolidStart fixture: server-renders every canonical example, converted to
// Solid by convert.ts, and hydrates it, against the built distributable.
// `constella/*` points at apps/shared/dist (run
// `bun run --cwd apps/shared build` first).
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";

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
  plugins: [solidStart(), nitro()],
});

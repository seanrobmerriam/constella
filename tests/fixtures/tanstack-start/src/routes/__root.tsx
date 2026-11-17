/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import constellaCss from "constella/constella.css?url";
import {
  bootstrapTheme,
  resolveTheme,
  THEME_KEY,
} from "constella/behaviors/theme";

// The theme script runs before the body is parsed, so the first paint
// already has the visitor's theme. It is the behavior's own function,
// serialized, the way Astro's BaseHead does it.
const themeScript = `(${bootstrapTheme.toString()})("inherit",${resolveTheme.toString()},${JSON.stringify(THEME_KEY)})`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Start fixture" },
    ],
    links: [
      { rel: "stylesheet", href: constellaCss },
      // Without one, the browser asks for /favicon.ico, which isn't a route.
      { rel: "icon", href: "data:," },
    ],
  }),
  shellComponent: RootDocument,
  component: Outlet,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    // The theme script changes <html>'s class before hydration, on purpose.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

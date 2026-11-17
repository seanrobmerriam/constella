// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import {
  bootstrapTheme,
  resolveTheme,
  THEME_KEY,
} from "constella/behaviors/theme";

// The behavior's own function, serialized into an inline script, so the
// visitor's theme is on <html> before the body is parsed.
const themeScript = `(${bootstrapTheme.toString()})("inherit",${resolveTheme.toString()},${JSON.stringify(THEME_KEY)})`;

export default createHandler(() => (
  <StartServer
    document={(props) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>SolidStart fixture</title>
          <link rel="icon" href="data:," />
          <script innerHTML={themeScript} />
          {props.assets}
        </head>
        <body>
          <div id="app">{props.children}</div>
          {props.scripts}
        </body>
      </html>
    )}
  />
));

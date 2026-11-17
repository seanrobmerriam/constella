import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "constella/constella.css";
import {
  bootstrapTheme,
  resolveTheme,
  THEME_KEY,
} from "constella/behaviors/theme";
import { App } from "./App";

// Apply the saved or system theme before React renders anything.
bootstrapTheme("inherit", resolveTheme, THEME_KEY);

// StrictMode mounts every effect twice, so each behavior's cleanup runs
// before it is set up again, as it would on a fast remount.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

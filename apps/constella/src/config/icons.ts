import type { SvgComponent } from "astro/types";
import github from "@/assets/icons/github.svg";
import linkedin from "@/assets/icons/linkedin.svg";

/**
 * Icon registry for configured links. Add an entry here (and the SVG in
 * `src/assets/icons`) to support another key.
 */
export const icons: Record<string, SvgComponent> = { github, linkedin };

export function iconFor(key: string): SvgComponent {
  const icon = icons[key];
  if (!icon) {
    throw new Error(
      `[constella] Unknown icon "${key}". Known icons: ${Object.keys(icons).join(", ")}. Register it in src/config/icons.ts.`,
    );
  }
  return icon;
}

import type { ExampleDefinition } from "./types.ts";
import buttonHtml from "./button/example.html?raw";
import buttonTsx from "./button/Example.tsx?raw";
import inputWrapperHtml from "./input-wrapper/example.html?raw";
import inputWrapperTsx from "./input-wrapper/Example.tsx?raw";
import detailsHtml from "./details/example.html?raw";
import detailsTsx from "./details/Example.tsx?raw";
import accordionHtml from "./accordion/example.html?raw";
import accordionTsx from "./accordion/Example.tsx?raw";
import navbarHtml from "./navbar/example.html?raw";
import navbarTsx from "./navbar/Example.tsx?raw";
import footerHtml from "./footer/example.html?raw";
import footerTsx from "./footer/Example.tsx?raw";

/**
 * The closed registry. Only these entries can be previewed; the preview route
 * never renders caller-supplied markup or URLs.
 */
export const examples: readonly ExampleDefinition[] = [
  {
    id: "button",
    title: "Button",
    description:
      "Primary, secondary and link buttons, with opt-in size and radius.",
    html: buttonHtml,
    tsx: buttonTsx,
    previewHeight: 10,
  },
  {
    id: "input-wrapper",
    title: "InputWrapper",
    description:
      "A labeled field beside a button; the wrapper handles wrapping.",
    html: inputWrapperHtml,
    tsx: inputWrapperTsx,
    previewHeight: 10,
  },
  {
    id: "details",
    title: "Details",
    description: "A standalone native disclosure. No script needed.",
    html: detailsHtml,
    tsx: detailsTsx,
    previewHeight: 12,
  },
  {
    id: "accordion",
    title: "Accordion",
    description:
      "Details grouped so one opens at a time. Needs the accordion behavior.",
    html: accordionHtml,
    tsx: accordionTsx,
    behaviorEntry: "accordion",
    previewHeight: 22,
  },
  {
    id: "navbar",
    title: "Navbar",
    description:
      "A responsive navbar. Needs the navbar behavior for the mobile menu.",
    html: navbarHtml,
    tsx: navbarTsx,
    behaviorEntry: "navbar",
    previewHeight: 22,
  },
  {
    id: "footer",
    title: "Footer",
    description: "The simple footer variant with legal links.",
    html: footerHtml,
    tsx: footerTsx,
    previewHeight: 18,
  },
];

export function getExample(id: string): ExampleDefinition | undefined {
  return examples.find((example) => example.id === id);
}

export type { ExampleDefinition };

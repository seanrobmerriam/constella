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
import sectionHtml from "./section/example.html?raw";
import sectionTsx from "./section/Example.tsx?raw";
import contentWrapperHtml from "./content-wrapper/example.html?raw";
import contentWrapperTsx from "./content-wrapper/Example.tsx?raw";
import gridHtml from "./grid/example.html?raw";
import gridTsx from "./grid/Example.tsx?raw";
import headingHtml from "./heading/example.html?raw";
import headingTsx from "./heading/Example.tsx?raw";
import paragraphHtml from "./paragraph/example.html?raw";
import paragraphTsx from "./paragraph/Example.tsx?raw";
import richTextHtml from "./rich-text/example.html?raw";
import richTextTsx from "./rich-text/Example.tsx?raw";

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
  {
    id: "section",
    title: "Section",
    description:
      "A dark, centered section with small padding: theme, spacing and alignment from classes.",
    html: sectionHtml,
    tsx: sectionTsx,
    previewHeight: 22,
  },
  {
    id: "content-wrapper",
    title: "ContentWrapper",
    description: "Text beside a visual. Two columns from 64rem; stacked below.",
    html: contentWrapperHtml,
    tsx: contentWrapperTsx,
    previewHeight: 44,
  },
  {
    id: "grid",
    title: "Grid",
    description:
      "A breakpoint grid (1, 2, then 3 columns) and an auto-fit grid.",
    html: gridHtml,
    tsx: gridTsx,
    previewHeight: 18,
  },
  {
    id: "heading",
    title: "Heading",
    description:
      "Eyebrows above headings, a level styled smaller, and a line-length limit.",
    html: headingHtml,
    tsx: headingTsx,
    previewHeight: 28,
  },
  {
    id: "paragraph",
    title: "Paragraph",
    description:
      "Large, main and small paragraphs, one with a line-length limit.",
    html: paragraphHtml,
    tsx: paragraphTsx,
    previewHeight: 18,
  },
  {
    id: "rich-text",
    title: "RichText",
    description: "Unclassed HTML (headings, lists, a quote) styled as prose.",
    html: richTextHtml,
    tsx: richTextTsx,
    previewHeight: 34,
  },
];

export function getExample(id: string): ExampleDefinition | undefined {
  return examples.find((example) => example.id === id);
}

export type { ExampleDefinition };

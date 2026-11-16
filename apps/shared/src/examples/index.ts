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
import imgHtml from "./img/example.html?raw";
import imgTsx from "./img/Example.tsx?raw";
import videoHtml from "./video/example.html?raw";
import videoTsx from "./video/Example.tsx?raw";
import iconHtml from "./icon/example.html?raw";
import iconTsx from "./icon/Example.tsx?raw";
import overlayHtml from "./overlay/example.html?raw";
import overlayTsx from "./overlay/Example.tsx?raw";
import cardHtml from "./card/example.html?raw";
import cardTsx from "./card/Example.tsx?raw";
import formHtml from "./form/example.html?raw";
import formTsx from "./form/Example.tsx?raw";
import fieldsetHtml from "./fieldset/example.html?raw";
import fieldsetTsx from "./fieldset/Example.tsx?raw";
import inputHtml from "./input/example.html?raw";
import inputTsx from "./input/Example.tsx?raw";
import textareaHtml from "./textarea/example.html?raw";
import textareaTsx from "./textarea/Example.tsx?raw";
import selectHtml from "./select/example.html?raw";
import selectTsx from "./select/Example.tsx?raw";
import choiceHtml from "./choice/example.html?raw";
import choiceTsx from "./choice/Example.tsx?raw";
import rangeHtml from "./range/example.html?raw";
import rangeTsx from "./range/Example.tsx?raw";
import skipHtml from "./skip/example.html?raw";
import skipTsx from "./skip/Example.tsx?raw";
import dropdownHtml from "./dropdown/example.html?raw";
import dropdownTsx from "./dropdown/Example.tsx?raw";

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
  {
    id: "img",
    title: "Img",
    description:
      "Images with the skeleton tint, and a transparent logo that is never cropped.",
    html: imgHtml,
    tsx: imgTsx,
    previewHeight: 14,
  },
  {
    id: "video",
    title: "Video",
    description:
      "A click-to-play video with a poster, captions and a fixed 16:9 ratio.",
    html: videoHtml,
    tsx: videoTsx,
    previewHeight: 24,
  },
  {
    id: "icon",
    title: "Icon",
    description:
      "Inline SVG icons at the three sizes, and an icon inside a button.",
    html: iconHtml,
    tsx: iconTsx,
    previewHeight: 8,
  },
  {
    id: "overlay",
    title: "Overlay",
    description:
      "A gradient overlay over a background image, keeping text readable.",
    html: overlayHtml,
    tsx: overlayTsx,
    previewHeight: 16,
  },
  {
    id: "card",
    title: "Card",
    description:
      "Default, cover and stacked cards in a grid. Each is clickable as a whole.",
    html: cardHtml,
    tsx: cardTsx,
    previewHeight: 51,
  },
  {
    id: "form",
    title: "Form",
    description:
      "A contact form that submits without leaving the page. The preview has no endpoint, so it shows the error note.",
    html: formHtml,
    tsx: formTsx,
    behaviorEntry: "form",
    previewHeight: 50,
  },
  {
    id: "fieldset",
    title: "Fieldset",
    description:
      "Two-column name fields, and an inline radio group with a label-style legend.",
    html: fieldsetHtml,
    tsx: fieldsetTsx,
    previewHeight: 22,
  },
  {
    id: "input",
    title: "Input",
    description:
      "Required email, an autofilling first name, and a small, round search with a hidden label.",
    html: inputHtml,
    tsx: inputTsx,
    previewHeight: 20,
  },
  {
    id: "textarea",
    title: "Textarea",
    description:
      "A message field that grows with its content between three and eight lines.",
    html: textareaHtml,
    tsx: textareaTsx,
    previewHeight: 14,
  },
  {
    id: "select",
    title: "Select",
    description: "A required native select with a prompt and a custom arrow.",
    html: selectHtml,
    tsx: selectTsx,
    previewHeight: 10,
  },
  {
    id: "choice",
    title: "Choice",
    description: "A checkbox, a toggle and a pair of radio chips.",
    html: choiceHtml,
    tsx: choiceTsx,
    previewHeight: 14,
  },
  {
    id: "range",
    title: "Range",
    description:
      "A slider with its value shown above the handle. Needs the range behavior.",
    html: rangeHtml,
    tsx: rangeTsx,
    behaviorEntry: "range",
    previewHeight: 10,
  },
  {
    id: "skip",
    title: "Skip",
    description:
      "A skip link, hidden until focused. Click into the preview and press Tab.",
    html: skipHtml,
    tsx: skipTsx,
    previewHeight: 12,
  },
  {
    id: "dropdown",
    title: "Dropdown",
    description:
      "A disclosure panel of links beside a button. Needs the dropdown behavior for Escape, arrow keys and outside clicks.",
    html: dropdownHtml,
    tsx: dropdownTsx,
    behaviorEntry: "dropdown",
    previewHeight: 18,
  },
];

export function getExample(id: string): ExampleDefinition | undefined {
  return examples.find((example) => example.id === id);
}

export type { ExampleDefinition };

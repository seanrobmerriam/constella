/**
 * The single list of Constella components.
 *
 * Every Astro file in `apps/constella/src/components/` belongs to exactly one
 * entry. `bun run check:docs` (scripts/check-docs.ts) verifies this list
 * against the source tree, the stylesheet entry, the example registry and the
 * docs pages; the docs build reads it for the "which file styles which
 * component" table. Data only: no imports, no framework code.
 *
 * Adding or changing a component? Follow the procedure in
 * docs/completion-plan.md §2 and update the entry here in the same change.
 */

export type ComponentStatus =
  /** Public, with an example and a docs page. */
  | "documented"
  /** Public, docs page not written yet (completion-plan Phase 3). */
  | "planned"
  /** Astro integration utility with no HTML/CSS equivalent. */
  | "astro-only";

export interface ComponentEntry {
  /** Stable id: the docs slug (`components/<id>`) and example id. */
  id: string;
  /** Public name, as used in Astro and the docs. */
  name: string;
  status: ComponentStatus;
  /** Astro files, relative to `apps/constella/src/components/`. Parts that
   * are only used inside this component (NavLink, Summary, TabLink) are
   * listed here too, so they are documented on the parent's page. */
  astro: string[];
  /** Root class(es) a consumer writes in HTML. Empty for astro-only. */
  root: string;
  /** Stylesheets, relative to `apps/shared/src/styles/`. */
  styles: string[];
  /** Behavior modules in `apps/shared/src/behaviors/` this component needs. */
  behaviors?: string[];
  /** Example registry id. Required when documented. */
  example?: string;
  /** Docs slug under `apps/docs/src/content/docs/`. Required when documented. */
  docs?: string;
}

const documented = (
  id: string,
  rest: Omit<ComponentEntry, "id" | "status" | "example" | "docs">,
): ComponentEntry => ({
  id,
  status: "documented",
  example: id,
  docs: `components/${id}`,
  ...rest,
});

const planned = (
  id: string,
  rest: Omit<ComponentEntry, "id" | "status">,
): ComponentEntry => ({ id, status: "planned", ...rest });

export const components: readonly ComponentEntry[] = [
  // Layout
  documented("section", {
    name: "Section",
    astro: ["wrapper/Section.astro"],
    root: ".section, .container",
    styles: ["patterns.css"],
  }),
  documented("content-wrapper", {
    name: "ContentWrapper",
    astro: ["wrapper/ContentWrapper.astro"],
    root: ".layout",
    styles: ["components/content-wrapper.css"],
  }),
  documented("grid", {
    name: "Grid",
    astro: ["wrapper/Grid.astro"],
    root: ".grid",
    styles: ["components/grid.css"],
  }),
  documented("input-wrapper", {
    name: "InputWrapper",
    astro: ["wrapper/InputWrapper.astro"],
    root: ".input-wrapper",
    styles: ["patterns.css"],
  }),

  // Typography
  documented("heading", {
    name: "Heading",
    astro: ["typography/Heading.astro"],
    root: ".heading",
    styles: ["components/heading.css", "patterns.css", "base.css"],
  }),
  documented("paragraph", {
    name: "Paragraph",
    astro: ["typography/Paragraph.astro"],
    root: ".text",
    styles: ["patterns.css", "base.css"],
  }),
  documented("rich-text", {
    name: "RichText",
    astro: ["typography/RichText.astro"],
    root: ".rich-text",
    styles: ["components/rich-text.css"],
  }),

  // Actions
  documented("button", {
    name: "Button",
    astro: ["Button.astro"],
    root: ".button_wrap",
    styles: ["components/button.css", "controls.css"],
  }),

  // Media
  documented("img", {
    name: "Img",
    astro: ["media/Img.astro"],
    root: ".image",
    styles: ["patterns.css"],
  }),
  documented("video", {
    name: "Video",
    astro: ["media/Video.astro"],
    root: ".video",
    styles: ["patterns.css"],
  }),
  documented("icon", {
    name: "Icon",
    astro: ["media/Icon.astro"],
    root: ".icon",
    styles: ["components/icon.css"],
  }),
  documented("overlay", {
    name: "Overlay",
    astro: ["media/Overlay.astro"],
    root: ".overlay",
    styles: ["components/overlay.css"],
  }),

  // Content
  documented("card", {
    name: "Card",
    astro: ["item/Card.astro"],
    root: ".card_wrap",
    styles: ["components/card.css"],
  }),

  // Forms
  planned("form", {
    name: "Form",
    astro: ["form/Form.astro"],
    root: ".form_wrap",
    styles: ["components/form.css"],
  }),
  planned("fieldset", {
    name: "Fieldset",
    astro: ["form/Fieldset.astro"],
    root: ".form-fieldset",
    styles: ["components/fieldset.css"],
  }),
  planned("input", {
    name: "Input",
    astro: ["form/Input.astro"],
    root: ".field.form-input",
    styles: ["patterns.css", "controls.css"],
  }),
  planned("textarea", {
    name: "Textarea",
    astro: ["form/Textarea.astro"],
    root: ".field.form-textarea",
    styles: ["components/textarea.css", "patterns.css", "controls.css"],
  }),
  planned("select", {
    name: "Select",
    astro: ["form/Select.astro"],
    root: ".field.form-select",
    styles: ["components/select.css", "patterns.css", "controls.css"],
  }),
  planned("choice", {
    name: "Choice",
    astro: ["form/Choice.astro"],
    root: ".form-choice",
    styles: ["components/choice.css"],
  }),
  planned("range", {
    name: "Range",
    astro: ["form/Range.astro"],
    root: ".field.form-range",
    styles: ["components/range.css", "patterns.css"],
  }),

  // Global
  documented("navbar", {
    name: "Navbar",
    astro: ["global/Navbar.astro", "global/NavLink.astro"],
    root: ".nav_wrap",
    styles: ["components/navbar.css"],
    behaviors: ["navbar", "theme"],
  }),
  documented("footer", {
    name: "Footer",
    astro: ["global/Footer.astro"],
    root: ".footer_wrap",
    styles: ["components/footer.css"],
  }),
  planned("skip", {
    name: "Skip",
    astro: ["global/Skip.astro"],
    root: ".skip-link",
    styles: ["components/skip.css"],
  }),

  // Disclosure
  documented("details", {
    name: "Details",
    astro: ["interactive/Details.astro", "interactive/Summary.astro"],
    root: ".details_wrap",
    styles: ["components/details.css"],
  }),
  documented("accordion", {
    name: "Accordion",
    astro: ["interactive/Accordion.astro"],
    root: ".accordion_wrap",
    styles: ["components/details.css"],
    behaviors: ["accordion"],
  }),
  planned("dropdown", {
    name: "Dropdown",
    astro: ["interactive/Dropdown.astro"],
    root: ".dropdown_wrap",
    styles: ["components/dropdown.css", "controls.css"],
  }),

  // Interactive
  planned("modal", {
    name: "Modal",
    astro: ["interactive/Modal.astro"],
    root: ".modal_wrap",
    styles: ["components/modal.css"],
  }),
  planned("tabs", {
    name: "Tabs",
    astro: ["interactive/Tabs.astro", "interactive/TabLink.astro"],
    root: ".tabs_wrap",
    styles: ["components/tabs.css"],
  }),
  planned("slider", {
    name: "Slider",
    astro: ["interactive/Slider.astro"],
    root: ".slider_wrap",
    styles: ["components/slider.css"],
  }),
  planned("marquee", {
    name: "Marquee",
    astro: ["interactive/Marquee.astro"],
    root: ".marquee_wrap",
    styles: ["components/marquee.css"],
  }),

  // Astro integration utilities (documented together in Phase 3, batch 3.11)
  {
    id: "base-head",
    name: "BaseHead",
    status: "astro-only",
    astro: ["utility/BaseHead.astro"],
    root: "",
    styles: [],
  },
  {
    id: "formatted-date",
    name: "FormattedDate",
    status: "astro-only",
    astro: ["utility/FormattedDate.astro"],
    root: "",
    styles: [],
  },
];

/** Section headings every documented component page has, in this order. */
export const requiredDocsSections = [
  "Example",
  "Markup",
  "Variants and props",
  "States",
  "Accessibility",
  "Behavior",
  "Tokens",
  "Related",
] as const;

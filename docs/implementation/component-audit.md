# Component audit (Task 2)

Source: `apps/constella/src/components` (35 `.astro` files). "Shared CSS" means the component's `<style is:global>` block was moved to `apps/shared/src/styles/components/<name>.css`. Rows marked "none/scoped" have no global block; styles are either absent, inline in a template `<style>`, or come from patterns/utilities. No stylesheet uses `url()`, so no assets need processing.

| Component                       | Styles      | Scripts | Native elements |
| ------------------------------- | ----------- | ------- | --------------- |
| Button.astro                    | shared css  | 0       |                 |
| form/Choice.astro               | shared css  | 0       | input           |
| form/Fieldset.astro             | shared css  | 0       |                 |
| form/Form.astro                 | shared css  | 1       | form            |
| form/Input.astro                | none/scoped | 0       | input           |
| form/Range.astro                | shared css  | 1       | input           |
| form/Select.astro               | shared css  | 0       | select          |
| form/Textarea.astro             | shared css  | 0       |                 |
| global/Footer.astro             | shared css  | 1       | footer nav      |
| global/Nav.astro                | shared css  | 1       | button nav      |
| global/NavLink.astro            | none/scoped | 0       |                 |
| global/SkipLink.astro           | shared css  | 0       |                 |
| interactive/Accordion.astro     | shared css  | 1       |                 |
| interactive/AccordionItem.astro | shared css  | 0       | details         |
| interactive/Dropdown.astro      | shared css  | 1       | details         |
| interactive/Marquee.astro       | shared css  | 1       |                 |
| interactive/Modal.astro         | shared css  | 1       | dialog          |
| interactive/Slider.astro        | shared css  | 1       |                 |
| interactive/TabLink.astro       | none/scoped | 0       | button          |
| interactive/Tabs.astro          | shared css  | 1       |                 |
| item/Card.astro                 | shared css  | 0       | button          |
| media/Icon.astro                | shared css  | 0       |                 |
| media/Img.astro                 | none/scoped | 0       |                 |
| media/Overlay.astro             | shared css  | 0       |                 |
| media/Video.astro               | none/scoped | 0       |                 |
| typography/Eyebrow.astro        | shared css  | 0       |                 |
| typography/Heading.astro        | none/scoped | 0       |                 |
| typography/Paragraph.astro      | none/scoped | 0       |                 |
| typography/RichText.astro       | shared css  | 0       |                 |
| utility/BaseHead.astro          | none/scoped | 0       |                 |
| utility/FormattedDate.astro     | none/scoped | 0       |                 |
| wrapper/ButtonWrapper.astro     | none/scoped | 0       |                 |
| wrapper/ContentWrapper.astro    | shared css  | 0       |                 |
| wrapper/Grid.astro              | shared css  | 0       |                 |
| wrapper/Section.astro           | none/scoped | 0       |                 |

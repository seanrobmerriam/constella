/**
 * Optional progressive enhancement for an accordion root
 * (`[data-accordion]`). Native `<details>` works without it; this adds
 * single-open grouping, `openFirst`, and design-mode preview.
 *
 * Data attributes on the root: `data-single` (default behaviour is single
 * unless it is "false"), `data-open-first`, `data-group` (explicit group
 * name), `data-preview`.
 */
let counter = 0;

const isDetails = (el: Element): el is HTMLDetailsElement =>
  el.tagName === "DETAILS";

/** Items owned by this root: nearest `details`/accordion ancestor is the root. */
export function ownedItems(root: HTMLElement): HTMLDetailsElement[] {
  return [...root.querySelectorAll<HTMLDetailsElement>("details")].filter(
    (item) => item.parentElement?.closest("details, [data-accordion]") === root,
  );
}

function uniqueGroup(): string {
  let name: string;
  do name = `accordion-${++counter}`;
  while (document.querySelector(`[name="${name}"]`));
  return name;
}

export function initAccordion(root: HTMLElement): () => void {
  const items = ownedItems(root);
  const single = root.dataset.single !== "false";
  const group = root.dataset.group || (single ? uniqueGroup() : "");
  const added: HTMLDetailsElement[] = [];

  if (single && group) {
    for (const item of items) {
      if (!item.hasAttribute("name")) {
        item.setAttribute("name", group);
        added.push(item);
      }
    }
  }

  // Precedence: openFirst opens the first owned item and closes the rest;
  // otherwise a single group keeps only its first initially-open item.
  if (root.hasAttribute("data-open-first") && items.length) {
    items.forEach((item, i) => (item.open = i === 0));
  } else if (single) {
    let seen = false;
    for (const item of items) {
      if (item.open && seen) item.open = false;
      if (item.open) seen = true;
    }
  }

  const removed = new Map<HTMLDetailsElement, string>();
  const sync = () => {
    const designing =
      document.documentElement.classList.contains("stacki-designer");
    const preview = designing && root.hasAttribute("data-preview");
    for (const item of ownedItems(root)) {
      if (preview && item.hasAttribute("name")) {
        removed.set(item, item.getAttribute("name")!);
        item.removeAttribute("name");
      } else if (!preview && removed.has(item)) {
        item.setAttribute("name", removed.get(item)!);
        removed.delete(item);
      }
      if (preview || item.classList.contains("stacki-opened")) item.open = true;
    }
  };
  sync();

  const observer = new MutationObserver(sync);
  const settings = { attributes: true, attributeFilter: ["class"] };
  observer.observe(document.documentElement, settings);
  observer.observe(root, { ...settings, subtree: true });

  return () => {
    observer.disconnect();
    for (const [item, name] of removed) item.setAttribute("name", name);
    for (const item of added) if (isDetails(item)) item.removeAttribute("name");
  };
}

/**
 * Keyboard and dismissal for one `details.dropdown_wrap`. Returns cleanup.
 *
 * Opening and closing are the native `<details>` toggle, so the dropdown
 * works without this script. The script adds:
 *
 * - Escape closes this dropdown and returns focus to its toggle, but only
 *   while focus is inside it. Escape pressed elsewhere on the page is left
 *   alone.
 * - ArrowDown and ArrowUp move focus through the links and enabled buttons
 *   in the panel, wrapping at the ends.
 * - A click outside the dropdown closes it.
 */
export function initDropdown(root: HTMLDetailsElement): () => void {
  const summary = root.querySelector<HTMLElement>(".dropdown_toggle");
  const content = root.querySelector<HTMLElement>(".dropdown_content");
  if (!summary || !content) return () => {};

  const onKey = (event: KeyboardEvent) => {
    if (!root.open || !root.contains(document.activeElement)) return;

    if (event.key === "Escape") {
      root.open = false;
      summary.focus();
      return;
    }

    const forward = event.key === "ArrowDown";
    if (!forward && event.key !== "ArrowUp") return;

    const items = [
      ...content.querySelectorAll<HTMLElement>(
        "a[href], button:not(:disabled)",
      ),
    ];
    if (items.length === 0) return;

    event.preventDefault();
    const from = items.indexOf(document.activeElement as HTMLElement);
    const next =
      from === -1
        ? forward
          ? 0
          : items.length - 1
        : (from + (forward ? 1 : -1) + items.length) % items.length;
    items[next].focus();
  };

  const onClick = (event: MouseEvent) => {
    const target = event.target;
    if (root.open && target instanceof Node && !root.contains(target))
      root.open = false;
  };

  document.addEventListener("keydown", onKey);
  document.addEventListener("click", onClick);
  return () => {
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("click", onClick);
  };
}

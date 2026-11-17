/**
 * Dismissing one `.alert_wrap` root. Returns cleanup.
 *
 * Markup: a `[data-alert-dismiss]` button inside the alert. The stylesheet
 * hides that button until this runs (`.is-ready`), because without the
 * script it would do nothing.
 *
 * - Clicking it hides the alert (`hidden`) and fires a bubbling
 *   `alert-dismiss` event on it.
 * - Focus was on the button, which is now hidden, so it moves to the next
 *   focusable element after the alert, or to `<main tabindex="-1">` when
 *   there is none, instead of being lost.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), summary';

function nextFocusable(root: HTMLElement): HTMLElement | null {
  for (const el of document.querySelectorAll<HTMLElement>(FOCUSABLE)) {
    if (root.contains(el)) continue;
    if (!(root.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING))
      continue;
    if (el.closest("[hidden], [inert]") || !el.getClientRects().length)
      continue;
    return el;
  }
  return document.querySelector<HTMLElement>("main[tabindex]");
}

export function initAlert(root: HTMLElement): () => void {
  const button = root.querySelector<HTMLButtonElement>("[data-alert-dismiss]");
  if (!button) return () => {};

  const dismiss = () => {
    const hadFocus = root.contains(document.activeElement);
    const next = hadFocus ? nextFocusable(root) : null;
    root.hidden = true;
    next?.focus();
    root.dispatchEvent(new CustomEvent("alert-dismiss", { bubbles: true }));
  };

  button.addEventListener("click", dismiss);
  root.classList.add("is-ready");

  return () => {
    button.removeEventListener("click", dismiss);
    root.classList.remove("is-ready");
  };
}

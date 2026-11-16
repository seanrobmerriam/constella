/**
 * Opening, closing and focus for one `dialog.modal_wrap`. Returns cleanup.
 *
 * The dialog is native: `showModal()` gives the backdrop, makes the rest of
 * the page inert so focus stays inside, and closes on Escape. This adds:
 *
 * - Triggers: any `[data-modal-open="<id>"]` or `a[href="#<id>"]` on the page
 *   opens it. The link's own navigation is cancelled.
 * - Closing: any `[data-modal-close]` inside it, and a click that both starts
 *   and ends on the backdrop. A drag that starts inside and ends outside, as
 *   when selecting text, doesn't close it.
 * - `?modal=<id>` in the page URL opens it on load, then is removed from the
 *   address bar.
 * - Focus returns to the element that opened it.
 * - `modal-open` and `modal-close` events, which bubble from the dialog.
 *
 * Without this script, nothing opens the dialog.
 */
export function initModal(root: HTMLDialogElement): () => void {
  const scroll = root.querySelector<HTMLElement>("[data-modal-scroll]");
  let opener: HTMLElement | null = null;
  let fromBackdrop = false;

  const open = () => {
    if (root.open) return;
    opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    if (scroll) scroll.scrollTop = 0;
    root.showModal();
    root.dispatchEvent(new CustomEvent("modal-open", { bubbles: true }));
  };

  const onClose = () => {
    // Browsers that restore focus themselves have already done so; otherwise
    // focus is left on the body, and the opener gets it back here.
    const lost =
      !document.activeElement ||
      document.activeElement === document.body ||
      root.contains(document.activeElement);
    if (lost && opener?.isConnected) opener.focus();
    opener = null;
    root.dispatchEvent(new CustomEvent("modal-close", { bubbles: true }));
  };

  const onMouseDown = (event: MouseEvent) => {
    fromBackdrop = event.target === root;
  };

  const onDialogClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest("[data-modal-close]")) root.close();
    else if (fromBackdrop && target === root) root.close();
    fromBackdrop = false;
  };

  const onDocumentClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element) || !root.id) return;
    const id = CSS.escape(root.id);
    const trigger = target.closest(
      `[data-modal-open="${id}"], a[href="#${id}"]`,
    );
    if (!trigger) return;
    event.preventDefault();
    open();
  };

  root.addEventListener("close", onClose);
  root.addEventListener("mousedown", onMouseDown);
  root.addEventListener("click", onDialogClick);
  document.addEventListener("click", onDocumentClick);

  const url = new URL(location.href);
  if (root.id && url.searchParams.get("modal") === root.id) {
    open();
    url.searchParams.delete("modal");
    history.replaceState(history.state, "", url);
  }

  return () => {
    root.removeEventListener("close", onClose);
    root.removeEventListener("mousedown", onMouseDown);
    root.removeEventListener("click", onDialogClick);
    document.removeEventListener("click", onDocumentClick);
  };
}

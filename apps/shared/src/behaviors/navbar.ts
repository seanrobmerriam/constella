/** Mobile menu behavior for one `[data-navbar]` root. Returns cleanup. */
export function initNavbar(root: HTMLElement): () => void {
  const toggle = root.querySelector<HTMLButtonElement>("[data-navbar-toggle]");
  if (!toggle) return () => {};
  const menu = root.querySelector<HTMLElement>("[data-navbar-menu]");

  const setOpen = (open: boolean) => {
    root.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  const isOpen = () => root.classList.contains("open");

  const onToggle = () => setOpen(!isOpen());
  const onLink = () => setOpen(false);
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  };
  const onDocClick = (event: MouseEvent) => {
    const target = event.target;
    if (isOpen() && target instanceof Node && !root.contains(target))
      setOpen(false);
  };
  const media = matchMedia("(width >= 48rem)");
  const onMedia = (event: MediaQueryListEvent) => {
    if (event.matches) setOpen(false);
  };

  const links = [...(menu ?? root).querySelectorAll("a")];
  toggle.addEventListener("click", onToggle);
  for (const link of links) link.addEventListener("click", onLink);
  document.addEventListener("keydown", onKey);
  document.addEventListener("click", onDocClick);
  media.addEventListener("change", onMedia);

  return () => {
    toggle.removeEventListener("click", onToggle);
    for (const link of links) link.removeEventListener("click", onLink);
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("click", onDocClick);
    media.removeEventListener("change", onMedia);
    setOpen(false);
  };
}

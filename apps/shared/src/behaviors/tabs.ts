/**
 * Tab selection, keyboard, deep links and optional auto-rotation for one
 * `.tabs_wrap` root. Returns cleanup.
 *
 * Markup: `.tabs_links` holding one `button.tabs_link` per panel, and
 * `.tabs_panels` holding the panels in the same order. The script gives
 * them their roles and IDs (`tab`, `tabpanel`, `aria-controls`,
 * `aria-labelledby`), so the HTML stays plain.
 *
 * - Click, or ArrowRight/ArrowDown and ArrowLeft/ArrowUp (wrapping), Home and
 *   End, select a tab. Only the selected tab is in the tab order.
 * - The selected tab is kept in the URL as `?<root id or "tab">=<tab slug>`
 *   and restored on load, so a tab can be linked to.
 * - With `.auto`, tabs advance every 6 seconds. Rotation pauses while the
 *   tabs have focus, are offscreen, or the visitor prefers reduced motion,
 *   and stays paused once the visitor presses pause or opens the page on a
 *   specific tab, until they press it again. The button reflects that
 *   choice, not the passing holds.
 */
export function initTabs(root: HTMLElement): () => void {
  const INTERVAL = 6000;
  const SLIDE = 500;

  const links = [...root.querySelectorAll<HTMLButtonElement>(".tabs_link")];
  const panelList = root.querySelector<HTMLElement>(".tabs_panels");
  const panels = [...(panelList?.children ?? [])] as HTMLElement[];
  if (links.length === 0 || links.length !== panels.length) return () => {};

  const cleanups: (() => void)[] = [];
  const listen = <K extends keyof HTMLElementEventMap>(
    target: HTMLElement,
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void,
  ) => {
    target.addEventListener(type, handler);
    cleanups.push(() => target.removeEventListener(type, handler));
  };

  const uid = Math.random().toString(36).slice(2, 8);
  const auto = root.classList.contains("auto");
  const toggle = root.querySelector<HTMLButtonElement>("[data-toggle]");
  const bar = root.querySelector<HTMLElement>(".tabs_links");
  const leaveTimers = new Set<number>();

  const keepInView = (link: HTMLElement) => {
    if (!bar) return;
    const list = bar.getBoundingClientRect();
    const box = link.getBoundingClientRect();
    if (box.left < list.left) bar.scrollBy({ left: box.left - list.left });
    else if (box.right > list.right)
      bar.scrollBy({ left: box.right - list.right });
  };

  let current = 0;
  let timer: number | undefined;
  let paused = false;

  const key = root.id || "tab";
  const slugs = links.map((link) =>
    (link.textContent ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
  );

  const remember = (index: number) => {
    const url = new URL(location.href);
    url.searchParams.set(key, slugs[index]);
    history.replaceState(history.state, "", url);
  };

  links.forEach((link, i) => {
    link.id = `tab-${uid}-${i}`;
    link.setAttribute("role", "tab");
    link.setAttribute("aria-controls", `panel-${uid}-${i}`);
    panels[i].id = `panel-${uid}-${i}`;
    panels[i].setAttribute("role", "tabpanel");
    panels[i].setAttribute("aria-labelledby", link.id);
    panels[i].tabIndex = 0;
  });

  const restart = () => {
    window.clearTimeout(timer);
    if (!auto || paused) return;
    root.classList.remove("running");
    void root.offsetWidth; // restart the progress animation
    root.classList.add("running");
    timer = window.setTimeout(() => show(current + 1, false, false), INTERVAL);
  };

  const show = (next: number, focus = false, share = true) => {
    const index = (next + links.length) % links.length;
    if (index !== current) {
      root.style.setProperty("--_dir", next > current ? "1" : "-1");
      root.dataset.moved = "";
      const leaving = panels[current];
      leaving.classList.add("is-leaving");
      const t = window.setTimeout(() => {
        leaving.classList.remove("is-leaving");
        leaveTimers.delete(t);
      }, SLIDE + 50);
      leaveTimers.add(t);
    }

    links.forEach((link, i) => {
      link.classList.toggle("is-active", i === index);
      link.setAttribute("aria-selected", String(i === index));
      link.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach((panel, i) =>
      panel.classList.toggle("is-active", i === index),
    );

    current = index;
    if (share) remember(index);
    if (focus) links[index].focus();
    keepInView(links[index]);
    restart();
  };

  links.forEach((link, i) => {
    listen(link, "click", () => show(i));
    listen(link, "keydown", (event) => {
      const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
      const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        show(event.key === "Home" ? 0 : links.length - 1, true);
        return;
      }
      if (!forward && !back) return;
      event.preventDefault();
      show(current + (forward ? 1 : -1), true);
    });
  });

  for (const step of root.querySelectorAll<HTMLButtonElement>("[data-step]"))
    listen(step, "click", () => show(current + Number(step.dataset.step)));

  const setPaused = (value: boolean) => {
    paused = value;
    root.classList.toggle("is-paused", value);
    restart();
  };

  root.classList.add("is-ready");

  const wanted = slugs.indexOf(
    new URLSearchParams(location.search).get(key) ?? "",
  );
  show(wanted === -1 ? 0 : wanted, false, false);
  if (wanted !== -1) root.scrollIntoView({ block: "nearest" });

  if (auto) {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Every reason to hold rotation. `chosen` is the visitor's own pause, set
    // by the toggle and by opening the page on a specific tab; the others come
    // and go. The toggle shows and flips only `chosen`, so pressing pause
    // holds even after focus leaves, and focus alone never flips the button.
    const holds = {
      chosen: wanted !== -1,
      motion: motion.matches,
      focus: false,
      offscreen: false,
    };
    const settle = () => {
      toggle?.setAttribute("aria-pressed", String(!holds.chosen));
      toggle?.setAttribute(
        "aria-label",
        holds.chosen ? "Start automatic rotation" : "Pause automatic rotation",
      );
      setPaused(Object.values(holds).some(Boolean));
    };

    if (toggle)
      listen(toggle, "click", () => {
        holds.chosen = !holds.chosen;
        settle();
      });

    const onMotion = (event: MediaQueryListEvent) => {
      holds.motion = event.matches;
      settle();
    };
    motion.addEventListener("change", onMotion);
    cleanups.push(() => motion.removeEventListener("change", onMotion));

    listen(root, "focusin", () => {
      holds.focus = true;
      settle();
    });
    listen(root, "focusout", (event) => {
      if (root.contains(event.relatedTarget as Node)) return;
      holds.focus = false;
      settle();
    });

    const observer = new IntersectionObserver((entries) => {
      holds.offscreen = !entries[0].isIntersecting;
      settle();
    });
    observer.observe(root);
    cleanups.push(() => observer.disconnect());

    settle();
  }

  return () => {
    window.clearTimeout(timer);
    for (const t of leaveTimers) window.clearTimeout(t);
    for (const cleanup of cleanups) cleanup();
    root.classList.remove("is-ready", "running", "is-paused");
  };
}

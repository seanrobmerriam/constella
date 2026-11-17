/**
 * Previous/next buttons, slide markers and mouse dragging for one
 * `.slider_wrap` root. Returns cleanup.
 *
 * Markup: `.slider_list` holding the slides, and `.slider_controls` with an
 * empty `.slider_markers` and two `[data-step="-1" | "1"]` buttons. The list
 * is a native scroller, so touch, trackpad, Shift+wheel and the arrow keys
 * (with the list focused) already work without the script.
 *
 * - Each slide gets `role="group"` and an "n of total" label.
 * - The buttons move one slide and are disabled at either end.
 * - One marker per reachable position, the current one `aria-current`.
 * - A mouse drag scrolls the list and snaps to a slide, and the click that
 *   ends a drag doesn't follow a link.
 * - Scrolling is instant for visitors who prefer reduced motion.
 * - `.is-ready` shows the controls; `.is-empty` hides them when everything
 *   fits.
 */
export function initSlider(root: HTMLElement): () => void {
  const THRESHOLD = 4;

  const list = root.querySelector<HTMLElement>(".slider_list");
  const markers = root.querySelector<HTMLElement>(".slider_markers");
  const controls = root.querySelector<HTMLElement>(".slider_controls");
  const steps = [...root.querySelectorAll<HTMLButtonElement>("[data-step]")];
  if (!list) return () => {};

  const slides = [...list.children] as HTMLElement[];
  if (slides.length === 0) return () => {};

  const cleanups: (() => void)[] = [];
  const listen = <K extends keyof HTMLElementEventMap>(
    target: HTMLElement,
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ) => {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  };

  const labelled = slides.map((slide) => [
    slide,
    slide.getAttribute("role"),
    slide.getAttribute("aria-label"),
  ]) as [HTMLElement, string | null, string | null][];
  slides.forEach((slide, i) => {
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-label", `${i + 1} of ${slides.length}`);
  });

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const behavior = (): ScrollBehavior => (reduced.matches ? "auto" : "smooth");

  const stride = () => {
    const first = slides[0].getBoundingClientRect();
    if (slides.length < 2) return first.width;
    return slides[1].getBoundingClientRect().left - first.left;
  };

  const view = () => {
    const box = getComputedStyle(list);
    return (
      list.clientWidth -
      parseFloat(box.paddingInlineStart) -
      parseFloat(box.paddingInlineEnd)
    );
  };

  const pages = () => {
    const step = stride();
    if (step <= 0) return 1;
    return Math.max(1, slides.length - Math.round(view() / step) + 1);
  };

  const current = () => {
    const step = stride();
    return step > 0 ? Math.round(list.scrollLeft / step) : 0;
  };

  let drawn = 0;
  const draw = (total: number) => {
    if (!markers) return;
    drawn = total;
    markers.replaceChildren(
      ...Array.from({ length: total }, (_, i) => {
        const marker = document.createElement("button");
        marker.type = "button";
        marker.className = "slider_marker";
        marker.setAttribute("aria-label", `Go to slide ${i + 1}`);
        marker.addEventListener("click", () =>
          list.scrollTo({ left: i * stride(), behavior: behavior() }),
        );
        return marker;
      }),
    );
  };

  const sync = () => {
    const total = pages();
    if (total !== drawn) draw(total);

    const end = list.scrollWidth - list.clientWidth;
    const atStart = list.scrollLeft <= 1;
    const atEnd = list.scrollLeft >= end - 1;

    for (const step of steps) {
      step.disabled = Number(step.dataset.step) < 0 ? atStart : atEnd;
    }

    const index = current();
    markers?.querySelectorAll(".slider_marker").forEach((marker, i) => {
      marker.classList.toggle("is-active", i === index);
      if (i === index) marker.setAttribute("aria-current", "true");
      else marker.removeAttribute("aria-current");
    });

    controls?.classList.toggle("is-empty", end <= 1);
  };

  for (const step of steps) {
    listen(step, "click", () =>
      list.scrollBy({
        left: Number(step.dataset.step) * stride(),
        behavior: behavior(),
      }),
    );
  }

  let origin = 0;
  let from = 0;
  let pressed = false;
  let dragged = false;
  let settle = 0;

  const restore = () => {
    if (!pressed) list.classList.remove("is-dragging");
  };

  listen(list, "pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (list.scrollWidth <= list.clientWidth) return;
    pressed = true;
    dragged = false;
    origin = event.clientX;
    from = list.scrollLeft;
  });

  listen(list, "pointermove", (event) => {
    if (!pressed) return;
    const shift = event.clientX - origin;
    if (!dragged) {
      if (Math.abs(shift) < THRESHOLD) return;
      dragged = true;
      list.setPointerCapture(event.pointerId);
      list.classList.add("is-dragging");
    }
    list.scrollLeft = from - shift;
  });

  const release = () => {
    if (!pressed) return;
    pressed = false;
    const step = stride();
    if (dragged && step > 0) {
      list.scrollTo({
        left: Math.round(list.scrollLeft / step) * step,
        behavior: behavior(),
      });
    }
    list.addEventListener("scrollend", restore, { once: true });
    clearTimeout(settle);
    settle = window.setTimeout(() => {
      restore();
      /* The click that ends this drag has been swallowed by now, so the
         next one, by mouse or keyboard, goes through. */
      dragged = false;
    }, 400);
  };

  listen(list, "pointerup", release);
  listen(list, "pointercancel", release);
  listen(list, "dragstart", (event) => event.preventDefault());

  listen(
    list,
    "click",
    (event) => {
      if (!dragged) return;
      dragged = false;
      event.preventDefault();
      event.stopPropagation();
    },
    { capture: true },
  );

  let frame = 0;
  listen(
    list,
    "scroll",
    () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    },
    { passive: true },
  );

  root.classList.add("is-ready");

  const resize = new ResizeObserver(sync);
  resize.observe(list);

  addEventListener("load", sync);
  sync();

  return () => {
    for (const cleanup of cleanups.splice(0)) cleanup();
    resize.disconnect();
    removeEventListener("load", sync);
    list.removeEventListener("scrollend", restore);
    cancelAnimationFrame(frame);
    clearTimeout(settle);
    list.classList.remove("is-dragging");
    root.classList.remove("is-ready");
    controls?.classList.remove("is-empty");
    markers?.replaceChildren();
    for (const step of steps) step.disabled = false;
    for (const [slide, role, label] of labelled) {
      if (role === null) slide.removeAttribute("role");
      else slide.setAttribute("role", role);
      if (label === null) slide.removeAttribute("aria-label");
      else slide.setAttribute("aria-label", label);
    }
  };
}

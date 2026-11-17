/**
 * Play and pause for one `.marquee_wrap` root. Returns cleanup.
 *
 * Markup: `.marquee_track` holding two identical `.marquee_panel`s, the
 * second `aria-hidden` and `inert`, and a `[data-marquee-toggle]` button.
 *
 * - Sets `data-state="playing"`, or `"paused"` for visitors who prefer
 *   reduced motion. The strip only moves while it is `playing`, so without
 *   the script it holds still and the toggle stays hidden.
 * - The toggle flips the state and its `aria-pressed` and label. The
 *   visitor's choice stands until they press it again; a change to the
 *   reduced-motion setting only applies if they haven't pressed it.
 * - Pressing it also sets `data-motion="chosen"`, which exempts the strip
 *   from the stylesheet's reduced-motion reset: motion the visitor starts
 *   themselves is allowed.
 * - The stylesheet also holds the strip while anything inside has focus.
 */
export function initMarquee(root: HTMLElement): () => void {
  const toggle = root.querySelector<HTMLButtonElement>("[data-marquee-toggle]");
  if (!toggle) return () => {};

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let chosen = false;

  const setPlaying = (playing: boolean) => {
    root.dataset.state = playing ? "playing" : "paused";
    toggle.setAttribute("aria-pressed", String(playing));
    toggle.setAttribute("aria-label", playing ? "Pause" : "Play");
  };

  const follow = () => {
    if (!chosen) setPlaying(!reduced.matches);
  };
  const press = () => {
    chosen = true;
    root.dataset.motion = "chosen";
    setPlaying(root.dataset.state !== "playing");
  };

  follow();
  reduced.addEventListener("change", follow);
  toggle.addEventListener("click", press);

  return () => {
    reduced.removeEventListener("change", follow);
    toggle.removeEventListener("click", press);
    delete root.dataset.state;
    delete root.dataset.motion;
  };
}

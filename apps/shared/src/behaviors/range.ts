/**
 * Draws one `.form-range` root: keeps the fill, handle and shown value in step
 * with its native `input[type=range]`. Returns cleanup.
 *
 * The input works without this script. The custom fill and handle stay hidden
 * until `is-drawn` is set, so a page without the script shows the browser's
 * own slider thumb instead of a frozen handle.
 */
export function initRange(root: HTMLElement): () => void {
  const input = root.querySelector<HTMLInputElement>(".form-range_input");
  if (!input) return () => {};
  const shown = root.querySelector<HTMLElement>(".form-range_value");

  const update = () => {
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const at = Number(input.value);
    root.style.setProperty(
      "--_progress",
      String(max === min ? 0 : (at - min) / (max - min)),
    );
    if (shown) shown.textContent = input.value;
  };

  input.addEventListener("input", update);
  // A form reset changes the value without an input event.
  const form = input.form;
  const onReset = () => requestAnimationFrame(update);
  form?.addEventListener("reset", onReset);
  update();
  root.classList.add("is-drawn");

  return () => {
    input.removeEventListener("input", update);
    form?.removeEventListener("reset", onReset);
    root.classList.remove("is-drawn");
  };
}

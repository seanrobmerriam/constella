import { onCleanup, onMount, type Component } from "solid-js";
import { initThemeToggle } from "constella/behaviors/theme";

// Every canonical example, converted to Solid by convert.ts, rendered on
// the server and hydrated in the browser.
const modules = import.meta.glob<Record<string, Component>>(
  "../examples/*.tsx",
  { eager: true },
);

const examples = Object.entries(modules)
  .map(([path, module]) => ({
    id: path
      .split("/")
      .at(-1)!
      .replace(/\.tsx$/, ""),
    Example: Object.values(module)[0],
  }))
  .sort((a, b) => a.id.localeCompare(b.id));

function ThemeToggle() {
  let ref!: HTMLDivElement;
  onMount(() => onCleanup(initThemeToggle(ref)));
  return (
    <div ref={ref}>
      <button
        class="button_wrap secondary"
        type="button"
        data-theme-toggle
        aria-pressed="false"
      >
        <span class="button_text text-style-trim">Dark mode</span>
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <ThemeToggle />
      {examples.map(({ id, Example }) => (
        <div data-example={id}>
          <Example />
        </div>
      ))}
    </>
  );
}

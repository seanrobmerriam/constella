import { useEffect, useRef, type ComponentType } from "react";
import { initThemeToggle } from "constella/behaviors/theme";

// Every canonical example, exactly as the docs show it. Vite finds them, so
// a new example is covered without editing this file.
const modules = import.meta.glob<Record<string, ComponentType>>(
  "../../../../apps/shared/src/examples/*/Example.tsx",
  { eager: true },
);

const examples = Object.entries(modules)
  .map(([path, module]) => ({
    id: path.split("/").at(-2)!,
    Example: Object.values(module)[0],
  }))
  .sort((a, b) => a.id.localeCompare(b.id));

function ThemeToggle() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Counted so the tests can see StrictMode's double mount happen.
    const w = window as unknown as { effectRuns?: number };
    w.effectRuns = (w.effectRuns ?? 0) + 1;
    return initThemeToggle(ref.current!);
  }, []);
  return (
    <div ref={ref}>
      <button
        className="button_wrap secondary"
        type="button"
        data-theme-toggle
        aria-pressed="false"
      >
        <span className="button_text text-style-trim">Dark mode</span>
      </button>
    </div>
  );
}

export function App() {
  return (
    <>
      <ThemeToggle />
      {examples.map(({ id, Example }) => (
        <div key={id} data-example={id}>
          <Example />
        </div>
      ))}
    </>
  );
}

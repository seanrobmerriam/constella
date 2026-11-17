import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, type ComponentType } from "react";
import { initThemeToggle } from "constella/behaviors/theme";

export const Route = createFileRoute("/")({ component: Home });

// Every canonical example, exactly as the docs show it, rendered on the
// server and hydrated in the browser.
const modules = import.meta.glob<Record<string, ComponentType>>(
  "../../../../../apps/shared/src/examples/*/Example.tsx",
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
  useEffect(() => initThemeToggle(ref.current!), []);
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

function Home() {
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

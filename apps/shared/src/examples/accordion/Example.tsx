import { useEffect, useRef } from "react";
import { initAccordion } from "constella/behaviors/accordion";

const items = [
  {
    title: "Is it accessible?",
    body: "Native details and summary keep keyboard and screen reader behavior.",
  },
  {
    title: "Does it need JavaScript?",
    body: "Only to group items so one opens at a time.",
  },
  {
    title: "Can I nest them?",
    body: "Yes. Each accordion owns only its direct items.",
  },
];

export function AccordionExample() {
  const root = useRef<HTMLDivElement>(null);

  // Enhancement only: grouping and openFirst. Cleanup runs on unmount.
  useEffect(() => (root.current ? initAccordion(root.current) : undefined), []);

  return (
    <div
      className="accordion_wrap single"
      data-accordion
      data-open-first=""
      ref={root}
    >
      {items.map((item) => (
        <details className="details_wrap" key={item.title}>
          <summary className="details_summary">
            <h3 className="heading text-style-h5">{item.title}</h3>
            <svg
              width="66"
              height="70"
              viewBox="0 0 66 70"
              fill="none"
              aria-hidden="true"
              className="icon small details_icon"
            >
              <path
                d="M17 2L50 34.9999L17 68"
                stroke="currentColor"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: "var(--border-width)" }}
              />
            </svg>
          </summary>
          <div className="details_body margin-trim">
            <p className="text">{item.body}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

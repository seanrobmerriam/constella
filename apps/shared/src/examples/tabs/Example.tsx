import { useEffect, useRef } from "react";
import { initTabs } from "constella/behaviors/tabs";

const steps = [
  {
    label: "Strategy",
    text: "We start with what your visitors need, and what the site has to do for them.",
  },
  {
    label: "Design",
    text: "Pages are built from the same components, so they stay consistent as the site grows.",
  },
  {
    label: "Launch",
    text: "Every page is checked on phones, with a keyboard and with a screen reader before it ships.",
  },
];

/** The behavior adds the tab roles and IDs, so the markup stays plain. */
export function TabsExample() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => initTabs(ref.current!), []);

  return (
    <div className="tabs_wrap" id="process" ref={ref}>
      <div className="tabs_bar">
        <div
          className="tabs_links"
          role="tablist"
          aria-orientation="horizontal"
        >
          {steps.map((step) => (
            <button className="tabs_link" type="button" key={step.label}>
              <span className="tabs_link_text text-style-trim">
                {step.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="tabs_panels">
        {steps.map((step) => (
          <div className="margin-trim" key={step.label}>
            <h3 className="heading text-style-h5">{step.label}</h3>
            <p className="text">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

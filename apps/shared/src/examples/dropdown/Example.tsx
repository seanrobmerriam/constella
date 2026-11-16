import { useEffect, useRef } from "react";
import { initDropdown } from "constella/behaviors/dropdown";

export function DropdownExample() {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => initDropdown(ref.current!), []);

  return (
    <div className="input-wrapper">
      <a className="button_wrap" href="#">
        <span className="button_text text-style-trim">Get started</span>
      </a>
      <details className="dropdown_wrap" ref={ref}>
        <summary className="dropdown_toggle">
          <span className="dropdown_label text-style-trim">Resources</span>
          <svg
            className="icon small dropdown_icon"
            viewBox="0 0 66 70"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M17 2L50 34.9999L17 68"
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: "var(--border-width)" }}
            />
          </svg>
        </summary>
        <div className="dropdown_content">
          <div className="dropdown_body margin-trim">
            <ul className="flex-vertical-nowrap gap-2">
              <li>
                <a href="#">Guides</a>
              </li>
              <li>
                <a href="#">Changelog</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
            </ul>
          </div>
        </div>
      </details>
    </div>
  );
}

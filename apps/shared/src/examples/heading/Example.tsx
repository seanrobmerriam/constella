import type { CSSProperties } from "react";

export function HeadingExample() {
  return (
    <div className="container gap-6">
      <div className="layout">
        <div>
          <p className="heading eyebrow text-style-small">Eyebrow</p>
          <h2 className="heading text-style-h2">A second-level heading</h2>
        </div>
      </div>

      <div className="layout">
        <div>
          <p className="heading eyebrow-tag text-style-small">New</p>
          <h2 className="heading text-style-h4">Same level, smaller style</h2>
        </div>
      </div>

      <h3
        className="heading text-style-h3"
        style={{ "--_mw": "20ch" } as CSSProperties}
      >
        A heading kept to twenty characters a line
      </h3>
    </div>
  );
}

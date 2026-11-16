import type { CSSProperties } from "react";

const tile = "background-2 padding-4 radius-small margin-trim";

export function GridExample() {
  return (
    <>
      <div
        className="grid"
        style={{ "--_cols-sm": 2, "--_cols-lg": 3 } as CSSProperties}
      >
        {["One", "Two", "Three", "Four"].map((label) => (
          <div className={tile} key={label}>
            <p className="text">{label}</p>
          </div>
        ))}
      </div>

      <div
        className="grid autofit margin-top-6"
        style={{ "--_min-col-width": 8 } as CSSProperties}
      >
        {["Fits", "as many", "as there is room for"].map((label) => (
          <div className={tile} key={label}>
            <p className="text">{label}</p>
          </div>
        ))}
      </div>
    </>
  );
}

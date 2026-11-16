import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { initRange } from "constella/behaviors/range";

export function RangeExample() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cleanups = [
      ...ref.current!.querySelectorAll<HTMLElement>(".form-range"),
    ].map(initRange);
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);
  return (
    <div ref={ref}>
      <div
        className="field form-range"
        style={{ "--_progress": "0.4" } as CSSProperties}
      >
        <label className="field-label text-style-main" htmlFor="budget">
          <span>Budget</span>
        </label>
        <span className="form-range_control">
          <input
            className="form-range_input"
            type="range"
            id="budget"
            name="budget"
            min="0"
            max="100"
            step="5"
            defaultValue="40"
          />
          <span className="form-range_track" aria-hidden="true"></span>
          <span className="form-range_fill" aria-hidden="true"></span>
          <span className="form-range_handle" aria-hidden="true"></span>
        </span>
        <output className="form-range_output text-style-small" htmlFor="budget">
          <span className="form-range_value">40</span>
          <span>k</span>
        </output>
      </div>
    </div>
  );
}

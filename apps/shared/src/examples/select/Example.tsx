export function SelectExample() {
  return (
    <>
      <label className="field form-select">
        <span className="field-label text-style-main">
          <span>Topic</span>
          <span className="field-star" aria-hidden="true">
            *
          </span>
        </span>
        <span className="form-select_control">
          <select
            defaultValue=""
            className="field-control form-select_field text-style-main"
            name="topic"
            required
          >
            <option value="" disabled hidden>
              Select one…
            </option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="press">Press</option>
          </select>
          <svg
            className="icon small form-select_mark"
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
        </span>
      </label>
    </>
  );
}

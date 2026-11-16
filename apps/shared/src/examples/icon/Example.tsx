/** An icon is an inline SVG. In React, keep each one as a small component. */
function Arrow({ size }: { size: "small" | "medium" | "large" }) {
  return (
    <svg
      className={`icon ${size}`}
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
  );
}

export function IconExample() {
  return (
    <div className="flex-horizontal-wrap gap-6">
      <Arrow size="small" />
      <Arrow size="medium" />
      <Arrow size="large" />
      <a className="button_wrap secondary" href="#">
        <span className="button_text text-style-trim">Next step</span>
        <Arrow size="small" />
      </a>
    </div>
  );
}

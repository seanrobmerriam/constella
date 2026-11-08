export function DetailsExample() {
  return (
    <details className="details_wrap">
      <summary className="details_summary">
        <h3 className="heading text-style-h5">What is Constella?</h3>
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
        <p className="text">
          A CSS framework with portable styles and optional behavior.
        </p>
      </div>
    </details>
  );
}

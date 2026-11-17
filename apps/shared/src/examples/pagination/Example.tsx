type Entry = number | "gap";

function Arrow() {
  return (
    <svg
      className="icon small pagination_icon"
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

function Pages(props: { label: string; current: number; entries: Entry[] }) {
  const last = props.entries.at(-1) as number;
  return (
    <nav className="pagination" aria-label={props.label}>
      <ul className="pagination_list">
        <li>
          {props.current > 1 ? (
            <a
              className="pagination_link pagination_step"
              href={`#page-${props.current - 1}`}
              rel="prev"
            >
              <Arrow />
              <span>Previous</span>
            </a>
          ) : (
            <a
              className="pagination_link pagination_step"
              role="link"
              aria-disabled="true"
            >
              <Arrow />
              <span>Previous</span>
            </a>
          )}
        </li>
        {props.entries.map((entry, index) =>
          entry === "gap" ? (
            <li key={"gap" + index}>
              <span className="pagination_gap" aria-hidden="true">
                …
              </span>
            </li>
          ) : (
            <li key={entry}>
              <a
                className="pagination_link"
                href={`#page-${entry}`}
                aria-current={entry === props.current ? "page" : undefined}
              >
                <span className="sr-only">Page </span>
                {entry}
              </a>
            </li>
          ),
        )}
        <li>
          {props.current < last ? (
            <a
              className="pagination_link pagination_step"
              href={`#page-${props.current + 1}`}
              rel="next"
            >
              <span>Next</span>
              <Arrow />
            </a>
          ) : (
            <a
              className="pagination_link pagination_step"
              role="link"
              aria-disabled="true"
            >
              <span>Next</span>
              <Arrow />
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
}

/** Page 5 of 10, with gaps, and the first of 3, where Previous is disabled. */
export function PaginationExample() {
  return (
    <div className="flex-vertical-nowrap gap-5">
      <Pages
        label="Pagination"
        current={5}
        entries={[1, "gap", 4, 5, 6, "gap", 10]}
      />
      <Pages label="Pagination, first page" current={1} entries={[1, 2, 3]} />
    </div>
  );
}

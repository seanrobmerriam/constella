/** Inline labels. A count says what it counts, at least to screen readers. */
export function BadgeExample() {
  return (
    <div className="flex-vertical-nowrap gap-5">
      <p className="text">
        <span className="badge">Draft</span>{" "}
        <span className="badge brand">New</span>{" "}
        <span className="badge info">Beta</span>{" "}
        <span className="badge success">Paid</span>{" "}
        <span className="badge warning">Due soon</span>{" "}
        <span className="badge error">Overdue</span>
      </p>

      <h3 className="heading text-style-h4">
        Invoices <span className="badge">12</span>
      </h3>

      <div className="input-wrapper">
        <a className="button_wrap secondary" href="#inbox">
          <span className="button_text text-style-trim">Inbox</span>
          <span className="badge brand">
            3<span className="sr-only"> unread</span>
          </span>
        </a>
      </div>
    </div>
  );
}

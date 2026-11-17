import { useEffect, useRef, type ReactNode } from "react";
import { initAlert } from "constella/behaviors/alert";

type Tone = "info" | "success" | "warning" | "error";
const stroke = { strokeWidth: "var(--border-width)" };

const icons: Record<Tone, ReactNode> = {
  info: (
    <>
      <circle
        cx="12"
        cy="12"
        r="10.5"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
        style={stroke}
      />
      <path
        d="M12 10.5V17.5"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
        style={stroke}
      />
      <circle cx="12" cy="7.25" r="0.9" fill="currentColor" />
    </>
  ),
  success: (
    <>
      <circle
        cx="12"
        cy="12"
        r="10.5"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
        style={stroke}
      />
      <path
        d="M7.5 12.5L10.5 15.5L16.5 9"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
        style={stroke}
      />
    </>
  ),
  warning: (
    <>
      <path
        d="M12 2.5L22.5 20.5H1.5L12 2.5Z"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
        style={stroke}
      />
      <path
        d="M12 9V14.5"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
        style={stroke}
      />
      <circle cx="12" cy="17.25" r="0.9" fill="currentColor" />
    </>
  ),
  error: (
    <>
      <circle
        cx="12"
        cy="12"
        r="10.5"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
        style={stroke}
      />
      <path
        d="M8.5 8.5L15.5 15.5M15.5 8.5L8.5 15.5"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
        style={stroke}
      />
    </>
  ),
};

function Alert({
  tone = "info",
  title,
  dismissible = false,
  children,
}: {
  tone?: Tone;
  title?: string;
  dismissible?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Does nothing on an alert without a dismiss button.
  useEffect(() => initAlert(ref.current!), []);
  return (
    <div
      className={["alert_wrap", tone !== "info" && tone]
        .filter(Boolean)
        .join(" ")}
      ref={ref}
    >
      <svg
        className="icon small alert_icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        {icons[tone]}
      </svg>
      <div className="alert_content margin-trim">
        {title && <p className="alert_title text-style-main">{title}</p>}
        <p className="text">{children}</p>
      </div>
      {dismissible && (
        <button
          className="button_wrap secondary close alert_dismiss"
          type="button"
          aria-label="Dismiss"
          data-alert-dismiss
        >
          <svg
            className="icon small button_mark"
            viewBox="0 0 26 26"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 2L24.6274 24.6274"
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
              style={stroke}
            />
            <path
              d="M2 25.0024L24.6274 2.375"
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
              style={stroke}
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export function AlertExample() {
  return (
    <div className="flex-vertical-nowrap gap-4">
      <Alert title="Maintenance tonight">
        The site will be read-only from 22:00 to 23:00 UTC.
      </Alert>
      <Alert tone="success" title="Saved">
        Your changes are live.
      </Alert>
      <Alert tone="warning">
        Your trial ends in 3 days. Add a payment method to keep your projects.
      </Alert>
      <Alert tone="error" title="Payment failed" dismissible>
        Your card was declined. Try another card.
      </Alert>
    </div>
  );
}

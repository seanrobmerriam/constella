import { useEffect, useRef } from "react";
import { initModal } from "constella/behaviors/modal";

function CloseIcon() {
  const stroke = { strokeWidth: "var(--border-width)" };
  return (
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
  );
}

export function ModalExample() {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => initModal(ref.current!), []);

  return (
    <>
      <div className="input-wrapper">
        <button
          className="button_wrap"
          type="button"
          data-modal-open="newsletter"
        >
          <span className="button_text text-style-trim">Subscribe</span>
        </button>
      </div>

      <dialog
        id="newsletter"
        className="modal_wrap"
        aria-labelledby="newsletter-title"
        ref={ref}
      >
        <div className="modal_content">
          <button
            className="button_wrap secondary close modal_close"
            type="button"
            aria-label="Close"
            data-modal-close
          >
            <CloseIcon />
          </button>
          <div className="modal_scroll" data-modal-scroll>
            <div className="modal_body margin-trim">
              <h2 id="newsletter-title" className="heading text-style-h4">
                Get the monthly update
              </h2>
              <p className="text">
                One email a month with what changed. No spam.
              </p>
              <div className="input-wrapper">
                <a className="button_wrap" href="#">
                  <span className="button_text text-style-trim">Subscribe</span>
                </a>
                <button
                  className="button_wrap secondary"
                  type="button"
                  data-modal-close
                >
                  <span className="button_text text-style-trim">Not now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

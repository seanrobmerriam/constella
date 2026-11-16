import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { initForm } from "constella/behaviors/form";

export function FormExample() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cleanups = [
      ...ref.current!.querySelectorAll<HTMLElement>(".form_wrap"),
    ].map(initForm);
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);
  return (
    <div ref={ref}>
      <div className="form_wrap" data-state="idle" data-endpoint="/api/contact">
        <form
          className="form_fields"
          name="contact"
          action="/api/contact"
          method="post"
        >
          <fieldset className="form-fieldset columns">
            <legend className="form-fieldset_legend form-fieldset_legend-hidden sr-only">
              Your details
            </legend>
            <div className="form-fieldset_fields">
              <label className="field form-input">
                <span className="field-label text-style-main">
                  <span>Name</span>
                  <span className="field-star" aria-hidden="true">
                    *
                  </span>
                </span>
                <input
                  className="field-control text-style-main"
                  type="text"
                  name="name"
                  placeholder="Name"
                  inputMode="text"
                  autoComplete="name"
                  required
                />
              </label>
              <label className="field form-input">
                <span className="field-label text-style-main">
                  <span>Email</span>
                  <span className="field-star" aria-hidden="true">
                    *
                  </span>
                </span>
                <input
                  className="field-control text-style-main"
                  type="email"
                  name="email"
                  placeholder="Email"
                  inputMode="email"
                  autoComplete="email"
                  required
                />
              </label>
            </div>
          </fieldset>
          <label className="field form-select">
            <span className="field-label text-style-main">
              <span>Topic</span>
            </span>
            <span className="form-select_control">
              <select
                defaultValue=""
                className="field-control form-select_field text-style-main"
                name="topic"
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
          <label
            className="field form-textarea"
            style={
              { "--_min-lines": "3", "--_max-lines": "12" } as CSSProperties
            }
          >
            <span className="field-label text-style-main">
              <span>Message</span>
              <span className="field-star" aria-hidden="true">
                *
              </span>
            </span>
            <textarea
              className="field-control form-textarea_field text-style-main"
              name="message"
              rows={3}
              required
            />
          </label>
          <label className="form-choice">
            <input
              className="form-choice_input"
              type="checkbox"
              name="updates"
            />
            <span className="form-choice_mark" aria-hidden="true">
              <svg
                className="icon small form-choice_tick"
                viewBox="0 0 26 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 10.5L9.5 18L24 2"
                  stroke="currentColor"
                  vectorEffect="non-scaling-stroke"
                  style={{ strokeWidth: "var(--border-width)" }}
                />
              </svg>
            </span>
            <span className="form-choice_text text-style-main">
              Email me product updates
            </span>
          </label>
          <div className="input-wrapper">
            <button className="button_wrap" type="submit">
              <span className="button_text text-style-trim">Send</span>
            </button>
          </div>
        </form>
        <p className="form_note form_note-sent text-style-main" role="status">
          Thanks — we will be in touch.
        </p>
        <p className="form_note form_note-failed text-style-main" role="alert">
          That did not send. Please try again.
        </p>
      </div>
    </div>
  );
}

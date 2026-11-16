import type { CSSProperties } from "react";

export function TextareaExample() {
  return (
    <>
      <label
        className="field form-textarea"
        style={{ "--_min-lines": "3", "--_max-lines": "8" } as CSSProperties}
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
          placeholder="What can we help with?"
          required
        />
      </label>
    </>
  );
}

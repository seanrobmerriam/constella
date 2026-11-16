export function ChoiceExample() {
  return (
    <>
      <div className="flex-vertical-nowrap gap-4">
        <label className="form-choice">
          <input
            className="form-choice_input"
            type="checkbox"
            name="updates"
            defaultChecked
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
        <label className="form-choice toggle">
          <input
            className="form-choice_input"
            type="checkbox"
            name="dark-mode"
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
          <span className="form-choice_text text-style-main">Dark mode</span>
        </label>
        <fieldset className="form-fieldset inline">
          <legend className="form-fieldset_legend form-fieldset_legend-label field-label text-style-main">
            Billing
          </legend>
          <div className="form-fieldset_fields">
            <label className="form-choice chip">
              <input
                className="form-choice_input"
                type="radio"
                name="plan"
                value="monthly"
                defaultChecked
              />
              <span className="form-choice_mark" aria-hidden="true">
                <span className="form-choice_dot"></span>
              </span>
              <span className="form-choice_text text-style-main">Monthly</span>
            </label>
            <label className="form-choice chip">
              <input
                className="form-choice_input"
                type="radio"
                name="plan"
                value="yearly"
              />
              <span className="form-choice_mark" aria-hidden="true">
                <span className="form-choice_dot"></span>
              </span>
              <span className="form-choice_text text-style-main">Yearly</span>
            </label>
          </div>
        </fieldset>
      </div>
    </>
  );
}

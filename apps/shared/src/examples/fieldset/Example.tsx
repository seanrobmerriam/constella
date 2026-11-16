export function FieldsetExample() {
  return (
    <>
      <fieldset className="form-fieldset columns">
        <legend className="form-fieldset_legend form-fieldset_legend-heading text-style-h5">
          Your details
        </legend>
        <div className="form-fieldset_fields">
          <label className="field form-input">
            <span className="field-label text-style-main">
              <span>First name</span>
              <span className="field-star" aria-hidden="true">
                *
              </span>
            </span>
            <input
              className="field-control text-style-main"
              type="text"
              name="first-name"
              placeholder="First name"
              inputMode="text"
              autoComplete="given-name"
              required
            />
          </label>
          <label className="field form-input">
            <span className="field-label text-style-main">
              <span>Last name</span>
              <span className="field-star" aria-hidden="true">
                *
              </span>
            </span>
            <input
              className="field-control text-style-main"
              type="text"
              name="last-name"
              placeholder="Last name"
              inputMode="text"
              autoComplete="family-name"
              required
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="form-fieldset inline">
        <legend className="form-fieldset_legend form-fieldset_legend-label field-label text-style-main">
          Contact by
        </legend>
        <div className="form-fieldset_fields">
          <label className="form-choice">
            <input
              className="form-choice_input"
              type="radio"
              name="contact"
              value="email"
              defaultChecked
            />
            <span className="form-choice_mark" aria-hidden="true">
              <span className="form-choice_dot"></span>
            </span>
            <span className="form-choice_text text-style-main">Email</span>
          </label>
          <label className="form-choice">
            <input
              className="form-choice_input"
              type="radio"
              name="contact"
              value="phone"
            />
            <span className="form-choice_mark" aria-hidden="true">
              <span className="form-choice_dot"></span>
            </span>
            <span className="form-choice_text text-style-main">Phone</span>
          </label>
        </div>
      </fieldset>
    </>
  );
}

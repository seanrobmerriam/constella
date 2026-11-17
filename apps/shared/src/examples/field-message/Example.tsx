/** Help text and errors live outside the label, linked by aria-describedby. */
export function FieldMessageExample() {
  return (
    <form className="flex-vertical-nowrap gap-5" noValidate>
      <div className="field form-input">
        <label className="field-label text-style-main" htmlFor="signup-email">
          <span>Email</span>
          <span className="field-star" aria-hidden="true">
            *
          </span>
        </label>
        <input
          className="field-control text-style-main"
          id="signup-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          aria-describedby="signup-email-help"
        />
        <p className="field-help text-style-small" id="signup-email-help">
          We only use it to send your receipt.
        </p>
      </div>

      <div className="field form-input">
        <label className="field-label text-style-main" htmlFor="signup-name">
          <span>Username</span>
        </label>
        <input
          className="field-control text-style-main"
          id="signup-name"
          type="text"
          name="username"
          defaultValue="ada lovelace"
          autoComplete="username"
          aria-describedby="signup-name-help signup-name-error"
          aria-invalid="true"
        />
        <p className="field-help text-style-small" id="signup-name-help">
          Letters, numbers and dashes.
        </p>
        <p className="field-error text-style-small" id="signup-name-error">
          Usernames can't contain spaces. Try ada-lovelace.
        </p>
      </div>
    </form>
  );
}

export function InputWrapperExample() {
  return (
    <div className="input-wrapper">
      <label className="field form-input">
        <span className="field-label text-style-main">
          <span>Email</span>
        </span>
        <input
          className="field-control text-style-main"
          type="email"
          name="email"
          autoComplete="email"
        />
      </label>
      <button className="button_wrap" type="submit">
        <span className="button_text text-style-trim">Subscribe</span>
      </button>
    </div>
  );
}

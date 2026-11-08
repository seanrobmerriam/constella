export function ButtonExample() {
  return (
    <div className="input-wrapper">
      <a className="button_wrap" href="#">
        <span className="button_text text-style-trim">Primary</span>
      </a>
      <a className="button_wrap secondary" href="#">
        <span className="button_text text-style-trim">Secondary</span>
      </a>
      <a className="button_wrap link" href="#">
        <span className="button_text text-style-trim">Link</span>
      </a>
      <button
        className="button_wrap"
        type="button"
        data-size="small"
        data-radius="round"
      >
        <span className="button_text text-style-trim">Small, round</span>
      </button>
      <button className="button_wrap" type="button" disabled>
        <span className="button_text text-style-trim">Disabled</span>
      </button>
    </div>
  );
}

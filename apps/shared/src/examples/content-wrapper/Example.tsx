export function ContentWrapperExample() {
  return (
    <div className="layout columns">
      <div>
        <h2 className="heading text-style-h4">Text beside a visual</h2>
        <p className="text">
          From 64rem wide the two columns sit side by side. Below that they
          stack, text first.
        </p>
        <div className="input-wrapper">
          <a className="button_wrap secondary" href="#">
            <span className="button_text text-style-trim">Learn more</span>
          </a>
        </div>
      </div>
      <div>
        <div className="image" role="presentation" />
      </div>
    </div>
  );
}

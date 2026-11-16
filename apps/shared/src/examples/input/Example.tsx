export function InputExample() {
  return (
    <>
      <div className="flex-vertical-nowrap gap-5">
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
        <label className="field form-input">
          <span className="field-label text-style-main">
            <span>First name</span>
          </span>
          <input
            className="field-control text-style-main"
            type="text"
            name="first-name"
            placeholder="First name"
            inputMode="text"
            autoComplete="given-name"
          />
        </label>
        <label
          className="field form-input"
          data-size="small"
          data-radius="round"
        >
          <span className="field-label text-style-main sr-only">
            <span>Search</span>
          </span>
          <input
            className="field-control text-style-main"
            type="search"
            name="q"
            placeholder="Search the docs"
            inputMode="search"
            autoComplete="off"
          />
        </label>
      </div>
    </>
  );
}

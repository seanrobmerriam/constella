/** Render the link first in the body, before the header and navigation. */
export function SkipExample() {
  return (
    <>
      <a className="button_wrap skip-link" href="#main">
        <span className="button_text text-style-trim">
          Skip to main content
        </span>
      </a>

      <main id="main" tabIndex={-1}>
        <h2 className="heading text-style-h5">
          Press Tab to reveal the skip link
        </h2>
        <p className="text">
          It stays off-screen until it has keyboard focus, then appears in the
          top corner. Following it moves focus here, past the navigation.
        </p>
      </main>
    </>
  );
}

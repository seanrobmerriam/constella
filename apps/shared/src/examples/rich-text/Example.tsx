import type { CSSProperties } from "react";

/** Prose you write in JSX. For HTML from a CMS, see the note on the docs page. */
export function RichTextExample() {
  return (
    <div
      className="text rich-text"
      style={{ "--_mw": "60ch" } as CSSProperties}
    >
      <h2>Writing in rich text</h2>
      <p>
        Plain HTML from a CMS or Markdown is styled as it is:{" "}
        <a href="#">links</a>, <strong>bold</strong> and <em>italic</em> text.
      </p>
      <ul>
        <li>Lists get markers and spacing.</li>
        <li>
          Nested lists change marker.
          <ul>
            <li>Like this one.</li>
          </ul>
        </li>
      </ul>
      <blockquote>
        <p>A quotation, set off with a rule.</p>
      </blockquote>
      <h3>A smaller heading</h3>
      <p>Each element keeps its own text style and margins.</p>
    </div>
  );
}

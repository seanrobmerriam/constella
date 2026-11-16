import type { CSSProperties } from "react";

export function ParagraphExample() {
  return (
    <>
      <p className="text text-style-large">
        A large introductory paragraph that sets up what follows.
      </p>
      <p className="text">
        A paragraph in the main text style. Paragraphs take their spacing from
        their text style, so a run of them needs no extra classes.
      </p>
      <p
        className="text text-style-small"
        style={{ "--_mw": "45ch" } as CSSProperties}
      >
        A small paragraph limited to forty-five characters a line, for captions
        and fine print that should not run across the whole column.
      </p>
    </>
  );
}

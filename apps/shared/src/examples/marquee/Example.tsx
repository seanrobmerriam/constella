import { useEffect, useRef, type CSSProperties } from "react";
import { initMarquee } from "constella/behaviors/marquee";

const words = ["Strategy", "Design", "Build", "Launch", "Support"];

function Panel({ copy = false }: { copy?: boolean }) {
  /* The copy carries the loop. It is hidden from assistive technology and
     the tab order, so nothing is met twice. */
  return (
    <div className="marquee_panel" aria-hidden={copy || undefined} inert={copy}>
      {words.map((word) => (
        <p className="text text-style-large" key={word}>
          {word}
        </p>
      ))}
    </div>
  );
}

/** The behavior starts the strip and runs the pause button. */
export function MarqueeExample() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => initMarquee(ref.current!), []);

  return (
    <div
      className="marquee_wrap"
      style={{ "--_count": words.length } as CSSProperties}
      role="group"
      aria-label="What we do"
      ref={ref}
    >
      <div className="marquee_viewport">
        <div className="marquee_track">
          <Panel />
          <Panel copy />
        </div>
      </div>
      <button
        className="button_wrap secondary play marquee_toggle"
        type="button"
        aria-label="Pause"
        aria-pressed="true"
        data-marquee-toggle
      >
        <svg
          className="icon small button_mark button_play"
          viewBox="0 0 1393 1394"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1271 696.5L280 1393V0L1271 696.5Z" fill="currentColor" />
        </svg>
        <svg
          className="icon small button_mark button_pause"
          viewBox="0 0 1277 1277"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1087 0H766V1277H1087V0Z" fill="currentColor" />
          <path d="M510 0H189V1277H510V0Z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}

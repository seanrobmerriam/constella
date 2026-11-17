import { useEffect, useRef, type CSSProperties } from "react";
import { initSlider } from "constella/behaviors/slider";

const services = [
  {
    title: "Strategy",
    text: "What your visitors need, and what the site has to do for them.",
  },
  {
    title: "Design",
    text: "Pages built from the same components, so they stay consistent.",
  },
  {
    title: "Build",
    text: "Plain HTML and CSS first, with scripts only where they help.",
  },
  {
    title: "Launch",
    text: "Checked on phones, with a keyboard and with a screen reader.",
  },
  {
    title: "Support",
    text: "Small fixes and new pages after launch, as the site grows.",
  },
];

function ArrowIcon() {
  const stroke = { strokeWidth: "var(--border-width)" };
  return (
    <svg
      className="icon small button_mark"
      viewBox="0 0 240 188"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M135 184.805L234 93.8053L135 2.80469"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
        style={stroke}
      />
      <path
        d="M234 93.8047H0"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
        style={stroke}
      />
    </svg>
  );
}

/** The behavior fills in the markers and labels the slides. */
export function SliderExample() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => initSlider(ref.current!), []);

  return (
    <div
      className="slider_wrap"
      style={{ "--_visible-sm": 2, "--_visible-md": 3 } as CSSProperties}
      ref={ref}
    >
      <div
        className="slider_list"
        role="group"
        aria-label="Services"
        tabIndex={0}
      >
        {services.map((service) => (
          <div className="card_wrap" key={service.title}>
            <div className="card_content margin-trim">
              <h3 className="heading text-style-h5">{service.title}</h3>
              <p className="text">{service.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="slider_controls">
        <div className="slider_markers" />
        <div className="slider_steps">
          <button
            className="button_wrap secondary arrow back"
            type="button"
            aria-label="Previous slide"
            data-step="-1"
          >
            <ArrowIcon />
          </button>
          <button
            className="button_wrap secondary arrow"
            type="button"
            aria-label="Next slide"
            data-step="1"
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

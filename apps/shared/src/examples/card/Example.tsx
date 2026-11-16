import type { CSSProperties, ReactNode } from "react";

const image =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Cdefs%3E%3ClinearGradient id='s' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23ebe65b'/%3E%3Cstop offset='1' stop-color='%23453e42'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23s)'/%3E%3Cpath d='M0 300 L170 170 L300 270 L420 190 L600 320 V400 H0Z' fill='%231f1d1e'/%3E%3C/svg%3E";

type Variant = "default" | "cover" | "stacked";

/** Each variant closes with its own button style, as the Astro Card does. */
const buttonClass: Record<Variant, string> = {
  default: "button_wrap secondary",
  cover: "button_wrap",
  stacked: "button_wrap link",
};

function Card(props: {
  variant: Variant;
  eyebrow: string;
  title: string;
  children: ReactNode;
  action: string;
  href: string;
}) {
  const { variant } = props;
  const rootClass =
    variant === "default"
      ? "card_wrap"
      : variant === "cover"
        ? "card_wrap cover theme-dark"
        : "card_wrap stacked";
  return (
    <li className={rootClass}>
      {variant !== "default" && (
        <div className="card_visual">
          <img className="image" src={image} alt="" />
          {variant === "cover" && (
            <div
              className="overlay gradient"
              style={{ "--_strength": 50 } as CSSProperties}
            />
          )}
        </div>
      )}
      <div className="card_content margin-trim">
        <p className="heading eyebrow text-style-small">{props.eyebrow}</p>
        <h3 className="heading text-style-h5">{props.title}</h3>
        <p className="text">{props.children}</p>
        <div className="input-wrapper">
          <a className={buttonClass[variant]} href={props.href}>
            <span className="button_text text-style-trim">{props.action}</span>
          </a>
        </div>
      </div>
    </li>
  );
}

export function CardExample() {
  return (
    <ul
      className="grid"
      style={{ "--_cols-sm": 2, "--_cols-lg": 3 } as CSSProperties}
    >
      <Card
        variant="default"
        eyebrow="Guide"
        title="Default card"
        action="Read the guide"
        href="#"
      >
        A tinted surface. Its button is secondary.
      </Card>
      <Card
        variant="cover"
        eyebrow="Story"
        title="Cover card"
        action="Read the story"
        href="#"
      >
        The image fills the card behind the text.
      </Card>
      <Card
        variant="stacked"
        eyebrow="Update"
        title="Stacked card"
        action="Read the update"
        href="#"
      >
        The image sits above, with no surface.
      </Card>
    </ul>
  );
}

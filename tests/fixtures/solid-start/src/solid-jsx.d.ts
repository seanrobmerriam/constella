// `bool:inert={x}` adds the attribute when x is true and removes it when
// false. Solid types the `bool:` prefix only for attributes listed here.
import "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface ExplicitBoolAttributes {
      inert: boolean;
    }
  }
}

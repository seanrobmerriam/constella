import { createSignal, Show } from "solid-js";
import { NavbarExample } from "../examples/navbar";

// A behavior inside <Show>: hiding it unmounts the component, which must run
// the behavior's cleanup through onCleanup.
export default function Lifecycle() {
  const [shown, setShown] = createSignal(true);
  return (
    <>
      <button type="button" onClick={() => setShown(!shown())}>
        {shown() ? "Hide" : "Show"}
      </button>
      <Show when={shown()}>
        <NavbarExample />
      </Show>
    </>
  );
}

import { uid } from "./unique-id.ts";

/**
 * Ids and ARIA attributes for a field's help and error text. With neither,
 * everything is undefined and the field renders as a plain <label>.
 */
export function fieldMessages(opts: {
  id?: string | null;
  help?: string;
  error?: string;
}) {
  const { help, error } = opts;
  if (!help && !error)
    return {
      controlId: opts.id ?? undefined,
      helpId: undefined,
      errorId: undefined,
      describedBy: undefined,
      invalid: undefined,
    };
  const controlId = opts.id ?? uid("field");
  const helpId = help ? `${controlId}-help` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  return {
    controlId,
    helpId,
    errorId,
    describedBy: [helpId, errorId].filter(Boolean).join(" "),
    invalid: error ? ("true" as const) : undefined,
  };
}

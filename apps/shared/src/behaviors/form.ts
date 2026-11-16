/**
 * Submits one `.form_wrap` root's form without leaving the page and shows its
 * sent or failed note. Returns cleanup.
 *
 * Markup: `.form_wrap[data-endpoint]` holding `form.form_fields` and the two
 * `.form_note` elements. Without this script the form still submits natively
 * to its `action`.
 *
 * - Invalid fields: the submit is left to the browser, which shows its own
 *   validation messages.
 * - `data-endpoint` set: the fields are sent with `fetch`, as the form body
 *   for POST and as the query string for GET. A 2xx answer means sent.
 * - No `data-endpoint`: nothing is sent and the form is marked sent. This is
 *   for prototypes only.
 *
 * `data-state` on the root moves `idle` → `sending` → `sent` | `failed`.
 */
export function initForm(root: HTMLElement): () => void {
  const fields = root.querySelector<HTMLFormElement>("form.form_fields");
  if (!fields) return () => {};

  const submit = fields.querySelector<HTMLButtonElement | HTMLInputElement>(
    'button:not([type]), button[type="submit"], input[type="submit"]',
  );

  const send = async (endpoint: string) => {
    const method = (fields.method || "post").toUpperCase();
    const data = new FormData(fields);
    if (method === "GET") {
      const url = new URL(endpoint, location.href);
      for (const [key, value] of data)
        if (typeof value === "string") url.searchParams.append(key, value);
      return fetch(url, { method, headers: { Accept: "application/json" } });
    }
    return fetch(endpoint, {
      method,
      body: data,
      headers: { Accept: "application/json" },
    });
  };

  const onSubmit = async (event: SubmitEvent) => {
    if (!fields.checkValidity()) return;
    event.preventDefault();
    root.dataset.state = "sending";
    if (submit) submit.disabled = true;

    try {
      const endpoint = root.dataset.endpoint;
      if (endpoint) {
        const answer = await send(endpoint);
        if (!answer.ok) throw new Error(String(answer.status));
      }
      root.dataset.state = "sent";
      fields.reset();
    } catch {
      root.dataset.state = "failed";
      if (submit) submit.disabled = false;
    }
  };

  fields.addEventListener("submit", onSubmit);
  return () => {
    fields.removeEventListener("submit", onSubmit);
  };
}

# Expansion increment 1: field messages, Alert, Badge, Table

Requirement R-14 and Phase 6 of the [completion plan](../completion-plan.md).
The owner selected these four from the candidate catalog in
[`components.md`](../components.md) on 2026-11-17. Nothing else in the catalog
is committed scope.

Each ships through the component procedure in `AGENTS.md`: stylesheet with
header, Astro component, HTML and TSX example, manifest entry, docs page,
tests, changelog. One pull request each, in this order.

## Audit: what already exists

| Candidate        | Closest existing thing                                      | Decision                                                                     |
| ---------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Field help/error | Nothing. `.field` has a label and a control only.           | New: children of the existing `.field` pattern, not a separate component.    |
| Alert            | Form's `.form_note-sent` / `.form_note-failed`, Form-only.  | New, general. Form's notes stay as they are; its page links to Alert.        |
| Badge            | Heading's `eyebrow-tag`: a label that introduces a heading. | New. A badge is inline status or a count, inside text, cards or table cells. |
| Table            | Rich text spaces a `<table>` but doesn't style it.          | New. Rich text tables pick up the same styles.                               |

## Shared addition: status tokens

Field errors, Alert and Badge need status colors. Four role tokens per theme,
each at least 4.5:1 against that theme's `--background`, `--background-2` and
`--background-3`, so they can color text:

| Token              | Light     | Dark      | Brand     |
| ------------------ | --------- | --------- | --------- |
| `--status-error`   | `#a1161b` | `#ff8f86` | `#8a1016` |
| `--status-success` | `#1d6b34` | `#6fd68c` | `#154a24` |
| `--status-warning` | `#7a4b00` | `#f2c14e` | `#5c3a00` |
| `--status-info`    | `#1f4f9a` | `#8ab4ff` | `#163f80` |

Lowest ratio: 4.64:1 (light success on `--background`). Color is never the
only signal: each status also has a word or an icon with a text alternative.

## 6a: Field help and error text

**Markup.** Help and error text must not be inside the `<label>`, or they
become part of the field's name. A field with messages is a `<div>`, with a
`<label for>`:

```html
<div class="field form-input">
  <label class="field-label text-style-main" for="email">Email</label>
  <input
    class="field-control text-style-main"
    id="email"
    type="email"
    aria-describedby="email-help email-error"
    aria-invalid="true"
  />
  <p class="field-help text-style-small" id="email-help">
    We only use it to reply.
  </p>
  <p class="field-error text-style-small" id="email-error">
    Enter an email address, like name@example.com.
  </p>
</div>
```

Fields without messages keep today's `<label class="field">` markup.

**Children.** `.field-help` (secondary text), `.field-error` (status-error
text, preceded by a decorative dot drawn in CSS).

**States.**

- `aria-invalid="true"` on the control: error border on the control. Set it,
  with the `.field-error` text, when you know the value is wrong (server
  validation, or your own script).
- `:user-invalid` on the control: the same error border after the visitor has
  interacted, from the browser's own validation. The browser shows its own
  message; `.field-error` is for messages you write.

**Accessibility.** `aria-describedby` lists the help and error ids, so screen
readers read them after the name. Render `.field-error` only while there is an
error: a hidden element referenced by `aria-describedby` is still read.

**Astro.** `help` and `error` props on Input, Textarea and Select. With either,
the component renders the `<div>` form with generated ids.

**Behavior.** None.

## 6b: Alert

```html
<div class="alert_wrap error" role="alert">
  <svg class="icon small alert_icon" aria-hidden="true">…</svg>
  <div class="alert_content margin-trim">
    <p class="alert_title text-style-main">Payment failed</p>
    <p class="text">Your card was declined. Try another card.</p>
  </div>
  <button
    class="button_wrap secondary close alert_dismiss"
    type="button"
    aria-label="Dismiss"
    data-alert-dismiss
  >
    …
  </button>
</div>
```

- **Variants:** `info` (default), `success`, `warning`, `error`. Background
  `--background-2`, a status-colored left border and icon, text in `--text`.
- **Roles:** none for an alert that's in the page from the start. `role="status"`
  for one added later that can wait; `role="alert"` for one added later that
  needs attention now. The docs explain the difference.
- **Dismiss (optional):** `behaviors/alert.ts`. `[data-alert-dismiss]` hides the
  alert and moves focus to the next focusable element after it, or to `<main>`.
  Emits `alert-dismiss`. Without the script, the button isn't shown.

## 6c: Badge

```html
<span class="badge success">Paid</span>
<span class="badge brand">New</span>
<span class="badge">12</span>
```

- **Variants:** neutral (default, `--background-3`), `brand` (`--brand-500`,
  `--brand-text`), and the four statuses: a tint of the status color behind
  `--text`, with a status-colored dot.
- **Accessibility:** the text is the label. A count badge next to an icon needs
  its meaning in text, for example `<span class="sr-only">unread messages</span>`.
  Status is never color alone: the word says it.
- Inline element; works in headings, buttons, card text and table cells.

## 6d: Table

```html
<div
  class="table_wrap"
  role="region"
  aria-labelledby="plans-caption"
  tabindex="0"
>
  <table class="table">
    <caption id="plans-caption">
      Plans
    </caption>
    <thead>
      <tr>
        <th scope="col">Plan</th>
        <th scope="col" class="is-numeric">Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Starter</th>
        <td class="is-numeric">$12</td>
      </tr>
    </tbody>
  </table>
</div>
```

- **Wrapper:** scrolls sideways when the table is wider than the page, and is
  focusable and labelled so keyboard users can scroll it.
- **Variants:** `striped` (alternate row background), `compact` (less padding).
- **Children/utilities:** `.is-numeric` aligns numbers to the end with tabular
  figures. `<caption>` is styled and optional to show (`sr-only` hides it).
- Rich text applies `.table` styles to a plain `<table>`.
- No sorting in this increment.

## Order and dependencies

1. 6a adds the status tokens (Foundations: Tokens and Themes pages updated).
2. 6b and 6c use them.
3. 6d needs nothing new.

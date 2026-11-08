/**
 * A canonical, framework-independent example. The same source powers the
 * documentation preview, the copyable code blocks and the TSX compile check.
 */
export interface ExampleDefinition {
  /** Stable identifier; also the preview route segment. */
  id: string;
  title: string;
  description: string;
  /** Canonical HTML, without the surrounding document. */
  html: string;
  /** Extra CSS needed beyond `constella.css`. Almost always absent. */
  css?: string;
  /** Equivalent generic React TSX, shown as text. */
  tsx: string;
  /** Shared behavior this example needs, from the closed `behaviors` list. */
  behaviorEntry?: "accordion" | "navbar";
  /** Iframe height in rem. */
  previewHeight: number;
}

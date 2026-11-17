/** One entry in a pagination list: a page number, or a gap. */
export type PageEntry = number | "gap";

/**
 * The pages to show: the first, the last, and `siblings` pages either side
 * of the current one. A gap that would hide a single page shows that page.
 */
export function pageWindow(
  current: number,
  total: number,
  siblings = 1,
): PageEntry[] {
  if (total < 1) return [];
  const shown = new Set<number>([1, total]);
  for (let page = current - siblings; page <= current + siblings; page++) {
    if (page >= 1 && page <= total) shown.add(page);
  }
  const pages = [...shown].sort((a, b) => a - b);
  const entries: PageEntry[] = [];
  pages.forEach((page, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined && page - previous === 2) entries.push(page - 1);
    else if (previous !== undefined && page - previous > 2) entries.push("gap");
    entries.push(page);
  });
  return entries;
}

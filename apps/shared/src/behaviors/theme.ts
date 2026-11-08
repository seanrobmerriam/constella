export type Theme = "light" | "dark" | "brand";
export type Preference = "light" | "dark" | null;
export type LockedTheme = "inherit" | Theme;

export const THEME_KEY = "constella-theme";

/**
 * Single source of precedence: a locked layout theme wins, then a saved
 * explicit choice, then the system preference.
 */
export function resolveTheme(
  preference: Preference,
  systemDark: boolean,
  lockedTheme: LockedTheme,
): Theme {
  if (lockedTheme !== "inherit") return lockedTheme;
  if (preference) return preference;
  return systemDark ? "dark" : "light";
}

export function readPreference(): Preference {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function writePreference(theme: "light" | "dark"): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage can be blocked; the choice then lasts for this page only.
  }
}

export function applyTheme(
  theme: Theme,
  root: HTMLElement = document.documentElement,
): void {
  for (const name of ["light", "dark", "brand"])
    root.classList.remove(`theme-${name}`);
  root.classList.add(`theme-${theme}`);
}

/**
 * Runs inline in the head, before first paint. It is serialised with
 * `toString()`, so it must stay self-contained: `resolve` and the storage
 * key are passed in rather than imported.
 */
export function bootstrapTheme(
  locked: string,
  resolve: typeof resolveTheme,
  key: string,
): void {
  if (locked !== "inherit") return;
  let preference: "light" | "dark" | null = null;
  try {
    const value = localStorage.getItem(key);
    if (value === "light" || value === "dark") preference = value;
  } catch {
    // Blocked storage falls back to the system preference.
  }
  const dark = matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = resolve(preference, dark, "inherit");
  const root = document.documentElement;
  root.classList.remove("theme-light", "theme-dark", "theme-brand");
  root.classList.add("theme-" + theme);
}

/** The inline script body for BaseHead. */
export function themeBootstrapSource(locked: LockedTheme): string {
  return `(${bootstrapTheme.toString()})(${JSON.stringify(locked)},${resolveTheme.toString()},${JSON.stringify(THEME_KEY)})`;
}

/** Wires `[data-theme-toggle]` buttons inside `root`. Returns cleanup. */
export function initThemeToggle(root: HTMLElement): () => void {
  const locked = document.documentElement.hasAttribute("data-theme-locked");
  const buttons = [
    ...root.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]"),
  ];
  if (locked || !buttons.length) return () => {};

  const current = (): "light" | "dark" =>
    document.documentElement.classList.contains("theme-dark")
      ? "dark"
      : "light";
  const sync = () => {
    for (const b of buttons)
      b.setAttribute("aria-pressed", String(current() === "dark"));
  };
  const onClick = () => {
    const next = current() === "dark" ? "light" : "dark";
    writePreference(next);
    applyTheme(next);
    sync();
  };
  for (const b of buttons) b.addEventListener("click", onClick);

  const media = matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => {
    if (readPreference()) return;
    applyTheme(resolveTheme(null, media.matches, "inherit"));
    sync();
  };
  media.addEventListener("change", onSystem);
  sync();

  return () => {
    for (const b of buttons) b.removeEventListener("click", onClick);
    media.removeEventListener("change", onSystem);
  };
}

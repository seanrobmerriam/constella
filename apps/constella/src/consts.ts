/** Site name. Appended to every page title and used as `og:site_name`. */
export const SITE_NAME = "Constella Framework";
/** Fallback meta description for pages that don't set their own. */
export const SITE_DESCRIPTION =
  "Constella is a customizable CSS framework built for efficiency, scalability, accessibility, and compatibility across frameworks.";
/** Canonical origin. Resolves canonical URLs, social images, and the sitemap. */
export const SITE_URL =
  import.meta.env.PUBLIC_SITE_URL ?? "http://localhost:4321";
/** BCP 47 locale tag used to format dates and numbers. */
export const SITE_LOCALE = "en-US";
/** Routes excluded from search and the sitemap. Surrounding slashes are ignored. */
export const NOINDEX_ROUTES: string[] = ["/404"];

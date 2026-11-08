export interface SiteLink {
  label: string;
  href: string;
}

export interface IconLink extends SiteLink {
  /** Key into the icon registry, e.g. `github`. */
  icon: string;
}

export type Brand =
  | { mode: "site-name" }
  | { mode: "custom"; text: string; logo?: { src: string; alt: string } };

export interface SearchConfig {
  /** Form action: where the GET request goes. */
  action: string;
  /** Query parameter name. */
  name: string;
  /** Accessible label for the search field. */
  label: string;
  placeholder?: string;
}

export interface NavbarConfig {
  brand: Brand;
  links: SiteLink[];
  search?: SearchConfig;
}

export interface FooterGroup {
  label: string;
  links: SiteLink[];
}

export interface FooterConfig {
  brand: Brand;
  description?: string;
  links: SiteLink[];
  groups: FooterGroup[];
  socialLinks: IconLink[];
  legalLinks: SiteLink[];
  /** Text after the year, e.g. the company name. */
  copyright: string;
}

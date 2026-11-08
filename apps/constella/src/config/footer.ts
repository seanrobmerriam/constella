import type { FooterConfig } from "@constella/shared/contracts/navigation.ts";
import { SITE_NAME } from "@/consts.ts";

export const footerConfig: FooterConfig = {
  brand: { mode: "site-name" },
  description: "A customizable CSS framework built for Astro.",
  links: [
    { label: "Home", href: "/" },
    { label: "Example Components", href: "/example-components" },
  ],
  groups: [
    {
      label: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "Example Components", href: "/example-components" },
      ],
    },
  ],
  socialLinks: [],
  legalLinks: [],
  copyright: SITE_NAME,
};

import type { NavbarConfig } from "@constella/shared/contracts/navigation.ts";

export const navbarConfig: NavbarConfig = {
  brand: { mode: "site-name" },
  links: [
    { label: "Home", href: "/" },
    { label: "Example Components", href: "/example-components" },
  ],
  search: {
    action: "/search-example",
    name: "q",
    label: "Search",
    placeholder: "Search",
  },
};

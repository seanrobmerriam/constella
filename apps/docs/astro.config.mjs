// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? "http://localhost:4322",
  integrations: [
    starlight({
      title: "Constella",
      description:
        "Documentation for Constella: portable CSS, optional behavior, and equivalent HTML and React examples.",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/seanrobmerriam/constella",
        },
      ],
      customCss: ["./src/styles/docs.css"],
      sidebar: [
        {
          label: "Getting started",
          items: [
            { label: "Introduction", slug: "getting-started/introduction" },
            { label: "Installation", slug: "getting-started/installation" },
          ],
        },
        {
          label: "Components",
          items: [
            { label: "Button", slug: "components/button" },
            { label: "InputWrapper", slug: "components/input-wrapper" },
            { label: "Details", slug: "components/details" },
            { label: "Accordion", slug: "components/accordion" },
            { label: "Navbar", slug: "components/navbar" },
            { label: "Footer", slug: "components/footer" },
          ],
        },
      ],
    }),
  ],
});

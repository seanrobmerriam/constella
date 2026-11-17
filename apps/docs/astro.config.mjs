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
            {
              label: "Browser support",
              slug: "getting-started/browser-support",
            },
          ],
        },
        {
          label: "Foundations",
          items: [{ autogenerate: { directory: "foundations" } }],
        },
        {
          label: "Components",
          items: [{ autogenerate: { directory: "components" } }],
        },
        {
          label: "Integrations",
          items: [{ autogenerate: { directory: "integrations" } }],
        },
        { label: "Migration", slug: "migration" },
      ],
    }),
  ],
});

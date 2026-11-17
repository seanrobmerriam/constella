/// <reference types="vite/client" />

// The stylesheet's URL, resolved by the vite.config.ts alias.
declare module "constella/constella.css?url" {
  const href: string;
  export default href;
}

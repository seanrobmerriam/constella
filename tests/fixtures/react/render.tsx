// Renders every canonical TSX example on the server. Proves the copied source
// compiles and does not touch browser globals during server rendering.
import { renderToString } from "react-dom/server";
import { ButtonExample } from "../../../apps/shared/src/examples/button/Example";
import { InputWrapperExample } from "../../../apps/shared/src/examples/input-wrapper/Example";
import { DetailsExample } from "../../../apps/shared/src/examples/details/Example";
import { AccordionExample } from "../../../apps/shared/src/examples/accordion/Example";
import { NavbarExample } from "../../../apps/shared/src/examples/navbar/Example";
import { FooterExample } from "../../../apps/shared/src/examples/footer/Example";

const rendered = {
  button: renderToString(<ButtonExample />),
  inputWrapper: renderToString(<InputWrapperExample />),
  details: renderToString(<DetailsExample />),
  accordion: renderToString(<AccordionExample />),
  navbar: renderToString(<NavbarExample />),
  footer: renderToString(<FooterExample year={2026} />),
};

for (const [name, html] of Object.entries(rendered)) {
  if (!html.includes("<")) throw new Error(`${name} rendered nothing`);
}
console.log(`rendered ${Object.keys(rendered).length} React examples`);

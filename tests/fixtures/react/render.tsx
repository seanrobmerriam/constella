// Renders every canonical TSX example on the server. Proves the copied source
// compiles and does not touch browser globals during server rendering.
import { renderToString } from "react-dom/server";
import { ButtonExample } from "../../../apps/shared/src/examples/button/Example";
import { InputWrapperExample } from "../../../apps/shared/src/examples/input-wrapper/Example";
import { DetailsExample } from "../../../apps/shared/src/examples/details/Example";
import { AccordionExample } from "../../../apps/shared/src/examples/accordion/Example";
import { NavbarExample } from "../../../apps/shared/src/examples/navbar/Example";
import { FooterExample } from "../../../apps/shared/src/examples/footer/Example";
import { SectionExample } from "../../../apps/shared/src/examples/section/Example";
import { ContentWrapperExample } from "../../../apps/shared/src/examples/content-wrapper/Example";
import { GridExample } from "../../../apps/shared/src/examples/grid/Example";
import { HeadingExample } from "../../../apps/shared/src/examples/heading/Example";
import { ParagraphExample } from "../../../apps/shared/src/examples/paragraph/Example";
import { RichTextExample } from "../../../apps/shared/src/examples/rich-text/Example";
import { ImgExample } from "../../../apps/shared/src/examples/img/Example";
import { VideoExample } from "../../../apps/shared/src/examples/video/Example";
import { IconExample } from "../../../apps/shared/src/examples/icon/Example";
import { OverlayExample } from "../../../apps/shared/src/examples/overlay/Example";
import { CardExample } from "../../../apps/shared/src/examples/card/Example";
import { FormExample } from "../../../apps/shared/src/examples/form/Example";
import { FieldsetExample } from "../../../apps/shared/src/examples/fieldset/Example";
import { InputExample } from "../../../apps/shared/src/examples/input/Example";
import { TextareaExample } from "../../../apps/shared/src/examples/textarea/Example";
import { SelectExample } from "../../../apps/shared/src/examples/select/Example";
import { ChoiceExample } from "../../../apps/shared/src/examples/choice/Example";
import { RangeExample } from "../../../apps/shared/src/examples/range/Example";
import { SkipExample } from "../../../apps/shared/src/examples/skip/Example";
import { DropdownExample } from "../../../apps/shared/src/examples/dropdown/Example";
import { ModalExample } from "../../../apps/shared/src/examples/modal/Example";
import { TabsExample } from "../../../apps/shared/src/examples/tabs/Example";
import { AlertExample } from "../../../apps/shared/src/examples/alert/Example";
import { AvatarExample } from "../../../apps/shared/src/examples/avatar/Example";
import { BadgeExample } from "../../../apps/shared/src/examples/badge/Example";
import { BreadcrumbsExample } from "../../../apps/shared/src/examples/breadcrumbs/Example";
import { TableExample } from "../../../apps/shared/src/examples/table/Example";
import { FieldMessageExample } from "../../../apps/shared/src/examples/field-message/Example";
import { SliderExample } from "../../../apps/shared/src/examples/slider/Example";
import { MarqueeExample } from "../../../apps/shared/src/examples/marquee/Example";

const rendered = {
  button: renderToString(<ButtonExample />),
  inputWrapper: renderToString(<InputWrapperExample />),
  details: renderToString(<DetailsExample />),
  accordion: renderToString(<AccordionExample />),
  navbar: renderToString(<NavbarExample />),
  footer: renderToString(<FooterExample year={2026} />),
  section: renderToString(<SectionExample />),
  contentWrapper: renderToString(<ContentWrapperExample />),
  grid: renderToString(<GridExample />),
  heading: renderToString(<HeadingExample />),
  paragraph: renderToString(<ParagraphExample />),
  richText: renderToString(<RichTextExample />),
  img: renderToString(<ImgExample />),
  video: renderToString(<VideoExample />),
  icon: renderToString(<IconExample />),
  overlay: renderToString(<OverlayExample />),
  card: renderToString(<CardExample />),
  form: renderToString(<FormExample />),
  fieldset: renderToString(<FieldsetExample />),
  input: renderToString(<InputExample />),
  textarea: renderToString(<TextareaExample />),
  select: renderToString(<SelectExample />),
  choice: renderToString(<ChoiceExample />),
  range: renderToString(<RangeExample />),
  skip: renderToString(<SkipExample />),
  dropdown: renderToString(<DropdownExample />),
  modal: renderToString(<ModalExample />),
  tabs: renderToString(<TabsExample />),
  fieldMessage: renderToString(<FieldMessageExample />),
  alert: renderToString(<AlertExample />),
  avatar: renderToString(<AvatarExample />),
  badge: renderToString(<BadgeExample />),
  breadcrumbs: renderToString(<BreadcrumbsExample />),
  table: renderToString(<TableExample />),
  slider: renderToString(<SliderExample />),
  marquee: renderToString(<MarqueeExample />),
};

for (const [name, html] of Object.entries(rendered)) {
  if (!html.includes("<")) throw new Error(`${name} rendered nothing`);
}
console.log(`rendered ${Object.keys(rendered).length} React examples`);

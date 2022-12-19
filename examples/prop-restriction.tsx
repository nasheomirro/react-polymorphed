import React, { ElementType } from "react";
import { PolymorphicComponent, Restrict } from "react-polymorphed";

const Button: PolymorphicComponent<
  "button",
  {},
  Restrict<ElementType, { className: string }>
> = ({ as: As = "button", ...props }) => {
  return <As {...props} />;
};

<Button />;
<Button as={"a"} />;
<Button as="div" />;
// @ts-expect-error
<Button as={() => null} />; // error!

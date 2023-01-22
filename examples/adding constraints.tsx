import React from "react";
import { OnlyAs, PolymorphicComponent } from "index";

const Button: PolymorphicComponent<"button", {}, OnlyAs<"button" | "a">> = ({
  as: As = "button",
  ...props
}) => {
  return <As {...props} />;
};

<Button />;
<Button as="a" />;
// @ts-expect-error
<Button as="div" />; // error!

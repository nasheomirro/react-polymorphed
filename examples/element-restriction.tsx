import React from "react";
import { PolymorphicComponent, Restrict } from "index";

const Button: PolymorphicComponent<"button", {}, Restrict<"button" | "a">> = ({
  as: As = "button",
  ...props
}) => {
  return <As {...props} />;
};

<Button />;
<Button as="a" />;
// @ts-expect-error
<Button as="div" />; // error!

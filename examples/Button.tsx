import React from "react";
import { PolymorphicComponent } from "../src";

const Button: PolymorphicComponent<"button", {}> = ({
  as: As = "button",
  ...props
}) => {
  return <As {...props} />;
};

<Button as="button" />;

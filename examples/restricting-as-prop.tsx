import React, { ElementType } from "react";
import { PolymorphicComponent, Restrict } from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

const Button: PolymorphicComponent<
  "button",
  Props,
  Restrict<{ className?: string }>
> = ({ as, size, ...props }) => {
  const Element: ElementType = as || "button";
  return <Element {...props} />;
};

import React, { ElementType } from "react";
import { forwardRef, OnlyAs } from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

const ButtonOrLink = forwardRef<"button", Props, OnlyAs<"button" | "a">>(
  ({ as: As = "button", size, ...props }, ref) => {
    return <As ref={ref} {...props} />
  }
);

<ButtonOrLink as="a" />;
<ButtonOrLink as="div" />; // error!
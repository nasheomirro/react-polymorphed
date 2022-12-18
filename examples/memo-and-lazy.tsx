import React from "react";
import {
  PolymorphicComponent,
  PolyMemoExoticComponent,
  PolyLazyExoticComponent,
} from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

const Button: PolymorphicComponent<"button", Props> = ({
  as: As = "button",
  size,
  ...props
}) => {
  return <As {...props} />;
};

const MemoButton: PolyMemoExoticComponent<"button", Props> = React.memo(Button);

// in another file:
const LazyButton: PolyLazyExoticComponent<"button", Props> = React.lazy(
  async () => import("./Button")
);

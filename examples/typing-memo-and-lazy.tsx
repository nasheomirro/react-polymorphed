import React from "react";
import {
  PolymorphicComponent,
  PolyMemoExoticComponent,
  forwardRef,
  PolyForwardMemoExoticComponent,
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

const RefButton = forwardRef<"button", Props>(
  ({ as: As = "button", size, ...props }) => {
    return <As {...props} />;
  }
);

const MemoButton: PolyMemoExoticComponent<"button", Props> = React.memo(Button);

// in another file:
// const LazyButton: PolyLazyExoticComponent<"button", Props> = React.lazy(
//   async () => import("./Button")
// );

// use the correct type!
const MemoRefButton: PolyForwardMemoExoticComponent<"button", Props> =
  React.memo(RefButton);

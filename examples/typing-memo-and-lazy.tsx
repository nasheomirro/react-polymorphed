import React from "react";
import {
  PolymorphicComponent,
  PolyMemoExoticComponent,
  PolyRefFunction,
  PolyForwardMemoExoticComponent,
} from "react-polymorphed";

const polyRef = React.forwardRef as PolyRefFunction;

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

const RefButton = polyRef<"button", Props>(
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

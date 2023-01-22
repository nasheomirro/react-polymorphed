import React from "react";
import {
  PolymorphicComponent,
  PolyLazyComponent,
  PolyMemoComponent,
  PolyRefFunction,
  PolyForwardMemoComponent,
} from "index";

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

const MemoButton: PolyMemoComponent<"button", Props> = React.memo(Button);

// in another file:
const LazyButton: PolyLazyComponent<"button", Props> = React.lazy(
  // @ts-expect-error
  async () => import("./Button")
);

// use the correct type!
const MemoRefButton: PolyForwardMemoComponent<"button", Props> =
  React.memo(RefButton);

import React, { useRef } from "react";
import { forwardRef, PolyForwardMemoExoticComponent } from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

const RefButton = forwardRef<"button", Props>(
  ({ as: As = "button", size, ...props }) => {
    return <As {...props} />;
  }
);

// use the correct type!
const MemoRefButton: PolyForwardMemoExoticComponent<"button", Props> =
  React.memo(RefButton);

const Example = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <RefButton ref={buttonRef} />
      {/* error! */}
      <RefButton as="div" ref={buttonRef} />
    </>
  );
};

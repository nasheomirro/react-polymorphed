import React, { useRef } from "react";
import { PolyRefFunction } from "index";

const polyforwardRef = React.forwardRef as PolyRefFunction;

type Props = {
  size?: "small" | "large";
};

const Button = polyforwardRef<"button", Props>(
  ({ as: As = "button", size, ...props }) => {
    return <As {...props} />;
  }
);

const Example = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={buttonRef} />
      {/* @ts-expect-error */}
      <Button as="div" ref={buttonRef} />
    </>
  );
};

import React, { useRef } from "react";
import { PolyRefFunction } from "index";

const polyforwardRef = React.forwardRef as PolyRefFunction;

type Props = {
  size?: "small" | "large";
};

const Button = polyforwardRef<"button", Props>(
  ({ as: As = "button", size, ...props }, ref) => {
    return <As ref={ref} {...props} />;
  }
);

const Example = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button onClick={e => e} ref={buttonRef} />
      {/* @ts-expect-error */}
      <Button as="div" ref={buttonRef} />
    </>
  );
};

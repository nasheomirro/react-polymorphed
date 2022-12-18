import React, { useRef } from "react";
import { forwardRef } from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

const Button = forwardRef<"button", Props>(
  ({ as: As = "button", size, ...props }) => {
    return <As {...props} />;
  }
);

const Example = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={buttonRef} />
      {/* error! */}
      <Button as="div" ref={buttonRef} />
    </>
  );
};

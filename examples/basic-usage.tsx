import React from "react";
import { PolymorphicComponent } from "index";

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

<Button type="submit" size="small"> I am a button!</Button>;
<Button as={"a"} href="" size="large"> I became an achor!</Button>;
// @ts-expect-error
<Button href="">I cannot have an href!</Button>; //error
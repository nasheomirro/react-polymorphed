import React, { ElementType } from "react";
import { PolymorphicComponent, PolymorphicPropsWithoutRef } from "./src";


const Button = <T extends ElementType | {(): null} = 'button'>({
  as: As = "a",
  ...props
}: PolymorphicPropsWithoutRef<T, {}, "button" | "a" | {(): null}>) => {
  return <As {...props} />;
};

<Button as="a" />;

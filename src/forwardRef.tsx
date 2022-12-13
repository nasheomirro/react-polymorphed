import React, { ComponentPropsWithoutRef } from "react";
import { As, PolymorphicComponent, RightJoinProps } from "./types";

function forwardRef<Default extends As, Props extends object = {}>(
  component: React.ForwardRefRenderFunction<
    any,
    RightJoinProps<ComponentPropsWithoutRef<Default>, Props> & { as?: As }
  >
) {
  return React.forwardRef(component) as unknown as PolymorphicComponent<
    Default,
    Props
  >;
}

export default forwardRef;

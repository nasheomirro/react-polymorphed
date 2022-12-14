import React, {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardRefRenderFunction,
} from "react";

import { $Merge, PolyForwardExoticComponent, WithAs } from "./types";

/** 
 * React.forwardRef but typed in a way to support Polymorphic Components,
 * apart from typing it's just forwardRef with an extra call stack on top.
 */
const forwardRef = <
  Default extends ElementType = ElementType,
  P extends object = {},
  Loose extends string = "loose"
>(
  Component: ForwardRefRenderFunction<
    any,
    Loose extends "loose"
      ? $Merge<ComponentPropsWithoutRef<Default>, WithAs<P>>
      : WithAs<P>
  >
) => {
  return React.forwardRef(Component) as PolyForwardExoticComponent<
    Default,
    P
  >;
};

export default forwardRef;
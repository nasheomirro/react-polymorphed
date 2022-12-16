// Stolen from chakra-ui
import React, { ElementType, ForwardRefRenderFunction } from "react";
import { PolyForwardExoticComponent, WithAs } from "../types";

/**
 * React.forwardRef but typed in a way to help create polymorphic components,
 * note that you should only use this for that purpose
 */
function forwardRef<
  Default extends OnlyAs,
  P extends object = {},
  OnlyAs extends ElementType = ElementType
>(Component: ForwardRefRenderFunction<any, WithAs<P, OnlyAs>>) {
  return React.forwardRef(Component) as unknown as PolyForwardExoticComponent<
    Default,
    P,
    OnlyAs
  >;
}

export default forwardRef;

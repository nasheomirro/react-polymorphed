// Stolen from chakra-ui
import React, { ElementType, ForwardRefRenderFunction } from "react";
import { PolyForwardExoticComponent, WithAs } from "../types";

/**
 * React.forwardRef but typed in a way to support Polymorphic Components,
 * apart from typing it's just forwardRef with an extra call stack on top.
 * Note that you should only use this for dealing with Polymorphic Components.
 */
function forwardRef<
  Default extends ElementType = ElementType,
  P extends object = {}
>(Component: ForwardRefRenderFunction<any, WithAs<P>>) {
  return React.forwardRef(Component) as PolyForwardExoticComponent<Default, P>;
}

export default forwardRef;

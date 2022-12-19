import React, { ForwardRefRenderFunction } from "react";
import { PolyForwardExoticComponent, Restrict, WithAs } from "./types";

/**
 * React.forwardRef but typed in a way to help create polymorphic components,
 * note that you should only use this for that purpose
 */
function forwardRef<
  Default extends Restriction[0],
  Props extends object = {},
  Restriction extends Restrict = Restrict
>(Component: ForwardRefRenderFunction<any, WithAs<Props, Restriction[0]>>) {
  return React.forwardRef(Component) as unknown as PolyForwardExoticComponent<
    Default,
    Props,
    Restriction
  >;
}

export default forwardRef;

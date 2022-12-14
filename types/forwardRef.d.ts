import React, { ComponentPropsWithoutRef, ForwardRefRenderFunction } from "react";
import { $Merge, PolyForwardExoticComponent, WithAs } from "./types";
/**
 * React.forwardRef but typed in a way to support Polymorphic Components,
 * apart from typing it's just forwardRef with an extra call stack on top.
 */
declare const forwardRef: <Default extends React.ElementType<any> = React.ElementType<any>, P extends object = {}, Loose extends string = "loose">(Component: React.ForwardRefRenderFunction<any, Loose extends "loose" ? $Merge<React.PropsWithoutRef<React.ComponentProps<Default>>, WithAs<P, React.ElementType<any>>> : WithAs<P, React.ElementType<any>>>) => PolyForwardExoticComponent<Default, P>;
export default forwardRef;

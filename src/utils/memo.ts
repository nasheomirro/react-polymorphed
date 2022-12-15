import React, { ElementType } from "react";
import {
  PolyForwardExoticComponent,
  PolyForwardMemoExoticComponent,
  PolyMemoExoticComponent,
  PolymorphicComponent,
  PolymorphicComponentWithRef,
} from "../types";

type propsAreEqual<P> = (
  prevProps: Readonly<P>,
  nextProps: Readonly<P>
) => boolean;

/**
 * React.memo but with type-support for polymorphic components.
 */
function memo<Default extends ElementType, Props extends object = {}>(
  Component: PolymorphicComponent<Default, Props>,
  propsAreEqual?: propsAreEqual<Props>
): PolyMemoExoticComponent<Default, Props>;
function memo<Default extends ElementType, Props extends object = {}>(
  Component: PolyForwardExoticComponent<Default, Props>,
  propsAreEqual?: propsAreEqual<Props>
): PolyForwardMemoExoticComponent<Default, Props>;
function memo<Default extends ElementType, Props extends object = {}>(
  Component:
    | PolymorphicComponent<Default, Props>
    | PolymorphicComponentWithRef<Default, Props>,
  propsAreEqual?: propsAreEqual<Props>
) {
  return React.memo(Component, propsAreEqual);
}

export default memo;

import { ElementType } from "react";
import { PolyLazyExoticComponent, PolymorphicComponent } from "../types";

type Factory<T> = () => Promise<T>;

function lazy<Default extends ElementType, Props extends object = {}>(
  factory: Factory<PolymorphicComponent<Default, Props>>
): PolyLazyExoticComponent<Default, Props>;

function lazy<Default extends ElementType, Props extends object = {}>(
  factory: Factory<PolymorphicComponent<Default, Props>>
): PolyLazyExoticComponent<Default, Props>;

export default lazy;

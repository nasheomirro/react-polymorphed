import React, { ElementType } from "react";

export type Merge<A, B extends object = {}> = Omit<A, keyof B> & B;

/** Adds `as` property as an optional prop if Props doesn't already have the `as` property. */
export type WithAs<
  Props extends object = {},
  Type extends ElementType = ElementType
> = { as?: Type } & Props;

export type MergeWithAs<
  ComponentProps extends object,
  AsProps extends object,
  UserProps extends object = {},
  DefaultComponent extends ElementType = ElementType,
  AsComponent extends ElementType = ElementType
> = AsComponent extends DefaultComponent
  ? Merge<ComponentProps, WithAs<UserProps, AsComponent>> // if `as` is not provided or is the same as default
  : Merge<AsProps, WithAs<UserProps, AsComponent>>; // `as` is different from default

export type PolymorphicComponent<
  Default extends ElementType,
  Props extends object = {}
> = {
  <Component extends ElementType = any>(
    props: MergeWithAs<
      React.ComponentPropsWithoutRef<Default>,
      React.ComponentPropsWithoutRef<Component>,
      Props,
      Default,
      Component
    >
  ): JSX.Element;
};

import {
  Component,
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementType,
  ForwardRefExoticComponent,
  LazyExoticComponent,
  MemoExoticComponent,
  NamedExoticComponent,
  PropsWithoutRef,
  PropsWithRef,
  ReactElement,
  RefAttributes,
} from "react";

export type Merge<A, B> = Omit<A, keyof B> & B;

/** Adds `as` property as an optional prop if Props doesn't already have the `as` property. */
export type WithAs<
  Props extends object = {},
  Type extends ElementType = ElementType
> = { as?: Type } & Props;

export type PolymorphicPropsWithoutRef<
  Component extends ElementType,
  Props extends object = {}
> = Merge<ComponentPropsWithoutRef<Component>, WithAs<Props, Component>>;

/**
 * makes components polymorphic given the default prop type
 */
export type PolymorphicComponent<
  Default extends ElementType = ElementType,
  Props extends object = {}
> = {
  <Component extends ElementType = Default>(
    props: PolymorphicPropsWithoutRef<Component, Props>
  ): ReactElement | null;
};

export type PolymorphicProps<
  DefaultProps extends object = {},
  ComponentProps extends object = {},
  Default extends ElementType = ElementType,
  Component extends ElementType = ElementType,
  Props extends object = {}
> = Merge<
  Component extends Default ? DefaultProps : ComponentProps,
  WithAs<Props, Component>
>;

// Don't ask me how this works either.
/**
 * at definition, function arguments becomes the props of the default
 * component passed. **WARNING:** Though it is incorrect, as long as you only use
 * props which will be unaffected by the changes of `as` then it should be okay.
 */
export type LoosePolymorphicComponent<
  Default extends ElementType = ElementType,
  Props extends object = {}
> = {
  <Component extends ElementType = Default>(
    props: PolymorphicProps<
      ComponentPropsWithoutRef<Default>,
      ComponentPropsWithoutRef<Component>,
      Default,
      Component,
      Props
    >
  ): ReactElement | null;
};

// for some reason, removing PropsWithRef<T> from this type makes this a lot faster.
// don't ask me how, it just does. The PropsWithRef<T> type was just lifted to the top.
//
// I'm guessing its because its not being cached by typescript and also its been
// placed inside a conditional (`PropsWithRef<ComponentProps<T>>`), typescript is going
// through it for every element type.
export type _ComponentPropsWithRef<T extends ElementType> = T extends new (
  props: infer P
) => Component<any, any>
  ? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
  : ComponentProps<T>;

/**
 * adds the ref attribute to PolymorphicComponent, usually you shouldn't
 * have to use this as you can just use `forwardRef()`
 */
export type PolymorphicComponentWithRef<
  Default extends ElementType = ElementType,
  Props extends object = {}
> = {
  <Component extends ElementType = Default>(
    props: PolymorphicProps<
      PropsWithRef<_ComponentPropsWithRef<Default>>,
      PropsWithRef<_ComponentPropsWithRef<Component>>,
      Default,
      Component,
      Props
    >
  ): ReactElement | null;
};

// ----------------------------------------------
// EXOTIC COMPONENTS
//
// $Merge below isn't actually doing anything except for removing the call signatures off of
// the first type passed (Omit<A, never> & B), then we replace the call signature to our generic
// function.
// ----------------------------------------------

export type PolyForwardExoticComponent<
  Default extends ElementType,
  Props extends object = {}
> = Merge<
  ForwardRefExoticComponent<{}>,
  PolymorphicComponentWithRef<Default, Props>
>;

export type PolyNamedExoticComponent<
  Default extends ElementType,
  Props extends object = {}
> = Merge<NamedExoticComponent<{}>, PolymorphicComponent<Default, Props>>;

export type PolyMemoExoticComponent<
  Default extends ElementType,
  Props extends object = {}
> = Merge<
  MemoExoticComponent<any>,
  PolymorphicComponentWithRef<Default, Props>
>;

export type PolyLazyExoticComponent<
  Default extends ElementType,
  Props extends object = {}
> = Merge<
  LazyExoticComponent<any>,
  PolymorphicComponentWithRef<Default, Props>
>;

import {
  Component,
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
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

export type $Merge<A, B> = Omit<A, keyof B> & B;

// https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
export type $Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

/** Adds `as` property as an optional prop if Props doesn't already have the `as` property. */
export type WithAs<
  Props extends object = {},
  Type extends ElementType = ElementType
> = { as?: Type } & Props;

type ComponentPropsWithRef<T extends ElementType> =
  T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : T extends (props: P) => ReactElement<any, any> | null
    ? PropsWithRef<ComponentProps<T>>
    : T extends new (props: infer P) => Component<any, any>
    ? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
    : PropsWithRef<ComponentProps<T>>;

export type PolymorphicPropsWithoutRef<
  Component extends ElementType,
  Props extends object = {}
> = $Merge<ComponentPropsWithoutRef<Component>, WithAs<Props, Component>>;

export type PolymorphicPropsWithRef<
  Component extends ElementType = ElementType,
  Props extends object = {}
> = $Merge<PropsWithRef<ComponentProps<Component>>, WithAs<Props, Component>>;

/**
 * makes components polymorphic given the default prop type,
 */
export type PolymorphicComponent<
  Default extends ElementType = ElementType,
  Props extends object = {}
> = {
  <Component extends ElementType = Default>(
    props: PolymorphicPropsWithoutRef<Component, Props>
  ): ReactElement | null;
};

/**
 * adds the ref attribute to PolymorphicComponent, usually you shouldn't
 * have to use this when you can just use `forwardRef()`
 */
export type PolymorphicComponentWithRef<
  Default extends ElementType = ElementType,
  Props extends object = {}
> = {
  <Component extends ElementType = Default>(
    props: PolymorphicPropsWithRef<Component, Props>
  ): ReactElement | null;
};

export type ManualPolymorphicProps<
  DefaultProps extends object = {},
  ComponentProps extends object = {},
  Default extends ElementType = ElementType,
  Component extends ElementType = ElementType,
  Props extends object = {}
> = $Merge<
  Component extends Default ? DefaultProps : ComponentProps,
  WithAs<Props, Component>
>;

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
    props: ManualPolymorphicProps<
      ComponentPropsWithoutRef<Default>,
      ComponentPropsWithoutRef<Component>,
      Default,
      Component,
      Props
    >
  ): ReactElement | null;
};

/**
 * adds the ref attribute to `LoosePolymorphicComponent`, usually you shouldn't
 * have to use this when you can use `forwardRef()`.
 */
export type LoosePolymorphicComponentWithRef<
  Default extends ElementType = ElementType,
  Props extends object = {}
> = {
  <Component extends ElementType = Default>(
    props: ManualPolymorphicProps<
      PropsWithRef<ComponentProps<Default>>,
      PropsWithRef<ComponentProps<Component>>,
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
> = $Merge<
  ForwardRefExoticComponent<{}>,
  PolymorphicComponentWithRef<Default, Props>
>;

export type PolyNamedExoticComponent<
  Default extends ElementType,
  Props extends object = {}
> = $Merge<NamedExoticComponent<{}>, PolymorphicComponent<Default, Props>>;

export type PolyMemoExoticComponent<
  Default extends ElementType,
  Props extends object = {}
> = $Merge<
  MemoExoticComponent<any>,
  PolymorphicComponentWithRef<Default, Props>
>;

export type PolyLazyExoticComponent<
  Default extends ElementType,
  Props extends object = {}
> = $Merge<
  LazyExoticComponent<any>,
  PolymorphicComponentWithRef<Default, Props>
>;

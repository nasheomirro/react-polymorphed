import * as React from "react";

// ----------------------------------------------
// utility types
// ----------------------------------------------

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

type Merge<A, B> = Omit<A, keyof B> & B;
type DistributiveMerge<A, B> = DistributiveOmit<A, keyof B> & B;

export type OnlyAs<T extends React.ElementType> =
  | T
  // makes sure `ComponentProps<T>` are unknown
  | (() => React.ReactElement<never>);

export type AsProps<
  Component extends React.ElementType,
  PermanentProps extends object,
  ComponentProps extends object
> = DistributiveMerge<ComponentProps, PermanentProps & { as?: Component }>;

/**
 * make typescript not check PropsWithRef<P> individually.
 * more info here: https://dev.to/nasheomirro/create-fast-type-safe-polymorphic-components-with-the-as-prop-ncn
 */
export type FastComponentPropsWithRef<T extends React.ElementType> =
  React.PropsWithRef<
    T extends new (props: infer P) => React.Component<any, any>
      ? React.PropsWithoutRef<P> & React.RefAttributes<InstanceType<T>>
      : React.ComponentProps<T>
  >;

export type PolymorphicPropsWithoutRef<
  Component extends React.ElementType,
  PermanentProps extends object
> = AsProps<
  Component,
  PermanentProps,
  React.ComponentPropsWithoutRef<Component>
>;

export type PolymorphicPropsWithRef<
  Component extends React.ElementType,
  PermanentProps extends object
> = AsProps<Component, PermanentProps, FastComponentPropsWithRef<Component>>;

// ----------------------------------------------
// call signatures
// ----------------------------------------------

export type PolymorphicWithoutRef<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends React.ElementType = React.ElementType
> = <T extends OnlyAs = Default>(
  props: AsProps<T, Props, React.ComponentPropsWithoutRef<T>>
) => React.ReactElement | null;

export type PolymorphicWithRef<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends React.ElementType = React.ElementType
> = <T extends OnlyAs = Default>(
  props: AsProps<T, Props, FastComponentPropsWithRef<T>>
) => React.ReactElement | null;

// ----------------------------------------------
// component types
// - note that Merge here is removing the default call signature.
// ----------------------------------------------

export type PolymorphicComponent<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends React.ElementType = React.ElementType
>  = PolymorphicWithoutRef<Default, Props, OnlyAs> & React.ComponentType<Props>;

export type PolyMemoComponent<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends React.ElementType = React.ElementType
> = Merge<
  React.MemoExoticComponent<React.ComponentType<Props>>,
  PolymorphicWithoutRef<Default, Props, OnlyAs>
>;

export type PolyLazyComponent<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends React.ElementType = React.ElementType
> = Merge<
  React.LazyExoticComponent<React.ComponentType<Props>>,
  PolymorphicWithoutRef<Default, Props, OnlyAs>
>;

export type PolyForwardComponent<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends React.ElementType = React.ElementType
> = Merge<
  React.ForwardRefExoticComponent<
    Merge<FastComponentPropsWithRef<Default>, Props & { as?: Default }>
  >,
  PolymorphicWithRef<Default, Props, OnlyAs>
>;

export type PolyForwardMemoComponent<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends React.ElementType = React.ElementType
> = Merge<
  React.MemoExoticComponent<React.ComponentType<any>>,
  PolymorphicWithRef<Default, Props, OnlyAs>
>;

export type PolyForwardLazyComponent<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends React.ElementType = React.ElementType
> = Merge<
  React.LazyExoticComponent<React.ComponentType<any>>,
  PolymorphicWithRef<Default, Props, OnlyAs>
>;

// ----------------------------------------------
// function types
// - got the idea from chakra-ui, cast at your own risk.
// ----------------------------------------------

export type PolyRefFunction = <
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends React.ElementType = React.ElementType
>(
  Component: React.ForwardRefRenderFunction<any, Props & { as?: OnlyAs }>
) => PolyForwardComponent<Default, Props, OnlyAs>;

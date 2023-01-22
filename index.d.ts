import * as React from "react";

export {};

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
  Default extends React.ElementType,
  Component extends React.ElementType,
  PermanentProps extends object,
  DefaultProps extends object,
  ComponentProps extends object
> =
  /**
   * doing this makes sure typescript infers events. Without the
   * extends check typescript won't do an additional inference phase,
   * but somehow we can trick typescript into doing so. Note that the check needs to be relating
   * to the generic for this to work.
   */
  any extends Component
    ? /**
       * Merge<ComponentProps, OwnProps & { as?: Component }> looks sufficient,
       * but typescript won't be able to infer events on components that haven't
       * explicitly provided a value for the As generic or haven't provided an `as` prop.
       * We could do the same trick again like the above but discriminating unions should be
       * enough as we don't have to compute the value for the default.
       *
       * Also note that Merging here is needed not just for the purpose of
       * overriding props but also because somehow it is needed to get the props correctly,
       * Merge does clone the first object so that might have something to do with it.
       */
      | DistributiveMerge<DefaultProps, PermanentProps & { as?: Default }>
        | DistributiveMerge<ComponentProps, PermanentProps & { as?: Component }>
    : never;

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
  Default extends React.ElementType,
  Component extends React.ElementType,
  PermanentProps extends object
> = AsProps<
  Default,
  Component,
  PermanentProps,
  React.ComponentPropsWithoutRef<Default>,
  React.ComponentPropsWithoutRef<Component>
>;

export type PolymorphicPropsWithRef<
  Default extends React.ElementType,
  Component extends React.ElementType,
  PermanentProps extends object
> = AsProps<
  Default,
  Component,
  PermanentProps,
  React.ComponentPropsWithoutRef<Default>,
  React.ComponentPropsWithoutRef<Component>
>;

// ----------------------------------------------
// call signatures
// ----------------------------------------------

export type PolymorphicWithoutRef<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends React.ElementType = React.ElementType
> = <T extends OnlyAs = Default>(
  props: AsProps<
    Default,
    T,
    Props,
    React.ComponentPropsWithoutRef<Default>,
    React.ComponentPropsWithoutRef<T>
  >
) => React.ReactElement | null;

export type PolymorphicWithRef<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends React.ElementType = React.ElementType
> = <T extends OnlyAs = Default>(
  props: AsProps<
    Default,
    T,
    Props,
    FastComponentPropsWithRef<Default>,
    FastComponentPropsWithRef<T>
  >
) => React.ReactElement | null;

// ----------------------------------------------
// component types
// - note that Merge here is removing the default call signature.
// ----------------------------------------------

export interface PolymorphicComponent<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends React.ElementType = React.ElementType
> extends PolymorphicWithoutRef<Default, Props, OnlyAs> {
  displayName?: string;
  propTypes?: React.WeakValidationMap<any>;
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<any>;
  id?: string;
}

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

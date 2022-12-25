import React, {
  Component,
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementType,
  ForwardRefExoticComponent,
  ForwardRefRenderFunction,
  LazyExoticComponent,
  MemoExoticComponent,
  PropsWithoutRef,
  PropsWithRef,
  ReactElement,
  RefAttributes,
} from "react";

export {};

// ----------------------------------------------
// UTILS
// ----------------------------------------------

type Merge<A, B> = Omit<A, keyof B> & B;

/** Adds `as` property as an optional prop */
type WithAs<Props extends object, Type extends ElementType = ElementType> = {
  as?: Type;
} & Props;

type ValidateProps<
  Component extends ElementType,
  PP extends object,
  CP extends object,
  RP extends object
> =
  // intent is usually if CP can be provided with RP props,
  // this makes sure that { a?: string } can extend { a: string }.
  // so user doesn't have RP be { a?: string } and accidentally
  // allow empty objects ({}) to extend { a?: string }
  Required<CP> extends RP
    ? Merge<Omit<CP, keyof RP>, WithAs<PP, Component>>
    : // let it still provide intellisense
      { as: Component } & Record<string, never>;

export type Restrict<
  T extends ElementType = ElementType,
  P extends object = {}
> = [
  // did not test enough (or at all) if this will shoot me in the foot
  T | ((props: P) => ReactElement<never, never>),
  P
];

// ----------------------------------------------
// PROP TYPES
// ----------------------------------------------

// make typescript not check PropsWithRef<P> individually.
// more detailed explanation here:
// https://dev.to/nasheomirro/create-fast-type-safe-polymorphic-components-with-the-as-prop-ncn
export type _ComponentPropsWithRef<T extends ElementType> = PropsWithRef<
  T extends new (props: infer P) => Component<any, any>
    ? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
    : ComponentProps<T>
>;

export type PolymorphicPropsWithoutRef<
  T extends ElementType,
  Props extends object = {},
  HasProps extends object = {}
> = ValidateProps<T, Props, ComponentPropsWithoutRef<T>, HasProps>;

export type PolymorphicPropsWithRef<
  T extends ElementType,
  Props extends object = {},
  HasProps extends object = {}
> = ValidateProps<T, Props, _ComponentPropsWithRef<T>, HasProps>;

// ----------------------------------------------
// COMPONENT TYPES
// ----------------------------------------------

interface ComponentBase {
  displayName?: string;
  propTypes?: React.WeakValidationMap<any>;
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<any>;
  id?: string;
}

export interface CallWithoutRef<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends ElementType = ElementType,
  HasProps extends object = {}
> {
  <T extends OnlyAs = Default>(
    props: PolymorphicPropsWithoutRef<T, Props, HasProps>
  ): ReactElement | null;
}

export interface CallWithRef<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends ElementType = ElementType,
  HasProps extends object = {}
> {
  <T extends OnlyAs = Default>(
    props: PolymorphicPropsWithRef<T, Props, HasProps>
  ): ReactElement | null;
}

export interface PolymorphicComponent<
  Default extends Restriction[0],
  Props extends object = {},
  Restriction extends Restrict = Restrict
> extends ComponentBase,
    CallWithoutRef<Default, Props, Restriction[0], Restriction[1]> {}

// ----------------------------------------------
// EXOTIC COMPONENTS
// ----------------------------------------------

export type PolyForwardExoticComponent<
  Default extends Restriction[0],
  Props extends object = {},
  Restriction extends Restrict = Restrict
> = Merge<
  ForwardRefExoticComponent<Props & { [key: string]: unknown }>,
  CallWithRef<Default, Props, Restriction[0], Restriction[1]>
>;

/**
 * MemoExoticComponent but with support for polymorph. Note that if your polymorphic component
 * has ref forwarded, you should use `PolyForwardMemoExoticComponent` instead.
 */
export type PolyMemoExoticComponent<
  Default extends Restriction[0],
  Props extends object = {},
  Restriction extends Restrict = Restrict
> = Merge<
  MemoExoticComponent<React.ComponentType<any>>,
  CallWithoutRef<Default, Props, Restriction[0], Restriction[1]>
>;

/**
 * MemoExoticComponent but with support for polymorph.
 * makes it clear that the component does support refs if possible.
 */
export type PolyForwardMemoExoticComponent<
  Default extends Restriction[0],
  Props extends object = {},
  Restriction extends Restrict = Restrict
> = Merge<
  MemoExoticComponent<React.ComponentType<any>>,
  CallWithRef<Default, Props, Restriction[0], Restriction[1]>
>;

/**
 * LazyExoticComponent but with support for polymorph. Note that if your polymorphic component
 * has ref forwarded, you should use `PolyForwardMemoExoticComponent` instead.
 */
export type PolyLazyExoticComponent<
  Default extends Restriction[0],
  Props extends object = {},
  Restriction extends Restrict = Restrict
> = Merge<
  LazyExoticComponent<React.ComponentType<any>>,
  CallWithoutRef<Default, Props, Restriction[0], Restriction[1]>
>;

/**
 * LazyExoticComponent but with support for polymorph.
 * makes it clear that the component does support refs if possible.
 */
export type PolyForwardLazyExoticComponent<
  Default extends Restriction[0],
  Props extends object = {},
  Restriction extends Restrict = Restrict
> = Merge<
  LazyExoticComponent<React.ComponentType<any>>,
  CallWithRef<Default, Props, Restriction[0], Restriction[1]>
>;

// ----------------------------------------------
// FUNCTION TYPES
// cast at your own risk.
// ----------------------------------------------

export type PolyRefFunction = <
  Default extends Restriction[0],
  Props extends object = {},
  Restriction extends Restrict = Restrict
>(
  Component: ForwardRefRenderFunction<any, WithAs<Props, Restriction[0]>>
) => PolyForwardExoticComponent<Default, Props, Restriction>;

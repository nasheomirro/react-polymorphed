import React, {
  Component,
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementType,
  ForwardRefExoticComponent,
  LazyExoticComponent,
  MemoExoticComponent,
  PropsWithoutRef,
  PropsWithRef,
  ReactElement,
  RefAttributes,
} from "react";

// ----------------------------------------------
// UTILS
// ----------------------------------------------

export type Merge<A, B> = Omit<A, keyof B> & B;

/** Adds `as` property as an optional prop */
export type WithAs<
  Props extends object,
  Type extends ElementType = ElementType
> = { as?: Type } & Props;

export type Restrict<
  T extends ElementType = ElementType,
  P extends object = {}
> = [
  // did not test enough (or at all) if this will shoot me in the foot
  T | ((props: P) => ReactElement<never, never>),
  P
];

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
    // Omitting RP is a stylistic choice, not sure how good the decision is
    ? Merge<Omit<CP, keyof RP>, WithAs<PP, Component>>
    : // let it still provide intellisense
      { as: Component } & Record<string, never>;

// ----------------------------------------------
// PROP TYPES
// ----------------------------------------------

// for some reason, removing PropsWithRef<T> from this type makes this a lot faster.
// The PropsWithRef<T> type was just lifted to the top.
export type _ComponentPropsWithRef<T extends ElementType> = T extends new (
  props: infer P
) => Component<any, any>
  ? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
  : ComponentProps<T>;

// cause why not?
export type PolymorphicPropsWithoutRef<Component extends ElementType> =
  ComponentPropsWithoutRef<Component>;

export type PolymorphicPropsWithRef<Component extends ElementType> =
  PropsWithRef<_ComponentPropsWithRef<Component>>;

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
    props: ValidateProps<T, Props, PolymorphicPropsWithoutRef<T>, HasProps>
  ): ReactElement | null;
}

export interface CallWithRef<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends ElementType = ElementType,
  HasProps extends object = {}
> {
  <Component extends OnlyAs = Default>(
    props: ValidateProps<
      Component,
      Props,
      PolymorphicPropsWithRef<Component>,
      HasProps
    >
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

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

export type Merge<A, B> = Omit<A, keyof B> & B;

type ValidProps<
  Props extends object,
  Restriction extends object,
  ToMerge extends object
> = Props extends Restriction ? Merge<Props, ToMerge> : never;

/** Adds `as` property as an optional prop */
export type WithAs<
  Props extends object,
  Type extends ElementType = ElementType
> = { as?: Type } & Props;

/*
 * This makes ComponentProps<T> to unknown, which lets us avoid the "a" can have "b" props problem
 *
 * let's say T is "a" | "b", which means it's props will be ComponentProps<a> | ComponentProps<B>,
 * now when we use our component inside the function body, typescript will complain that there is a
 * possibility that our component will be "a" and our props would be "ComponentProps<B>" which are
 * incompatible, we know for ourselves that this isn't possible but typescript doesn't pick up on that.
 *
 * That's why we make it so that ComponentProps<T> would be unknown, props would be unknown in this case.
 */
export type OnlyAs<T extends ElementType = ElementType, P = unknown> =
  | T
  | ((props: P) => null);

export type Restrict<P = any, T extends ElementType = ElementType> = [P, T];

// ----------------------------------------------
// PROP TYPES
// ----------------------------------------------

// for some reason, removing PropsWithRef<T> from this type makes this a lot faster.
// don't ask me how, it just does. The PropsWithRef<T> type was just lifted to the top.
//
// I'm guessing its because its not being cached by typescript because it's
// placed inside a conditional (`PropsWithRef<ComponentProps<T>>`)
export type _ComponentPropsWithRef<T extends ElementType> = T extends new (
  props: infer P
) => Component<any, any>
  ? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
  : ComponentProps<T>;

export type PolymorphicPropsWithoutRef<
  Component extends ElementType,
  Props extends object = {},
  Restriction extends object = any
> = ValidProps<
  ComponentPropsWithoutRef<Component>,
  Restriction,
  WithAs<Props, Component>
>;

export type PolymorphicPropsWithRef<
  Component extends ElementType,
  Props extends object = {},
  Restriction extends object = any
> = ValidProps<
  PropsWithRef<_ComponentPropsWithRef<Component>>,
  Restriction,
  WithAs<Props, Component>
>;

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
  HasProps extends object = any
> {
  <Component extends OnlyAs = Default>(
    props: PolymorphicPropsWithoutRef<Component, Props, HasProps>
  ): ReactElement | null;
}

export interface CallWithRef<
  Default extends Restriction,
  Props extends object = {},
  Restriction extends ElementType = ElementType,
  RestrictProps extends object = any
> {
  <Component extends Restriction = Default>(
    props: PolymorphicPropsWithRef<Component, Props, RestrictProps>
  ): ReactElement | null;
}

export interface PolymorphicComponent<
  Default extends Restriction[1],
  Props extends object = {},
  Restriction extends Restrict = Restrict
> extends ComponentBase,
    CallWithoutRef<Default, Props, Restriction[1], Restriction[0]> {}

/**
 * adds the ref attribute to PolymorphicComponent, usually you shouldn't
 * have to use this as you can just use `forwardRef()`
 */
export interface PolymorphicComponentWithRef<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends ElementType = ElementType
> extends ComponentBase,
    CallWithRef<Default, Props, OnlyAs> {}

// ----------------------------------------------
// EXOTIC COMPONENTS
//
// $Merge below isn't actually doing anything except for removing the call signatures off of
// the first type passed (Omit<A, never> & B), then we replace the call signature with our generic
// function.
// ----------------------------------------------

export type PolyForwardExoticComponent<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends ElementType = ElementType
> = Merge<
  ForwardRefExoticComponent<Props & { [key: string]: unknown }>,
  CallWithRef<Default, Props, OnlyAs>
>;

/**
 * MemoExoticComponent but with support for polymorph. Note that if your polymorphic component
 * has ref forwarded, you should use `PolyForwardMemoExoticComponent` instead.
 */
export type PolyMemoExoticComponent<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends ElementType = ElementType
> = Merge<
  MemoExoticComponent<React.ComponentType<any>>,
  CallWithoutRef<Default, Props, OnlyAs>
>;

/**
 * MemoExoticComponent but with support for polymorph.
 * makes it clear that the component does support refs if possible.
 */
export type PolyForwardMemoExoticComponent<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends ElementType = ElementType
> = Merge<
  MemoExoticComponent<React.ComponentType<any>>,
  CallWithRef<Default, Props, OnlyAs>
>;

/**
 * LazyExoticComponent but with support for polymorph. Note that if your polymorphic component
 * has ref forwarded, you should use `PolyForwardMemoExoticComponent` instead.
 */
export type PolyLazyExoticComponent<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends ElementType = ElementType
> = Merge<
  LazyExoticComponent<React.ComponentType<any>>,
  CallWithoutRef<Default, Props, OnlyAs>
>;

/**
 * LazyExoticComponent but with support for polymorph.
 * makes it clear that the component does support refs if possible.
 */
export type PolyForwardLazyExoticComponent<
  Default extends OnlyAs,
  Props extends object = {},
  OnlyAs extends ElementType = ElementType
> = Merge<
  LazyExoticComponent<React.ComponentType<any>>,
  CallWithRef<Default, Props, OnlyAs>
>;

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

/** Adds `as` property as an optional prop if Props doesn't already have the `as` property. */
export type WithAs<
  Props extends object = {},
  Type extends ElementType = ElementType
> = { as?: Type } & Props;

// ----------------------------------------------
// PROP TYPES
// ----------------------------------------------

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

export type PolymorphicPropsWithoutRef<
  Component extends ElementType,
  Props extends object = {}
> = Merge<ComponentPropsWithoutRef<Component>, WithAs<Props, Component>>;

export type PolymorphicPropsWithRef<
  Component extends ElementType,
  Props extends object = {}
> = Merge<
  PropsWithRef<_ComponentPropsWithRef<Component>>,
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

interface CallWithoutRef<
  Default extends ElementType = ElementType,
  Props extends object = {}
> {
  <Component extends ElementType = Default>(
    props: PolymorphicPropsWithoutRef<Component, Props>
  ): ReactElement | null;
}

interface CallWithRef<
  Default extends ElementType = ElementType,
  Props extends object = {}
> {
  <Component extends ElementType = Default>(
    props: PolymorphicPropsWithRef<Component, Props>
  ): ReactElement | null;
}

/**
 * Make your component Polymorphic.
 */
export interface PolymorphicComponent<
  Default extends ElementType = ElementType,
  Props extends object = {}
> extends ComponentBase,
    CallWithoutRef<Default, Props> {}

/**
 * adds the ref attribute to PolymorphicComponent, usually you shouldn't
 * have to use this as you can just use `forwardRef()`
 */
export interface PolymorphicComponentWithRef<
  Default extends ElementType = ElementType,
  Props extends object = {}
> extends ComponentBase,
    CallWithRef<Default, Props> {}

// ----------------------------------------------
// EXOTIC COMPONENTS
//
// $Merge below isn't actually doing anything except for removing the call signatures off of
// the first type passed (Omit<A, never> & B), then we replace the call signature with our generic
// function.
// ----------------------------------------------

export type PolyForwardExoticComponent<
  Default extends ElementType,
  Props extends object = {}
> = Merge<ForwardRefExoticComponent<{}>, CallWithRef<Default, Props>>;

/**
 * MemoExoticComponent but with support for polymorph. Note that if your polymorphic component
 * has ref forwarded, you should use `PolyForwardMemoExoticComponent` instead.
 */
export type PolyMemoExoticComponent<
  Default extends ElementType,
  Props extends object = {}
> = Merge<
  MemoExoticComponent<React.ComponentType<any>>,
  CallWithoutRef<Default, Props>
>;

/**
 * MemoExoticComponent but with support for polymorph.
 * makes it clear that the component does support refs if possible.
 */
export type PolyForwardMemoExoticComponent<
  Default extends ElementType,
  Props extends object = {}
> = Merge<
  MemoExoticComponent<React.ComponentType<any>>,
  CallWithRef<Default, Props>
>;

// TODO: I never used Lazy Components, there might be some problems
// with components being passed that aren't ref-forwarded.
export type PolyLazyExoticComponent<
  Default extends ElementType,
  Props extends object = {}
> = Merge<
  LazyExoticComponent<React.ComponentType<any>>,
  CallWithoutRef<Default, Props>
>;

export type PolyLazyExoticRefComponent<
  Default extends ElementType,
  Props extends object = {}
> = Merge<
  LazyExoticComponent<React.ComponentType<any>>,
  CallWithRef<Default, Props>
>;

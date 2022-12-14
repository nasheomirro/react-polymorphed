import { Component, ComponentPropsWithoutRef, ElementType, ForwardRefExoticComponent, LazyExoticComponent, MemoExoticComponent, NamedExoticComponent, PropsWithoutRef, PropsWithRef, ReactElement, RefAttributes } from "react";
export type $Merge<A, B> = Omit<A, keyof B> & B;
/** Adds `as` property as an optional prop if Props doesn't already have the `as` property. */
export type WithAs<Props extends object = {}, Type extends ElementType = ElementType> = {
    as?: Type;
} & Props;
type Screwit<T extends keyof JSX.IntrinsicElements> = PropsWithRef<JSX.IntrinsicElements[T]>;
type ComponentPropsWithRef<T extends ElementType> = T extends keyof JSX.IntrinsicElements ? Screwit<T> : T extends (props: infer P) => ReactElement<any, any> | null ? PropsWithRef<P> : T extends new (props: infer P) => Component<any, any> ? PropsWithoutRef<P> & RefAttributes<InstanceType<T>> : {};
export type PolymorphicPropsWithoutRef<Component extends ElementType, Props extends object = {}> = $Merge<ComponentPropsWithoutRef<Component>, WithAs<Props, Component>>;
export type PolymorphicPropsWithRef<Component extends ElementType = ElementType, Props extends object = {}> = $Merge<ComponentPropsWithRef<Component>, WithAs<Props, Component>>;
/**
 * makes components polymorphic given the default prop type,
 */
export type PolymorphicComponent<Default extends ElementType = ElementType, Props extends object = {}> = {
    <Component extends ElementType = Default>(props: PolymorphicPropsWithoutRef<Component, Props>): ReactElement | null;
};
/**
 * adds the ref attribute to PolymorphicComponent, usually you shouldn't
 * have to use this when you can just use `forwardRef()`
 */
export type PolymorphicComponentWithRef<Default extends ElementType = ElementType, Props extends object = {}> = {
    <Component extends ElementType = Default>(props: PolymorphicPropsWithRef<Component, Props>): ReactElement | null;
};
export type ManualPolymorphicProps<DefaultProps extends object = {}, ComponentProps extends object = {}, Default extends ElementType = ElementType, Component extends ElementType = ElementType, Props extends object = {}> = $Merge<Component extends Default ? DefaultProps : ComponentProps, WithAs<Props, Component>>;
/**
 * at definition, function arguments becomes the props of the default
 * component passed. **WARNING:** Though it is incorrect, as long as you only use
 * props which will be unaffected by the changes of `as` then it should be okay.
 */
export type LoosePolymorphicComponent<Default extends ElementType = ElementType, Props extends object = {}> = {
    <Component extends ElementType = Default>(props: ManualPolymorphicProps<ComponentPropsWithoutRef<Default>, ComponentPropsWithoutRef<Component>, Default, Component, Props>): ReactElement | null;
};
/**
 * adds the ref attribute to `LoosePolymorphicComponent`, usually you shouldn't
 * have to use this when you can use `forwardRef()`.
 */
export type LoosePolymorphicComponentWithRef<Default extends ElementType = ElementType, Props extends object = {}> = {
    <Component extends ElementType = Default>(props: ManualPolymorphicProps<ComponentPropsWithRef<Default>, ComponentPropsWithRef<Component>, Default, Component, Props>): ReactElement | null;
};
export type PolyForwardExoticComponent<Default extends ElementType, Props extends object = {}> = $Merge<ForwardRefExoticComponent<{}>, PolymorphicComponentWithRef<Default, Props>>;
export type PolyNamedExoticComponent<Default extends ElementType, Props extends object = {}> = $Merge<NamedExoticComponent<{}>, PolymorphicComponent<Default, Props>>;
export type PolyMemoExoticComponent<Default extends ElementType, Props extends object = {}> = $Merge<MemoExoticComponent<any>, PolymorphicComponentWithRef<Default, Props>>;
export type PolyLazyExoticComponent<Default extends ElementType, Props extends object = {}> = $Merge<LazyExoticComponent<any>, PolymorphicComponentWithRef<Default, Props>>;
export {};

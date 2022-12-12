import React from "react";

/** Intersect A & B but with B overriding A's properties in case of conflict */
type Overwrite<A, B> = Omit<A, keyof B> & B;

/** function type for overriding polymorphic components */
export type RenderContainer<T extends Record<string, unknown> = any> = (
  props: T
) => React.ReactElement | null;

/** the base for RenderContainerProps, feel free to extend this to have other attributes. */
export type BaseProps<T extends RenderContainer | undefined> = {
  render?: T;
};

/** the type of props for polymorphic components */
export type RenderContainerProps<
  T extends RenderContainer | undefined,
  DP extends Record<string, unknown> = {},
  PP extends Record<string, unknown> = {}
> = T extends undefined
  ? Overwrite<BaseProps<T>, DP & PP>
  : Overwrite<BaseProps<T>, PP>;

export type PolymorphicComponent<
  IP extends Record<string, unknown>,
  DP extends Record<string, unknown> = {},
  PP extends Record<string, unknown> = {}
> = <T extends RenderContainer<IP> | undefined>(
  props: RenderContainerProps<T, DP, PP>
) => React.ReactElement | null;

/** short-hand for PolymorphicComponent */
export type PC<
  DP extends Record<string, unknown> = {},
  PP extends Record<string, unknown> = {}
> = PolymorphicComponent<DP, PP>;

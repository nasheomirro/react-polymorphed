# react-polymorphed

A set of types to help easily create fast polymorphic components. This package heavily relied on [react-polymorphic-types](https://github.com/kripod/react-polymorphic-types) when it was being made.

## Basic Usage

Let's start with creating a polymorphic button component.

```tsx
import { PolymorphicComponent } from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

// pass it the default type and your own props
const Button: PolymorphicComponent<"button", Props> = ({
  as: As = "button",
  size,
  ...props
}) => {
  return <As {...props} />;
};
```

We can then use this polymorphic component like so:

```tsx
  <Button type="submit" size="small"> I am a button!</Button>
  <Button as={"a"} href="" size="large"> I became an achor!</Button>
  <Button href="">I cannot have an href!</Button> //error
```

## Supporting `forwardRef()`

The easiest way to create ref-forwarded polymorphic components is to cast the `forwardRef` function to a `PolyRefFunction`:

```tsx
import { forwardRef } from "react";
import { PolyRefFunction } from "react-polymorphed";

const polyRef = forwardRef as PolyRefFunction;

type Props = {
  size?: "small" | "large";
};

const Button = polyRef<"button", Props>(
  ({ as: As = "button", size, ...props }, ref) => {
    return <As ref={ref} {...props} />;
  }
);
```

This should now expose the ref property and will correctly change it's type based on the `as` prop. If the component given to the `as` prop does not support refs then it will not show.

```tsx
const Example = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={buttonRef} />
      // error! type of ref don't match
      <Button as="div" ref={buttonRef} />
      // error! property ref doesn't exist
      <Button as={() => null} ref={buttonRef} />
    </>
  );
};
```

## Typing `memo()` and `lazy()`

Unlike `React.forwardRef()`, memo and lazy doesn't need any special functions to make work, we can simply assign it's type correctly like so:

```tsx
import React from "react";
import {
  PolymorphicComponent,
  PolyMemoComponent,
  PolyLazyComponent,
} from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

const Button: PolymorphicComponent<"button", Props> = ({
  as: As = "button",
  size,
  ...props
}) => {
  return <As {...props} />;
};

const MemoButton: PolyMemoComponent<"button", Props> = React.memo(Button);

// in another file:
const LazyButton: PolyLazyComponent<"button", Props> = React.lazy(
  async () => import("./Button")
);
```

## `memo()` and `lazy()` with `polyRef()`

Note that if the polymorphic component forwards refs, you need to instead use either the `PolyForwardMemoComponent` or `PolyForwardLazyComponent` to correctly preserve the ref property.

```tsx
import React from "react";
import { PolyRefFunction, PolyForwardMemoComponent } from "react-polymorphed";

const polyRef = React.forwardRef as PolyRefFunction;

type Props = {
  size?: "small" | "large";
};

const RefButton = polyRef<"button", Props>(
  ({ as: As = "button", size, ...props }, ref) => {
    return <As ref={ref} {...props} />;
  }
);

// use the correct type!
const MemoRefButton: PolyForwardMemoComponent<"button", Props> =
  React.memo(RefButton);
```

## Adding Constraints

Say you wanted your button to only be `"button" | "a"`, you can pass a third type to the `PolymorphicComponent` with `OnlyAs<T>`:

```tsx
import React from "react";
import { PolymorphicComponent, OnlyAs } from "react-polymorphed";

const Button: PolymorphicComponent<"button", {}, OnlyAs<"button" | "a">> = ({
  as: As = "button",
  ...props
}) => {
  return <As {...props} />;
};

<Button />;
<Button as="a" />;
<Button as="div" />; // error!
```
⚠️ Hold up! It has occured to me that constraints may not be a good feature to use and could even do more harm than good so before you use constraints it is important that you read the FAQ below on why you might not want them.

## FAQs

<details> 
<summary><strong>You might not want constraints</strong></summary>

Using something like `ElementType<{ required: string }>` will not work on components which do not have any props:

```tsx
type A = () => null;
type B = ElementType<{ required: string }>;
type DoesExtend = A extends B ? true : false; // true!
```

There's really no solution to fix this at the moment since this is a problem with typescript itself, and to no fault from typescript because the type of `A` CAN technically be called with the props of `B` because `A` won't use those props anyway, and since `ReturnType<A>` extends `ReturnType<B>` there is no reason for `A` to not extend `B`.

So unless you really need constraints and you and your team fully expect this behavior and other weird behaviors that comes from it, maybe you shouldn't use this at all. however, constraints that are purely just elements (e.g `"button" | "a"`) will probably work just fine.

</details>

<details> 
<summary><strong>Why do we need to wrap our constraints with <code>OnlyAs<T></code></strong></summary>

Just `"button" | "a"` could do the trick but we then have a problem of our props being "known" and typescript will complain that props don't match. [see issue #3](https://github.com/nasheomirro/react-polymorphed/issues/3)

```tsx
const Button: PolymorphicComponent<"button", {}, "button" | "a"> = ({
  as: As = "button",
  ...props
}) => {
  // error when props are spread
  return <As {...props} />;
};
```

`OnlyAs<T>` solves this by adding another type to the contraint, a type that makes our props unknown:

```ts
// ComponentProps<"button"> | ComponentProps<"a">
type A = ComponentPropsWithoutRef<"button" | "a">;

// unknown
type B = ComponentPropsWithoutRef<OnlyAs<"button" | "a">>;

// what OnlyAs is doing:
type C = ComponentPropsWithoutRef<
  "button" | "a" | (() => React.ReactElement<never>)
>;
```
</details>

<details>
<summary><strong>Using components with required props as the default or as a constraint</strong></summary>

If you're having trouble with props being required on the `<As />` component, you can widen the type by casting it to `React.ElementType`. [see issue #5](https://github.com/nasheomirro/react-polymorphed/issues/5)

```tsx
polyRef<"button", {}, OnlyAs<"button" | "a" | typeof Link>>(({ as: As = "button", ...props }, ref) => {
  const Elem = As as React.ElementType;
  return <Elem ref={ref} />
});
```

</details>

<details>
<summary><strong>VSCode Autocomplete only suggests the default element</strong></summary>

It might help if you wrap your string around an `{}` block, it could show the full list of suggestions, doesn't fully work though.

</details>
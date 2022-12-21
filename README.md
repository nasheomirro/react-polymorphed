# react-polymorphed

A set of types to help easily create fast polymorphic components. This package heavily leaned on [react-polymorphic-types](https://github.com/kripod/react-polymorphic-types) when it was being made.

## Basic Usage

Let's start with creating a polymorphic button component.

```tsx
import { PolymorphicComponent } from "react-polymorphed";

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
```

Let's focus on the `PolymorphicComponent` type, we give this type our default "button" and additional props we want to include, notice the props already has an `as` property, this is provided by default. If you're just looking to create simple polymorphic components, that's all you have to do!

We can then use this polymorphic component like so:

```tsx
  <Button type="submit" size="small"> I am a button!</Button>
  <Button as={"a"} href="" size="large"> I became an achor!</Button>
  <Button href="">I cannot have an href!</Button> //error
```

## Supporting `forwardRef()`

The easiest way to create ref-forwarded polymorphic components is to cast the `forwardRef` function to `PolyRefFunction`:

```tsx
import { forwardRef } from "react";
import { PolyRefFunction } from "react-polymorphed";

const polyRef = forwardRef as PolyRefFunction;

type Props = {
  size?: "small" | "large";
};

const Button = polyRef<"button", Props>(
  ({ as: As = "button", size, ...props }) => {
    return <As {...props} />;
  }
);
```

This should now expose the ref property and will correctly change it's type based on the `as` prop. If the component given to the `as` prop does not support refs then it will not let any refs be passed in.

## Typing `memo()` and `lazy()`

Unlike `React.forwardRef()`, memo and lazy doesn't need any special functions to make work, we can simply assign it's type correctly like so:

```tsx
import React from "react";
import {
  PolymorphicComponent,
  PolyMemoExoticComponent,
  PolyLazyExoticComponent,
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

const MemoButton: PolyMemoExoticComponent<"button", Props> = 
  React.memo(Button);

// in another file:
const LazyButton: PolyLazyExoticComponent<"button", Props> = 
  React.lazy(async () => import("./Button"));
```

Note that if the polymorphic component forwards refs, you need to use either the `PolyForwardMemoExoticComponent` or `PolyForwardLazyExoticComponent` to correctly preserve the ref property (A bit of a handful, I know).

```tsx
import React from "react";
import { forwardRef, PolyForwardMemoExoticComponent } from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

const RefButton = forwardRef<"button", Props>(
  ({ as: As = "button", size, ...props }) => {
    return <As {...props} />;
  }
);

// use the correct type!
const MemoRefButton: PolyForwardMemoExoticComponent<"button", Props> =
  React.memo(RefButton);
```

## Restricting the `as` prop

You can restrict what the `as` prop can be in two ways, restricting its `ElementType` or its props. You can use either one or both at the same time.

### Element Restriction

Say you wanted your button to only be "button" | "a", you can pass an `Restrict` type to the `PolymorphicComponent`:

```tsx
import React from "react";
import { PolymorphicComponent, Restrict } from "react-polymorphed";

const Button: PolymorphicComponent<"button", {}, Restrict<"button" | "a">> = ({
  as: As = "button",
  ...props
}) => {
  return <As {...props} />;
};

<Button />;
<Button as="a" />;
<Button as="div" />; // error!
```

⚠️ One caveat is that we cannot check for the default component `As` if it is a "button" | "a", this is actually present whether you use restrictions or not:

```tsx
// ...
  as: As = "div", // doesn't error
// ...
```

### Prop Restriction

If you need to check whether or not the component passed can accept a `className` prop, you can pass the `Restrict` type another argument:

```tsx
import React, { ElementType } from "react";
import { PolymorphicComponent, Restrict } from "react-polymorphed";

const Button: PolymorphicComponent<
  "button",
  {},
  Restrict<ElementType, { className: string }>
> = ({ as: As = "button", ...props }) => {
  return <As {...props} />;
};

<Button />;
<Button as={"a"} />;
<Button as="div" />;
<Button as={() => null} />; // error!
```

This does omit `className` from the original component props, this is because it assumes that if you provide a prop restriction, then that means that you will replace it inside your polymorphic component:

```tsx
<Button className="oi" /> // error: className doesn't exist in button props.
```

If you wanted to have users be able to pass `className` anyways, like say to override the default `className`, then you could just place it on your props:

```tsx
const Button: PolymorphicComponent<
  "button",
  { className?: string },
  Restrict<ElementType, { className: string }>
> = ({ as: As = "button", className, ...props }) => {
  return <As {...props} />;
};
```

#### Caveats

⚠️ Note that unlike Element Restriction, this only checks when used, you can see what I mean here:

```tsx
const Button: PolymorphicComponent<
  () => null, // typescript won't complain
  {},
  Restrict<ElementType, { className: string }>
> = // ...
;

<Button /> // then complains that the default props are incorrect
```

⚠️ This also leads to some cryptic errors that might make your users confused.

```tsx
<Button as={() => null} />
// Type '{ as: () => null; }' is not assignable
// to type 'Record<string, never>'.
```

<details>
<summary><strong>Why not just <code>ElementType<{ className: string }></code>?</strong></summary>


First off, it's quite slow, you can actually try this out by using `Restrict<ElementType<{ className?: string }>>`. 

There are ways to potentially make this faster like maybe ignoring intrinsic elements and only checking for component types, like this: `Restrict<keyof JSX.IntrinsicElements | ComponentType<{ className?: string }>>`.

But the next problem is this:

```tsx
type A = (props: {}) = any;
type B = (props: { className?: string }) => any;

type C = A extends B ? true : never; // true!
```

the type of `{}` extends `{ className?: string }`, and that's because `className` is optional, so what if we make it not optional:

```tsx
type A = (props: {}) => any;
type B = (props: { className: string }) => any;

type C = A extends B ? true : never; // never!

// but then
type D = (props: { className?: string }) => any;
type E = D extends B ? true : never; // never!
```

clearly type `D` does support being passed a `className` prop but it doesn't extend `B`! I'll stop here as there are more interactions to take care of. And because of this, I felt it more useful to just have the checks for element type and prop type separately.

</details>

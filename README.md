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
  ({ as: As = "button", size, ...props }) => {
    return <As {...props} />;
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

Note that if the polymorphic component forwards refs, you need to instead use either the `PolyForwardMemoComponent` or `PolyForwardLazyComponent` to correctly preserve the ref property.

```tsx
import React from "react";
import { forwardRef, PolyForwardMemoComponent } from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

const RefButton = forwardRef<"button", Props>(
  ({ as: As = "button", size, ...props }) => {
    return <As {...props} />;
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

## FAQs

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
<summary><strong>A note about adding constraints</strong></summary>

using something like `ElementType<{ href: "a" }>` will not work on components which do not have explicit props:

```tsx
type A = () => null;
type B = A extends ElementType<{ required: string }> ? true : false; // true!
```

</details>

<details>
<summary><strong>VSCode Autocomplete only suggests the default element</strong></summary>

wrap your string around an `{}` block, it will then show the full list of suggestions.

</details>

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

This should now expose the ref property and will correctly change it's type based on the `as` prop. If the component given to the `as` prop does not support refs then it will not let any refs be passed in.

```tsx
const Example = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={buttonRef} />
      // error!
      <Button as="div" ref={buttonRef} />
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
const MemoRefButton: PolyForwardMemoExoticComponent<"button", Props> =
  React.memo(RefButton);
```

## Adding Constraints

Say you wanted your button to only be `"button" | "a"`, you can pass a third type to the `PolymorphicComponent`:

```tsx
import React from "react";
import { PolymorphicComponent } from "react-polymorphed";

const Button: PolymorphicComponent<"button", {}, "button" | "a"> = ({
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
<summary> VSCode Autocomplete only suggests the default element</summary>

wrap your string around and `{}` block, it will then show the full list of suggestions.

</details>

<details> 
<summary> A note about adding constraints </summary>

using something like `ElementType<{ href: "a" }>` will not work on components which do not have explicit props:

```tsx
type A = () => null;
type B = A extends ElementType<{ required: string }> ? true : false; // true!
```

</details>

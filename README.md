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

The easiest way to create ref-forwarded polymorphic components is to use the `forwardRef()` function, not the one from react but the one from this package:

```tsx
import { forwardRef } from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

const Button = forwardRef<"button", Props>(
  ({ as: As = "button", size, ...props }) => {
    return <As {...props} />;
  }
);
```

the `forwardRef()` function is completely the same as `React.forwardRef()` but is typed to support polymorphic components. Note that this does use type-casting inside.

This should now expose the ref property and will correctly change it's type based on the `as` prop. If the component given to the `as` prop does not support refs then it will not show.

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

const MemoButton: PolyMemoExoticComponent<"button", Props> = React.memo(Button);

// in another file:
const LazyButton: PolyLazyExoticComponent<"button", Props> = React.lazy(
  async () => import("./Button")
);
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

If you want to restrict what the `as` prop can be, for example it should only be able to become a button or an anchor tag, you can pass an additional type to `PolymorphicComponent`. This type has to extend from `React.ElementType` and has to be wrapped inside our `OnlyAs<T>` utility type.

```tsx
import { OnlyAs, PolymorphicComponent } from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

const Button: PolymorphicComponent<"button", Props, OnlyAs<"button" | "a">> = ({
  as: As = "button",
  size,
  ...props
}) => {
  return <As {...props} />;
};
```

Then when used we can only have either a "button" or an "a" tag.

```tsx
<Button as={"div"} /> // error!
<Button as={"a"} />
```

Note that this is also possible in our `forwardRef()` function:

```tsx
import { forwardRef, OnlyAs } from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

const ButtonOrLink = forwardRef<"button", Props, OnlyAs<"button" | "a">>(
  ({ as: As = "button", size, ...props }, ref) => {
    return <As ref={ref} {...props} />;
  }
);

<ButtonOrLink as="a" />;
<ButtonOrLink as="div" />; // error!
```

## Advanced Restrictions

This is where it gets dicey, let's say we only want to accept components that have a `className` prop, we could do this:

```tsx
import { ElementType } from "react";
import { OnlyAs, PolymorphicComponent } from "react-polymorphed";

type Props = {
  size?: "small" | "large";
};

const Button: PolymorphicComponent<
  "button",
  Props,
  OnlyAs<ElementType<{ className?: string }>>
> = ({ as: As = "button", size, ...props }) => {
  return <As {...props} />;
};
```
What you'll then notice is a huge drop in intellisense, this is because typescript is trying to understand what the `As` component's props will be. If you're in VS Code, try pressing `Ctrl` + `space` inside the `As` component, you'll notice a huge amount of props. This is basically all the props of every intrinsic element combined, which is about 183 prop types! Some of you will even experience a "Expression produces a union type that is too complex to represent." typescript error!

But fear not, there is one simple solution here, and that is to ignore them, not like actually ignore them but to widen our `As` component's type:

```tsx
const Button: PolymorphicComponent<
  "button",
  Props,
  OnlyAs<ElementType<{ className?: string }>>
> = ({ as: As, size, ...props }) => {
  const Elem: ElementType = As || "button"
  return <As {...props} />;
};
```
This way, we turn off prop-checking for the `As` component since we widened it to `ElementType`, more specifically `ElementType<any>`.

But it still feels laggy, that's because we're still comparing every intrinsic element if `{ className?: string }` extends their props, but we already know that every element can accept a className, so we can make it so that typescript will ignore checking them:

```tsx
type Restriction = OnlyAs<keyof JSX.IntrinsicElements | ComponentType<{ className?: string }>>
```
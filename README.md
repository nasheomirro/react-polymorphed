# react-polymorphed

create type-safe polymorphic components that doesn't crash typescript, also note this package was based off of [react-polymorphic-types](https://github.com/kripod/react-polymorphic-types).

**Be warned ye who use this package**! No.. seriously be sure to check the source code before using this, There are things in there that I can't explain how they work, it just does, and I'm scared. If you do know how they work, feel free to either open an issue or submit a PR that changes the comments I placed into something that explains it.

## Basic Usage

Creating a polymorhpic component is as easy as defining the component like so:

```tsx
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

notice the button's props already have `as` attribute, this is provided when you use the `PolymorphicComponent` type, speaking of which, the `PolymorphicComponent` type expects 2 optional arguments, the default type (which extends `ElementType`) and additional props.

when used, the props change depending on whatever is passed to `as`, as well as the additional props you gave.

```tsx
  <Button type="submit" size="small"> I am a button! </Button>
  <Button as={"a"} href="" size="large"> I became an achor!</Button>
```

## Supporting `forwardRef()`

The easiest and most convenient way is to use react-polymorphed's `forwardRef()` function, it's the same as `React.forwardRef()` but is typed to support polymorphic components correctly, note that this does use type assertion inside:

```tsx
type Props = {
  size?: "small" | "large";
};

const Button = forwardRef<"button", Props>(
  ({ as: As = "button", size, ...props }) => {
    return <As {...props} />;
  }
);
```

This should now expose the `ref` attribute and will correctly change based on the `as` prop. If the component given to the `as` prop does not support refs then it will not show. The one drawback to using this is having one extra item on the call stack which is pretty negligible.

## Typing `memo()`

Unlike `React.forwardRef`, memo doesn't need any special functions to make work, we can simply narrow its type down like so:

```tsx
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

// note that all exotic components have the same generics as `PolymorphicComponent`
const MemoButton: PolyMemoExoticComponent<"button", Props> =
  React.memo("button");
```

Note that if the component you're trying to `memo()` forwards refs, use the `PolyForwardMemoExoticComponent` to preserve the `ref` property instead.

```tsx
type Props = {
  size?: "small" | "large";
};

const RefButton = forwardRef<"button", Props>(
  ({ as: As = "button", size, ...props }) => {
    return <As {...props} />;
  }
);

const MemoRefButton: PolyForwardMemoExoticComponent<"button", Props> =
  React.memo("button");
```

## FAQs and Interactions

Below are a list of weird interactions noted and some common problems

### The default component having required props

most often the easiest way to deal with this is to assert your props to have the required props available, although this feels dirty (it definitely is) it should still work correctly when used.

```tsx
type Props = {
  required: string;
};
const Default = {} as React.FC<Props>;

const Button: PolymorphicComponent<typeof Default> = ({
  as: As = Default,
  ...props
}) => {
  return <As {...(props as typeof props & Props)} />;
};
```

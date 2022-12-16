# react-polymorphed

create type-safe polymorphic components that doesn't crash typescript, this package was based off of [react-polymorphic-types](https://github.com/kripod/react-polymorphic-types).

**Be warned ye who use this package!**: though I'm certain everything should work fine, I am still a novice in both typescript's quirkiness and react's uncommon types, some types might even rely on bugs to work correctly, so take caution!

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

notice the button's props already have an `as` property, this is provided when you use the `PolymorphicComponent` type, speaking of which, notice we gave 2 arguments to `PolymorphicComponent`, the default type of your component (which extends `ElementType`) and an optional generic for your props, these additional props won't change when polymorphing.

when used, the props change depending on whatever is passed to `as`, as well as the additional props you gave.

```tsx
  <Button type="submit" size="small"> I am a button!</Button>
  <Button as={"a"} href="" size="large"> I became an achor!</Button>
```

## Limiting the `as` prop

If you only want your component to either polymorph into a button or an ancor element, you can provide it as the third type to `PolymorphicComponent`, this third argument should use the `OnlyAs` type:

```tsx
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

Now when we try polymorphing into a div, typescript will complain:

```tsx
  <Button type={"submit"} size="small"> I am a button!</Button>
  <Button as={"a"} href="" size="large"> I became an achor!</Button>
  <Button as={"div"}> I can't be a div!</Button> // error
```

## Common generic types

All polymorphic component types share the same arguments, the first being the `Default` type, second is an optional `Props`, the third is an optional `OnlyAs` type where you can specify what element can the component polymorph into.

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

Note that forwardRef also supports the `OnlyAs` type:

```tsx
const ButtonOrLink = forwardRef<"button", Props, OnlyAs<"button" | "a">> () => //...
```

## Typing `memo()` and `lazy()`

Unlike `React.forwardRef`, memo and lazy doesn't need any special functions to make work, we can simply narrow its type down like so:

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

const MemoButton: PolyMemoExoticComponent<"button", Props> =
  React.memo("button");
```

Note that if the component you're trying to `memo()` or `lazy()` forwards refs, use the `PolyForwardMemoExoticComponent` or the `PolyForwardLazyExoticComponent` to preserve the `ref` property.

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

# react-polymorphed

create type-safe polymorphic components that doesn't crash typescript.

**Be warned ye who use this package**. Though I believe everything works correctly, I am still not very fond of typescript nor react types, use this package with caution. Also big thanks to react-polymorphic-types as this package was based on that as well as some snooping done in chakra-ui's core.

## Basic Usage

Creating a polymorhpic component is as easy as defining the component like so:

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

notice the button's props already have `as` by default, this is provided when you use the `PolymorphicComponent` type, speaking of which, the `PolymorphicComponent` type expects 2 optional arguments, the default type (which extends `ElementType`) and additional props.

when used, the props change depending on whatever is passed to `as`, as well as the additional props you gave.

```tsx
<Button type="submit">I am a button!</Button>
<Button as={"a"} href="">I became an achor!</Button>
```

## Limiting the `as` prop

If you want to limit what the component can polymorph into, you can define your own `as` prop to override the default:

```tsx
import { PolymorphicComponent } from "react-polymorphed";

type Props = {
  as?: "button" | "div"
};

const Button: PolymorphicComponent<"button", Props> = ({
  as: As = "button",
  size,
  ...props
}) => {
  return <As {...props} />;
};
```
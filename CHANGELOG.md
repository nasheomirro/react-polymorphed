# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2023-01-22

### Added

- added `OnlyAs<T>` to fix [(#3)](https://github.com/nasheomirro/react-polymorphed/issues/3) by changing known props to unknown (ex. "button" | "a").

- added `PolymorphicPropsWithoutRef<D, T, P>` and `PolymorphicPropsWithRef<D, T, P>` as an alternative to using `PolymorphicComponent`, this is useful if user doesn't want to use arrow functions.

- added CHANGELOG.md

### Fixed

- constraints lead to error on @types/react^17. [(#3)](https://github.com/nasheomirro/react-polymorphed/issues/3)

### Changed

- edited README.md to fix typos as well as providing new information regarding added types.

## [2.0.1] - 2023-01-10

### Fixed

- stopped utility types from being implicitly exported.

## [2.0.0] - 2023-01-10

### Fixed

- Inference on props not working correctly. [(#2)](https://github.com/nasheomirro/react-polymorphed/issues/2)
- Incorrect props when dealing with union types. [(#1)](https://github.com/nasheomirro/react-polymorphed/issues/2)

### Changed

- `PolymorphicComponent<T, P, R>` no longer needs `R` to be typed with `Restrict<T>`, instead, `R` is now for adding your own constraints to `T`.

- `PolyForwardMemoExoticComponent<T>` was shortened to `PolyForwardMemoComponent<T>`, this is the same for other exotic components.

### Deprecated

- removed `Restrict<T>`. Checking if the props of `as` was valid and changing it to `never` felt too clunky.

## [1.0.0] - v1.1.2

These versions did not support changelog and is a bit messy to go through, since this package wasn't mature in this state anyways I figured I don't need to tag these versions as only a few had downloaded the package.

### Added

- Typings for polymorphic components.
- Typings to support exotic components.
- Restrict API to constraint `as` and if props of `as` are valid.

[2.1.0]: https://github.com/nasheomirro/react-polymorphed/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/nasheomirro/react-polymorphed/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/nasheomirro/react-polymorphed/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/nasheomirro/react-polymorphed/releases/tag/v1.0.0

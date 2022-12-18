export type CheckProps<Props, PropsToCheck> = PropsToCheck extends Props
  ? PropsToCheck
  : never;

export type Merge<A, B> = Omit<A, keyof B> & B;

// https://stackoverflow.com/questions/55541275/typescript-check-for-the-any-type
// checks if T is strictly any.
export type IfAny<T> = 0 extends 1 & T ? true : false;

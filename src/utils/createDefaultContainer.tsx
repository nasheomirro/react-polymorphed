import React from "react";

/**
 * short-hand for creating default components. **not type-safe**
 */
const createDefaultContainer = <T extends keyof JSX.IntrinsicElements>(
  Component: T
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (props: any) => <Component {...props} />;
};

export default createDefaultContainer;

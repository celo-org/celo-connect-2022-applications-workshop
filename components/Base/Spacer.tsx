import React from "react";

/**
 *
 * Spacer is a styling component that is used to create a space between components.
 * Based on this article from Josh Comeau: https://www.joshwcomeau.com/react/modern-spacer-gif/
 *
 */
const Spacer = ({ size, axis }: { size: number; axis: string }) => {
  const width = axis === "vertical" ? 1 : size;
  const height = axis === "horizontal" ? 1 : size;
  return (
    <span
      style={{
        display: "block",
        width,
        minWidth: width,
        height,
        minHeight: height,
      }}
    />
  );
};
export default Spacer;

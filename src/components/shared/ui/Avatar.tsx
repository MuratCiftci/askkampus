import React from "react";

const Avatar = ({
  src,
  size = "small",
}: {
  src: string;
  size: "small" | "medium" | "large";
}) => {
  const sizes = {
    small: "h-8 w-8",
    medium: "h-10 w-10",
    large: "h-20 w-20",
  };

  return (
    <img
      className={`rounded-full p-1 ring-2 ring-gray-300 dark:ring-gray-500 ${sizes[size]}`}
      src={src}
      alt="Bordered avatar"
    />
  );
};

export default Avatar;

import React from "react";
type Props = {
  type: string;
  children: React.ReactNode;
};

// will be reusable later
const Badge = ({ type, children }: Props) => {
  return (
    <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
      {children}
    </span>
  );
};

export default Badge;

import React from "react";

const PostSkeleton = () => {
  return (
    <div className="flex animate-pulse">
      <div className="flex-shrink-0">
        <span className="block h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></span>
      </div>

      <div className="ml-4 mt-2 w-full">
        <h3
          className="h-4 rounded-md bg-gray-200 dark:bg-gray-700"
          style={{ width: "40%" }}
        ></h3>

        <ul className="mt-5 space-y-3">
          <li className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
          <li className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
          <li className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
          <li className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700"></li>
        </ul>
      </div>
    </div>
  );
};

export default PostSkeleton;

import React from "react";

const Sidebar = () => {
  return (
    <div className="fixed top-12 left-0 flex h-screen w-64 flex-col items-center justify-between overflow-y-auto   bg-white px-8  shadow-md   dark:bg-neutral-900">
      <div className="flex flex-col gap-4">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>
    </div>
  );
};

export default Sidebar;

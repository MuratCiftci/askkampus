import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navbar />
      <Sidebar />
      <div className="z-1 flex min-h-screen flex-col items-center justify-center bg-slate-100 dark:bg-gray-900 py-12 pl-64  ">
        {children}
      </div>
    </main>
  );
};

export default HomeLayout;

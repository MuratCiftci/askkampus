import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      
      <Navbar />
      <Sidebar />
      <div className="flex min-h-screen flex-col items-center justify-center py-12 pl-64 z-1">
        {children}
      </div>
    </main>
  );
};

export default HomeLayout;

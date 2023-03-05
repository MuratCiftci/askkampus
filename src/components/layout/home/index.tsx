import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] pl-64">
      <Navbar />
      <Sidebar />
      {children}
    </main>
  );
};

export default HomeLayout;

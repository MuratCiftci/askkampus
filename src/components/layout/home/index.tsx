import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center pl-64 py-12">
      <Navbar />
      <Sidebar />
      {children}
    </main>
  );
};

export default HomeLayout;

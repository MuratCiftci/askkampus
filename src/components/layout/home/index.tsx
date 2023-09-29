import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navbar />
      <Sidebar>{children}</Sidebar>
    </main>
  );
};

export default HomeLayout;

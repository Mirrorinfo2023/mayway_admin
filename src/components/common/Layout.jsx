import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-3 py-6 bg-gray-50">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

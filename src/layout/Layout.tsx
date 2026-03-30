import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  // Sidebar open by default on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);

  // Close sidebar on resize to mobile
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen((p) => !p)} />

        <main className="flex-1 overflow-y-auto custom-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
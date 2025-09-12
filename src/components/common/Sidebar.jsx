'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { sidebarData } from "../common/sidebarData";
import { clearAuthData } from "@/api/apicall/auth";

const MobileOverlay = ({ isOpen, onClose }) =>
  isOpen ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
      onClick={onClose}
      aria-hidden="true"
    />
  ) : null;

const MobileToggleButton = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    aria-label="Toggle Menu"
  >
    {isOpen ? <X size={24} /> : <Menu size={24} />}
  </button>
);

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const pathname = usePathname();

  const toggleSubmenu = (title) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Open submenu if current path is inside it
  useEffect(() => {
    const openActiveSubmenus = (items) => {
      items.forEach((item) => {
        if (item.path === pathname) return true;
        if (item.submenu && openActiveSubmenus(item.submenu)) {
          setOpenSubmenus((prev) => ({ ...prev, [item.title]: true }));
          return true;
        }
      });
      return false;
    };
    openActiveSubmenus(sidebarData);
  }, [pathname]);

  const handleLogout = () => {
    clearAuthData();
    window.location.href = "/login";
  };

  useEffect(() => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [pathname]);

  const SubmenuItems = ({ submenu, level = 1 }) =>
    submenu.map((subItem, index) => {
      const isActive = subItem.path === pathname;

      if (subItem.submenu) {
        return (
          <div key={index}>
            <button
              onClick={() => toggleSubmenu(subItem.title)}
              className={`flex items-center justify-between w-full ${
                level === 1 ? "px-8" : level === 2 ? "px-10" : "px-12"
              } py-2 hover:bg-blue-600 transition-colors ${
                openSubmenus[subItem.title] ? "bg-blue-600/50" : ""
              } ${level > 1 ? "text-sm" : ""} ${
                level === 3 ? "text-blue-100/90" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {subItem.icon && <span>{subItem.icon}</span>}
                <span className={`${level === 3 ? "text-xs" : ""}`}>{subItem.title}</span>
              </div>
              {openSubmenus[subItem.title] ? <ChevronDown size={level === 3 ? 14 : 16} /> : <ChevronRight size={level === 3 ? 14 : 16} />}
            </button>
            {openSubmenus[subItem.title] && (
              <div className="ml-2">
                <SubmenuItems submenu={subItem.submenu} level={level + 1} />
              </div>
            )}
          </div>
        );
      }

      return (
        <Link
          href={subItem.path}
          onClick={() => setIsSidebarOpen(false)} // close sidebar on mobile
          className={`block ${
            level === 1 ? "px-8" : level === 2 ? "px-10" : "px-12"
          } py-2 hover:bg-blue-600 transition-colors ${
            isActive ? "bg-blue-600/50" : ""
          } ${level > 1 ? "text-sm" : ""} ${
            level === 3 ? "text-blue-100/90 text-xs" : ""
          } flex items-center gap-3`}
        >
          {subItem.icon && <span>{subItem.icon}</span>}
          <span>{subItem.title}</span>
        </Link>
      );
    });

  const renderMenuItem = (item, index) => {
    const isActive = item.path === pathname;

    if (item.submenu) {
      return (
        <div key={index}>
          <button
            onClick={() => toggleSubmenu(item.title)}
            className={`flex items-center justify-between w-full px-4 py-3 text-left hover:bg-blue-600 transition-colors ${
              openSubmenus[item.title] ? "bg-blue-600" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.title}</span>
            </div>
            {openSubmenus[item.title] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <div className={`${openSubmenus[item.title] ? "block" : "hidden"} transition-all duration-200`}>
            <SubmenuItems submenu={item.submenu} />
          </div>
        </div>
      );
    }

    if (item.title === "Logout") {
      return (
        <button
          key={index}
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-blue-600 transition-colors"
        >
          {item.icon}
          <span>{item.title}</span>
        </button>
      );
    }

    return (
      <Link
        key={index}
        href={item.path || "/"}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-600 transition-colors ${
          isActive ? "bg-blue-600" : ""
        }`}
      >
        {item.icon}
        <span>{item.title}</span>
      </Link>
    );
  };

  return (
    <>
      <MobileToggleButton isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <MobileOverlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-blue-700 text-white overflow-y-auto z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 hide-scrollbar ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-blue-800 p-4">
          <h1 className="text-xl font-bold">Mirror Admin</h1>
        </div>

        <nav className="mt-2">{sidebarData.map((item, index) => renderMenuItem(item, index))}</nav>
      </aside>
    </>
  );
};

export default Sidebar;

'use client';
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { logout } from "@/api/apicall/auth";
import { clearAuthData } from "@/api/apicall/auth";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await clearAuthData();
    router.replace("/login");
  };

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 bg-white shadow-md dark:bg-gray-800 z-30">
      <div className="h-16 px-4 flex items-center justify-end gap-4">
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              A
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
              Admin
            </span>
            <ChevronDown className="hidden sm:block h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700">
              <div className="py-1">
                <button
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4" />
                  Your Profile
                </button>
                <button
                  onClick={() => router.push("/settings")}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

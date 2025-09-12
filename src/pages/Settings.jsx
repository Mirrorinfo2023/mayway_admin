import React, { useState } from "react";
import { Save, User, Lock, Bell, Globe, Moon, Sun, Shield, Database } from "lucide-react";
import "../styles/animations.module.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage application settings and preferences</p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-700/50">
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "profile"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabChange("profile")}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "security"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabChange("security")}
                  >
                    <Lock className="h-5 w-5 mr-3" />
                    Security
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "notifications"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabChange("notifications")}
                  >
                    <Bell className="h-5 w-5 mr-3" />
                    Notifications
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "appearance"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabChange("appearance")}
                  >
                    <Globe className="h-5 w-5 mr-3" />
                    Appearance
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "data"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabChange("data")}
                  >
                    <Database className="h-5 w-5 mr-3" />
                    Data Management
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {activeTab === "profile" && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Profile Settings</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      id="two-factor"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="two-factor" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Enable Two-Factor Authentication
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive email alerts for important updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Order Updates</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get notified about order status changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Low Stock Alerts</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Be notified when products reach low stock levels</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Appearance Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          !darkMode
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                        onClick={() => setDarkMode(false)}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <Sun className="h-8 w-8 text-amber-500" />
                        </div>
                        <div className="text-center text-sm font-medium text-gray-900 dark:text-white">Light Mode</div>
                      </div>
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          darkMode
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                        onClick={() => setDarkMode(true)}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <Moon className="h-8 w-8 text-indigo-500" />
                        </div>
                        <div className="text-center text-sm font-medium text-gray-900 dark:text-white">Dark Mode</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "data" && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Data Management</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Database className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Data Export</h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Export all your data in CSV or JSON format. Exports include products, orders, and user data.
                    </p>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Export CSV
                      </button>
                      <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Export JSON
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                      <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
                    </div>
                    <p className="text-xs text-red-500 dark:text-red-400 mb-3">
                      These actions are not reversible. Please be certain before proceeding.
                    </p>
                    <div className="space-y-2">
                      <button className="w-full px-3 py-2 text-xs border border-red-500 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                        Clear All Data
                      </button>
                      <button className="w-full px-3 py-2 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 
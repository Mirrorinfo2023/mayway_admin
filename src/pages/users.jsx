import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david@example.com",
      role: "User",
      status: "Inactive",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [editingUser, setEditingUser] = useState(null);

  // Filter + sort users
  const sortedUsers = useMemo(() => {
    let sortable = [...users].filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [users, sortConfig, searchTerm]);

  // Derived pagination info
  const totalPages = Math.max(
    1,
    Math.ceil(sortedUsers.length / itemsPerPage)
  );
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const requestSort = (key) => {
    let direction = "asc";
    if (
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSaveEdit = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id ? editingUser : u
      )
    );
    setEditingUser(null);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Users Management
      </h1>

      {/* Search */}
      <div className="mb-6 flex items-center bg-white dark:bg-gray-800 shadow rounded-lg px-4 py-2">
        <Search className="text-gray-400 mr-2" size={20} />
        <input
          type="text"
          placeholder="Search users..."
          className="w-full bg-transparent focus:outline-none dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {["Name", "Email", "Role", "Status", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-200 cursor-pointer"
                    onClick={() =>
                      header !== "Actions" &&
                      requestSort(header.toLowerCase())
                    }
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4 dark:text-white">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${user.status === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                        }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      onClick={() => setEditingUser(user)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setCurrentPage((p) => Math.max(1, p - 1))
            }
            disabled={currentPage === 1}
            className="p-2 bg-white dark:bg-gray-700 border rounded disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            disabled={currentPage === totalPages}
            className="p-2 bg-white dark:bg-gray-700 border rounded disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Edit User
            </h2>
            <input
              type="text"
              className="w-full mb-3 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  name: e.target.value,
                })
              }
            />
            <input
              type="email"
              className="w-full mb-3 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  email: e.target.value,
                })
              }
            />
            <select
              className="w-full mb-3 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  role: e.target.value,
                })
              }
            >
              <option>Admin</option>
              <option>User</option>
            </select>
            <select
              className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              value={editingUser.status}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  status: e.target.value,
                })
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

const AllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // useEffect(() => {
  //   fetchVendors();
  // }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch("api/vendors/getall");
      console.log("res is: ", res)
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setVendors(data);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      try {
        const res = await fetch(`https://api.example.com/vendors/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
        setVendors((prev) => prev.filter((v) => v.id !== id));
      } catch (err) {
        console.error("Failed to delete vendor:", err);
      }
    }
  };

  const handleExport = () => {
    if (vendors.length === 0) return alert("No data to export!");
    const worksheet = XLSX.utils.json_to_sheet(vendors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendors");
    XLSX.writeFile(workbook, "vendors.xlsx");
  };

  const handleAddVendor = () => {
    router.push("/vendors_add");
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <h2 className="text-2xl font-bold text-blue-700">All Vendors</h2>

        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-blue-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Export Excel
          </button>

          <button
            onClick={handleAddVendor}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-md font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition duration-300"
          >
            Add Vendor
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-blue-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100 text-blue-800 font-semibold">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Company</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Products</th>
              <th className="border px-4 py-2">Live</th>
              <th className="border px-4 py-2">Inactive</th>
              <th className="border px-4 py-2">Last Update</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-4 text-gray-500">
                  No vendors found.
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor, index) => (
                <tr key={vendor.id} className="hover:bg-blue-50">
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">{vendor.name}</td>
                  <td className="border px-4 py-2">{vendor.email}</td>
                  <td className="border px-4 py-2">{vendor.phone}</td>
                  <td className="border px-4 py-2">{vendor.company}</td>
                  <td className="border px-4 py-2 text-center">{vendor.address}</td>
                  <td
                    className="border px-4 py-2 text-center text-blue-600 cursor-pointer hover:underline"
                    onClick={() => router.push(`/vendors/${vendor.id}/products`)}
                  >
                    {vendor.productCount}
                  </td>
                  <td className="border px-4 py-2 text-center">{vendor.liveProducts}</td>
                  <td className="border px-4 py-2 text-center">{vendor.inactiveProducts}</td>
                  <td className="border px-4 py-2 text-center">{vendor.lastUpdate}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => router.push(`/vendors/edit/${vendor.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(vendor.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllVendors;

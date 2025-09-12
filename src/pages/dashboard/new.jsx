// src/pages/DashboardScreen.jsx

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  User,
  Store,
  ShoppingCart,
  Truck,
  Wallet,
  PackageCheck,
} from "lucide-react";

const statusOptions = ["Pending", "Processing", "Completed", "Cancelled"];

const initialTopStores = [
  { id: 1, name: "Bicycle Shop", amount: 10892.2, status: "Pending" },
  { id: 2, name: "Book Store", amount: 10023.5, status: "Processing" },
  { id: 3, name: "Hanover Electronics", amount: 9590.01, status: "Completed" },
  { id: 4, name: "liceria & co.", amount: 408.0, status: "Cancelled" },
];

const orderStatuses = [
  { label: "Pending", count: 58 },
  { label: "Confirmed", count: 21 },
  { label: "Packaging", count: 9 },
  { label: "Out for delivery", count: 8 },
  { label: "Delivered", count: 77 },
  { label: "Canceled", count: 9 },
  { label: "Returned", count: 4 },
  { label: "Failed", count: 5 },
];

const earnings = [
  { label: "In-house", value: 12755.02 },
  { label: "Commission", value: 1360.0 },
  { label: "Delivery Charge", value: 2343.0 },
  { label: "Tax Collected", value: 8153.0 },
  { label: "Pending", value: 39892.0 },
];

const topCustomers = [
  { name: "Robert", orders: 137 },
  { name: "Devid", orders: 17 },
  { name: "Chris", orders: 5 },
  { name: "Anthony", orders: 3 },
  { name: "Paul", orders: 3 },
  { name: "Tom", orders: 1 },
];

const topVendors = [
  { id: "V001", name: "Trendify", phone: "+91 9876543210", products: 120 },
  { id: "V002", name: "Fashion Hub", phone: "+91 9123456789", products: 85 },
  { id: "V003", name: "Smart Electronics", phone: "+91 9988776655", products: 102 },
  { id: "V004", name: "HomeStyle Decor", phone: "+91 8899001122", products: 76 },
];

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#1e3a8a", "#2563eb"];

const DashboardScreen = () => {
  const [localStores, setLocalStores] = useState(initialTopStores);

  const router = useRouter();
  useEffect(() => {
    const token = sessionStorage.getItem("token"); // or your auth method
    if (!token) {
      router.replace("/login"); // redirect if not logged in
    }
  }, []);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...localStores];
    updated[index].status = newStatus;
    setLocalStores(updated);

    // Example placeholder for API integration
    console.log(`Update store ID ${updated[index].id} to status: ${newStatus}`);
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-blue-800">Welcome, Admin</h1>
      <p className="text-blue-600">Monitor your business with real-time analytics</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: 191, icon: <ShoppingCart className="text-blue-600" /> },
          { label: "Total Stores", value: 10, icon: <Store className="text-blue-600" /> },
          { label: "Total Products", value: 402, icon: <PackageCheck className="text-blue-600" /> },
          { label: "Total Customers", value: 7, icon: <User className="text-blue-600" /> },
        ].map((item, i) => (
          <Card key={i} className="bg-white shadow-xl border-blue-200">
            <CardContent className="flex items-center gap-3 p-5">
              {item.icon}
              <div>
                <p className="text-sm text-blue-500">{item.label}</p>
                <p className="text-2xl font-bold text-blue-900">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earnings}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Store</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {localStores.map((store, index) => (
                <tr key={store.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{store.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">${store.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={store.status}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${store.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-900" title="View Order">
                      <ShoppingCart size={18} />
                    </button>
                    <button className="text-green-600 hover:text-green-900" title="Mark Delivered">
                      <Truck size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900" title="Cancel Order">
                      <Wallet size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Top Products Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topVendors}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="products" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Order Status + Earnings Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={orderStatuses}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {orderStatuses.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={earnings}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Vendors */}
      <Card>
        <CardHeader>
          <CardTitle>Top Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {topVendors.map((vendor) => (
              <li
                key={vendor.id}
                className="bg-blue-100 rounded-md px-4 py-2 flex justify-between items-center"
              >
                <span>{vendor.name}</span>
                <span className="text-sm font-medium text-blue-800">{vendor.products} products</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {topCustomers.map((customer) => (
              <li
                key={customer.name}
                className="flex justify-between bg-blue-100 px-4 py-2 rounded-md"
              >
                <span>{customer.name}</span>
                <span className="font-medium text-blue-800">{customer.orders} orders</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Top Stores */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Stores</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {initialTopStores.map((store) => (
              <li
                key={store.name}
                className="flex justify-between bg-blue-100 px-4 py-2 rounded-md"
              >
                <span>{store.name}</span>
                <span className="font-semibold text-blue-800">
                  ${store.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardScreen;

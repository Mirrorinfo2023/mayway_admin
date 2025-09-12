"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const orderSummary = {
  totalOrders: 1250,
  revenue: 932500,
  pending: 120,
  delivered: 1100,
};

const monthlyOrdersData = [
  { month: "Jan", orders: 240 },
  { month: "Feb", orders: 180 },
  { month: "Mar", orders: 320 },
  { month: "Apr", orders: 400 },
  { month: "May", orders: 290 },
  { month: "Jun", orders: 360 },
];

const topProducts = [
  { name: "Wireless Earbuds", unitsSold: 320 },
  { name: "Smartwatch", unitsSold: 280 },
  { name: "Running Shoes", unitsSold: 240 },
  { name: "Bluetooth Speaker", unitsSold: 210 },
  { name: "Laptop Backpack", unitsSold: 190 },
  { name: "LED Desk Lamp", unitsSold: 160 },
  { name: "Men's T-Shirt", unitsSold: 150 },
  { name: "Coffee Maker", unitsSold: 130 },
];

const orderList = [
  { id: "ORD001", customer: "Ravi Kumar", amount: 1200, status: "Delivered", date: "2025-07-01" },
  { id: "ORD002", customer: "Sneha Patel", amount: 850, status: "Pending", date: "2025-07-02" },
  { id: "ORD003", customer: "Aman Singh", amount: 1450, status: "Cancelled", date: "2025-07-02" },
  { id: "ORD004", customer: "Kavita Joshi", amount: 2300, status: "Delivered", date: "2025-07-03" },
];

const customerStats = [
  { name: "Returning", value: 800 },
  { name: "New", value: 450 },
];

const COLORS = ["#10B981", "#F59E0B"];

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="text-sm text-gray-500">{label}</h3>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function OrderSummaryCards({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <SummaryCard label="Total Orders" value={data.totalOrders} />
      <SummaryCard label="Revenue (₹)" value={data.revenue} />
      <SummaryCard label="Pending Orders" value={data.pending} />
      <SummaryCard label="Delivered Orders" value={data.delivered} />
    </div>
  );
}

function MonthlyOrderChart() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        📈 Monthly Order Analytics
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyOrdersData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#34D399"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function TopProductsChart() {
  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">🏆 Top Selling Products</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topProducts}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="unitsSold" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomerTypeChart() {
  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">👥 Customer Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={customerStats}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {customerStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function OrderTable({ orders }) {
  const [filter, setFilter] = useState("All");
  const filteredOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="mt-6">
      <div className="flex gap-2 mb-3">
        {['All', 'Delivered', 'Pending', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded-full text-sm border ${filter === status ? 'bg-green-500 text-white' : 'text-gray-700 border-gray-300'}`}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-4 py-2">{o.id}</td>
                <td className="px-4 py-2">{o.customer}</td>
                <td className="px-4 py-2">₹{o.amount}</td>
                <td className="px-4 py-2">{o.status}</td>
                <td className="px-4 py-2">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OrderAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <OrderSummaryCards data={orderSummary} />
      <MonthlyOrderChart />
      <TopProductsChart />
      <CustomerTypeChart />
      <OrderTable orders={orderList} />
    </div>
  );
}

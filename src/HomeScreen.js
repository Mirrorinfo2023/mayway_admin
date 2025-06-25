"use client";

import React from "react";
import Link from "next/link";
import {
  FaPhoneAlt,
  FaMoneyCheckAlt,
  FaHistory,
  FaWallet,
  FaHeadset,
  FaQrcode,
  FaBolt,
  FaTv,
  FaFire,
  FaPlane,
  FaShieldAlt,
  FaEllipsisH,
} from "react-icons/fa";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ☀️";
  if (hour < 17) return "Good Afternoon 🌤️";
  if (hour < 20) return "Good Evening 🌇";
  return "Good Night 🌙";
}

const services = [
  { title: "Recharge", icon: <FaPhoneAlt /> },
  { title: "BBPS", icon: <FaMoneyCheckAlt /> },
  { title: "Transactions", icon: <FaHistory /> },
  { title: "Wallet", icon: <FaWallet /> },
  { title: "Support", icon: <FaHeadset /> },
  { title: "Scan & Pay", icon: <FaQrcode /> },
  { title: "Electricity", icon: <FaBolt /> },
  { title: "DTH", icon: <FaTv /> },
  { title: "Gas", icon: <FaFire /> },
  { title: "Flights", icon: <FaPlane /> },
  { title: "Insurance", icon: <FaShieldAlt /> },
  { title: "More", icon: <FaEllipsisH /> },
];

export default function HomeScreen() {
  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-orange-500 text-white p-6">
      <div className="text-3xl font-bold animate-fadeIn">{greeting}</div>
      <div className="text-xl mt-2 opacity-90">Welcome to Mirror Services</div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        {services.map((s, i) => (
          <div
            key={i}
            className="bg-white text-gray-800 rounded-xl p-4 text-center shadow hover:scale-105 transition-transform"
          >
            <div className="text-2xl text-orange-600 mb-2">{s.icon}</div>
            <div className="text-sm font-medium">{s.title}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/Dashboard"
          className="inline-block bg-white text-orange-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-orange-100"
        >
          Go to Dashboard →
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-3">🔥 Trending Offers</h2>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white text-orange-600 p-4 rounded-lg shadow flex-1 min-w-[200px]">
            Get 10% cashback on Recharge
          </div>
          <div className="bg-white text-orange-600 p-4 rounded-lg shadow flex-1 min-w-[200px]">
            Book Flights &amp; Save ₹500
          </div>
          <div className="bg-white text-orange-600 p-4 rounded-lg shadow flex-1 min-w-[200px]">
            Pay Electricity Bill &amp; Win Gifts
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-3">💬 What Our Users Say</h2>
        <div className="bg-white text-gray-800 p-4 rounded-lg shadow mb-4">
          <p>&quot;Mirror Services made my daily payments super easy!&quot;</p>
          <strong>- Rahul M.</strong>
        </div>
        <div className="bg-white text-gray-800 p-4 rounded-lg shadow">
          <p>&quot;Recharge, bills, wallet – all in one place. Love the simplicity!&quot;</p>
          <strong>- Priya S.</strong>
        </div>
      </section>

      <div className="mt-10 text-center">
        <h3 className="text-lg mb-2">Need Help?</h3>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full">
          Contact Support
        </button>
      </div>

      <footer className="mt-10 text-center text-sm opacity-75">
        © 2025 Mirror Services • All rights reserved.
      </footer>
    </div>
  );
}

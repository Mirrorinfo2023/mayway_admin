// Fixed & Professional HomeScreen.js (Line-by-Line Refined)
"use client";

import React from "react";
import Link from "next/link";
import HomePage from "./Shopping";
import {
  homeStyleProducts,
  seasonalProducts,
  gadgetProducts,
} from "../componants/data/promotiondata";

import ExpandableRowWithBoxes from "../componants/PopupMenu.js";
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
  FaChartLine,
  FaHeart,
  FaShareAlt,
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaIdCard,
} from "react-icons/fa";
import Shopping from "./Shopping";
import PromoSection from "../componants/promotion/promotion";


function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ☀️";
  if (hour < 17) return "Good Afternoon 🌤️";
  if (hour < 20) return "Good Evening 🌇";
  return "Good Night 🌙";
}

const services = [
  { title: "Recharge", icon: <FaPhoneAlt />, link: "/recharge" },
  { title: "BBPS", icon: <FaMoneyCheckAlt />, link: "/bbps" },
  { title: "Transactions", icon: <FaHistory />, link: "/transactions" },
  { title: "Wallet", icon: <FaWallet />, link: "/wallet" },
  { title: "Support", icon: <FaHeadset />, link: "/support" },
  { title: "Scan & Pay", icon: <FaQrcode />, link: "/scan-pay" },
  { title: "Electricity", icon: <FaBolt />, link: "/electricity" },
  { title: "DTH", icon: <FaTv />, link: "/dth" },
  { title: "Gas", icon: <FaFire />, link: "/gas" },
  { title: "Flights", icon: <FaPlane />, link: "/flights" },
  { title: "Insurance", icon: <FaShieldAlt />, link: "/insurance" },
  { title: "Pan Card", icon: <FaIdCard />, link: "/pan-card" },
];

const serviceOptionsMap = {
  Recharge: [
    { title: "View Recharge History", icon: <FaHistory />, href: "/recharge/history" },
    { title: "New Recharge", icon: <FaEdit />, href: "/recharge/new" },
    { title: "Favorite Plans", icon: <FaHeart />, href: "/recharge/favorites" },
    { title: "Recharge Reports", icon: <FaChartLine />, href: "/recharge/reports" },
    { title: "Share Recharge", icon: <FaShareAlt />, onClick: () => alert("Share Recharge link") },
    { title: "Delete Saved Number", icon: <FaTrash />, onClick: () => alert("Deleting saved number...") },
  ],
  BBPS: [
    { title: "View Billers", icon: <FaInfoCircle />, href: "/bbps/billers" },
    { title: "New Bill Payment", icon: <FaEdit />, href: "/bbps/new" },
    { title: "BBPS History", icon: <FaHistory />, href: "/bbps/history" },
    { title: "Favorite Billers", icon: <FaHeart />, href: "/bbps/favorites" },
    { title: "BBPS Reports", icon: <FaChartLine />, href: "/bbps/reports" },
    { title: "Share BBPS", icon: <FaShareAlt />, onClick: () => alert("Share BBPS feature") },
  ],
  // ... other serviceOptionsMap entries unchanged
};

export default function HomeScreen() {
  const greeting = getGreeting();
  const rowsData = services.map((s) => ({
    title: s.title,
    icon: s.icon,
    options: serviceOptionsMap[s.title] || [],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-orange-500 text-white p-6 font-sans">
      <div className="flex justify-between items-center text-4xl font-extrabold tracking-tight animate-fadeIn drop-shadow-lg">
        {greeting}

        <div className="flex items-center gap-4">
     <Link href="/cart">
  <div className="text-sm font-semibold text-white bg-blue-500 px-4 py-1.5 rounded-full shadow-md hover:bg-blue-600 transition duration-200 cursor-pointer flex items-center gap-1">
    🛒 Cart
  </div>
</Link>




          <div className="text-base font-semibold text-white bg-orange-500 px-4 py-1 rounded-full shadow hover:bg-orange-600 cursor-pointer">
            Login
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
  <div className="text-xl opacity-90 font-medium">
    Welcome to Mirror Services
  </div>

  <div className="text-sm font-medium text-gray-700">
    Wallet Points <span className="font-semibold">125</span>
  </div>
</div>





      <section className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {rowsData.map((row, idx) => (
            <ExpandableRowWithBoxes
              key={idx}
              title={row.title}
              icon={row.icon}
              options={row.options}
            />
          ))}
        </div>
      </section>

      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
        {services.map((s, i) => (
          <Link key={i} href={s.link} className="block">
            <div className="bg-white bg-opacity-90 backdrop-blur-md border border-white/40 rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="text-3xl text-orange-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </div>
              <div className="text-base font-semibold text-gray-700">
                {s.title}
              </div>
            </div>
          </Link>
        ))}
      </div> */}

      <div className="mt-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">
          Unlock More Power. Scale Your Business.
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 font-medium mb-6 max-w-2xl mx-auto">
          Access advanced features, real-time reports, and premium tools — all in one seamless dashboard experience.
        </p>
        <Link
          href="/Dashboard"
          className="inline-block bg-orange-600 text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-orange-700 transition duration-300"
        >
          Go to Dashboard →
        </Link>
      </div>





      <div>
        <h1 className="text-2xl font-bold text-center my-4">Mirror Shopping</h1>
        <Shopping />
      </div>


      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-3">🔥 Trending Offers</h2>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white text-orange-600 p-4 rounded-lg shadow flex-1 min-w-[200px]">
            Get 10% cashback on Recharge
          </div>
          <div className="bg-white text-orange-600 p-4 rounded-lg shadow flex-1 min-w-[200px]">
            Book Flights & Save ₹500
          </div>
          <div className="bg-white text-orange-600 p-4 rounded-lg shadow flex-1 min-w-[200px]">
            Pay Electricity Bill & Win Gifts
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-3">💬 What Our Users Say</h2>
        <div className="bg-white text-gray-800 p-4 rounded-lg shadow mb-4">
          <p>Mirror Services made my daily payments super easy</p>
          <strong>- Maruti V.</strong>
        </div>
        <div className="bg-white text-gray-800 p-4 rounded-lg shadow">
          <p>Recharge, bills, wallet  all in one place. Love the simplicity</p>
          <strong>- Priya S.</strong>
        </div>
      </section>

      <div className="mt-10 text-center">
        <h3 className="text-lg mb-2 font-semibold text-white">
          Need Help?
        </h3>
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

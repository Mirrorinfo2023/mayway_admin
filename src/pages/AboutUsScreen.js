"use client";

import React from "react";
import "../app/globals.css";
import { FaArrowUp, FaAndroid, FaApple } from "react-icons/fa";

export default function AboutUsScreen() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-50 text-gray-800 p-4 sm:p-6 md:p-10 relative">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-8 sm:p-10 animate-fadeIn">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-600 text-center mb-4">
          About Mirror Services
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 text-center mb-8 font-medium">
          Simplifying Your Daily Transactions with Speed, Safety & Support.
        </p>

        <div className="space-y-6 leading-relaxed text-base sm:text-lg text-gray-700">
          <p>
            <strong className="text-orange-600">Mirror Services</strong> is a
            one-stop digital platform designed to streamline your daily
            financial tasks. Whether it s mobile recharges, bill payments,
            flight bookings, or wallet management — Mirror makes it seamless
            and secure.
          </p>
          <p>
            With a modern and user-friendly interface, we empower users to
            manage everything in one place with just a few taps. From first-time
            users to advanced professionals, our tools are built for everyone.
          </p>
          <p>
            We believe in transparency, speed, and helping you stay in control
            of your money. That s why Mirror is built with the latest technology
            stack and strong encryption practices.
          </p>
          <p>
            Our goal? To become India most trusted platform for everyday
            digital services.
          </p>
        </div>

        <div className="mt-10 bg-orange-50 border border-orange-200 p-6 rounded-xl">
          <h3 className="text-2xl font-semibold text-orange-500 mb-2">
            Our Mission
          </h3>
          <p className="text-gray-700 text-base sm:text-lg">
            Empower every Indian with seamless access to digital financial
            services through speed, trust, and innovation.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-orange-500 mb-4 text-center">
            Our Core Values
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-800 text-base sm:text-lg pl-4 sm:pl-6">
            <li>⚡ Speed and Reliability</li>
            <li>🔒 Secure & Encrypted Transactions</li>
            <li>🧡 User-Centric Support</li>
            <li>📊 Transparent Reporting</li>
            <li>🌍 Expanding Digital Access</li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-orange-500 mb-2">
            Meet the Team
          </h2>
          <p className="text-gray-600 mb-4">
            Our passionate team works tirelessly to bring the best digital
            experience to your fingertips.
          </p>
          <div className="text-sm text-gray-400 italic">
            (Team info coming soon...)
          </div>
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-md sm:text-lg font-semibold">Download Our App</p>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow transition"
            >
              <FaAndroid className="text-xl" />
              Android
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-full shadow transition"
            >
              <FaApple className="text-xl" />
              iOS
            </a>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-md sm:text-lg">Need help or have questions?</p>
          <a
            href="mailto:support@mirrorservices.in"
            className="text-orange-600 font-bold hover:underline text-lg"
          >
            support@mirrorservices.in
          </a>
        </div>
      </div>

      <footer className="text-center text-sm text-gray-500 mt-10 mb-6">
        © 2025 Mirror Services • All rights reserved.
      </footer>

      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-all"
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </div>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import "../app/globals.css";
const MirrorBusiness = () => {
  const keyFeatures = [
    "All-in-one service portal (Recharge, BBPS, PAN, AEPS)",
    "Attractive commission structure",
    "Referral bonuses & rewards",
    "User-friendly business dashboard",
    "24/7 transaction support",
    "Training & marketing support",
    "Real-time reporting and analytics",
    "Instant settlement for transactions",
  ];

  const benefits = [
    "Start your own business with zero investment",
    "Expand your earning potential through referrals",
    "Operate digitally from anywhere",
    "Serve your local community with digital solutions",
    "Get access to tools and support to grow",
    "No technical knowledge required to start",
    "Flexibility to work on your own schedule",
    "Become part of a growing digital revolution",
  ];

  const platforms = [
    "Android (Google Play Store)",
    "iOS (App Store)",
    "Web Browser",
    "Windows (PWA/Desktop App)",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-50 p-6 text-gray-800">
      <header className="text-4xl font-bold text-center text-orange-600 mb-10">
        Mirror Business
      </header>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white rounded-xl shadow-md p-6 mb-10">
        <div className="flex-1 space-y-4">
          <p className="text-lg leading-relaxed">
            <strong className="text-orange-600">Mirror Business</strong> empowers individuals and small businesses to earn by offering digital services like recharge, bill payments, wallet loading, and more. Be your own boss by becoming a Mirror Business Partner and grow your network while earning commissions.
          </p>
          <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-700 transition">
            Join Now
          </button>
        </div>
        <div className="flex-1">
          <Image
            src="/img_4.png"
            alt="Mirror Business"
            width={400}
            height={300}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-4 mb-10">
        <p className="text-base leading-relaxed">
          Mirror Business is an inclusive platform designed for entrepreneurs, shopkeepers, and individuals looking to earn from their smartphones or desktops.
        </p>
        <p className="text-base leading-relaxed">
          Our mission is to make entrepreneurship accessible to everyone by providing the tools and support needed to build a successful digital business.
        </p>
        <p className="text-base leading-relaxed">
          We believe that digital empowerment is the key to economic freedom. Whether you’re in a metro city or a rural village, Mirror Business enables you to earn and grow.
        </p>
      </div>

      {/* Key Features */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-orange-500 mb-4">Key Features</h2>
        <ul className="space-y-3">
          {keyFeatures.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
              <span className="text-gray-700 text-base">{`0${idx + 1}. ${feature}`}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Why Join */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-orange-500 mb-4">Why Join Mirror Business?</h2>
        <ul className="space-y-3">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
              <span className="text-gray-700 text-base">{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Platforms */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-orange-500 mb-4">Platforms Available On</h2>
        <ul className="space-y-3">
          {platforms.map((platform, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
              <span className="text-gray-700 text-base">{platform}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Final CTA */}
      <div className="text-center mt-10">
        <p className="text-base mb-4">
          Ready to take control of your income? Mirror Business gives you everything you need to launch your digital journey today.
        </p>
        <button className="bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition">
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default MirrorBusiness;

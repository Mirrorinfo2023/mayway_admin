'use client';

import React from 'react';
import Header from '../componants/Header';
import HeroBanner from '../componants/HeroBanner';
import ProductCard from '../componants/ProductCard';
import FlashSale from '../componants/FlashSale';
import PromoSection from '../componants/promotion/promotion';
import CarouselSlider from '../componants/CarouselSlider';
import ProductGridCard from '../componants/ProductGridCard';
import Image from 'next/image';
import {
  homeStyleProducts,
  seasonalProducts,
  gadgetProducts,
  bestSellerProducts,
  Productcategories,
  sampleProducts,
} from '../componants/data/promotiondata';

import {
  categories,
  featuredProducts,
  flashSaleProducts,
} from '../componants/data/shoppingdata';

export default function Shopping() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="pt-6">
          <CarouselSlider />
        </div> */}

        <div className="mt-8">
          <HeroBanner />
        </div>

        <section className="my-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"> Best Sellers</h2>
            <a href="#" className="text-blue-600 hover:underline text-sm">View All</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellerProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative group"
              >
                <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                  Best Seller
                </span>

                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                />

                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold text-base">
                    ₹{product.price}
                  </span>
                  <button className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="my-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">⭐ Featured Products</h2>
            <a href="#" className="text-blue-600 hover:underline text-sm">View All</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </section>

        <section className="my-12">
          <FlashSale products={flashSaleProducts} />
        </section>

        <section className="my-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <PromoSection title=" Make Your Home Stylish" products={homeStyleProducts} />
            <PromoSection title=" Season’s Top Picks" products={seasonalProducts} />
            <PromoSection title=" Trending Gadgets & Appliances" products={gadgetProducts} />
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-xl font-bold mb-3">🛍️ Shop by Category</h2>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-2 snap-x snap-mandatory">
              {Productcategories.map((category, index) => (
                <div
                  key={index}
                  className="snap-start flex flex-col items-center text-center min-w-[80px] w-[100px] flex-shrink-0"
                >
                  <div className="bg-pink-100 rounded-full p-3 w-[80px] h-[80px] flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-110">
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={300}
                      height={300}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-2">{category.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="my-12">
          <h2 className="text-xl font-bold mb-4">✨ Recommended for You</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sampleProducts.map((product, idx) => (
              <ProductGridCard key={idx} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

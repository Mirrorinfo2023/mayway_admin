// components/PromoSection.jsx
import React from "react";
import Image from 'next/image';
export default function PromoSection({ title, products }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow border w-full md:w-[32%]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <span className="text-blue-600 cursor-pointer">➡️</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {products.map((item, index) => (
          <div key={index} className="text-center">
            <Image
  src={item.image}
  alt={item.title}
  width={80}
  height={80}
  className="w-full h-20 object-contain rounded mb-1"
/>
            <p className="text-sm font-medium text-gray-800 leading-tight truncate">
              {item.title}
            </p>
            <p className="text-xs text-green-600 font-semibold">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

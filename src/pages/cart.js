'use client';
import React, { useState } from 'react';
import "../app/globals.css";
import Image from 'next/image';

const initialCartItems = [
  {
    id: 1,
    name: 'Artificial Bonsai Plant',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=80',
    price: 131,
    quantity: 1,
    seller: 'A.k RETAILDELHI',
    size: 'Free Size',
  },
  {
    id: 2,
    name: 'Bluetooth Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155228f7f9?auto=format&fit=crop&w=400&q=80',
    price: 899,
    quantity: 2,
    seller: 'SoundTech',
    size: 'Universal',
  },
  {
    id: 3,
    name: 'Running Shoes - Men',
    image: 'https://images.unsplash.com/photo-1584865283063-b4b1d1bc85c5?auto=format&fit=crop&w=400&q=80',
    price: 1299,
    quantity: 1,
    seller: 'Sporto',
    size: 'UK 9',
  },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleQtyChange = (id, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-4 rounded shadow border border-blue-100">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-blue-800">
            🛒 Product Details
          </h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="border rounded p-4 flex gap-4 items-start mb-4 hover:shadow transition"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <button className="text-blue-600 text-sm font-medium">
                    EDIT
                  </button>
                </div>
                <p className="text-gray-600 mt-1 text-sm">
                  All issue easy returns
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Size: {item.size}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleQtyChange(item.id, -1)}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold"
                  >
                    -
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleQtyChange(item.id, 1)}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold"
                  >
                    +
                  </button>
                </div>

                <button className="mt-2 text-sm text-red-500 hover:underline">
                  ✕ REMOVE
                </button>

                <div className="mt-2 font-bold text-lg text-orange-600">
                  ₹{item.price * item.quantity}
                </div>
              </div>
              <div className="text-sm text-right text-gray-600 whitespace-nowrap">
                <p>Sold by: {item.seller}</p>
                <p className="text-green-600 font-medium">Free Delivery</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Price Summary */}
        <div className="bg-white p-4 rounded shadow h-fit border border-orange-200">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-orange-600">
            💰 Price Details ({cartItems.length} Items)
          </h2>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Total Product Price</span>
              <span>+ ₹{subtotal}</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-base">
              <span>Order Total</span>
              <span>₹{subtotal}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Clicking on Continue will not deduct any money
          </p>

          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 mt-4 rounded font-semibold">
            Continue
          </button>

          <div className="flex items-center gap-2 mt-4 text-xs bg-gray-100 p-2 rounded">
            <Image
              src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/delivery.png"
              alt="Delivery Safety"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div>
              <p className="font-semibold text-blue-800">Your Safety, Our Priority</p>
              <p className="text-gray-600">
                We ensure your package is safe at every point of contact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

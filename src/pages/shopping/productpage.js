import React, { useState } from 'react';

const ProductPage = () => {
  const images = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1603415526960-fb4d996345c5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585386959984-a4155229a19a?auto=format&fit=crop&w=800&q=80',
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left - Images */}
      <div>
        <div className="border rounded-lg overflow-hidden">
          <img src={selectedImage} alt="Selected" className="w-full object-cover rounded" />
        </div>
        <div className="flex gap-3 mt-4">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Thumb ${i}`}
              className={`w-20 h-20 object-cover border rounded cursor-pointer ${selectedImage === img ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Right - Info */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700">SOLSTICE</h2>
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          Men Solid Round Neck Elastane Red T-Shirt
        </h1>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-green-700">₹292</span>
          <span className="text-sm text-gray-400 line-through">₹999</span>
          <span className="text-green-600 text-sm font-medium">70% off</span>
        </div>

        <p className="text-sm text-gray-600 mb-4">★ 4.1 | 490 ratings & 31 reviews</p>

        <div className="mb-4">
          <p className="font-semibold text-sm mb-1">Available Colors</p>
          <div className="flex gap-2">
            {images.map((img, i) => (
              <img key={i} src={img} alt="Color" className="w-10 h-10 rounded-full border object-cover" />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="font-semibold text-sm mb-1">Select Size</p>
          <div className="flex gap-3">
            {['M', 'L', 'XL', 'XXL'].map((size) => (
              <button key={size} className="px-4 py-1 border text-sm rounded hover:bg-blue-100">
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">
            Add to Cart
          </button>
          <button className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
            Buy Now
          </button>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Available Offers</h3>
          <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
            <li>10% Cashback on Axis Bank UPI</li>
            <li>5% Cashback on Flipkart Axis Card</li>
            <li>10% off on BOB EMI Transactions</li>
            <li>10% off up to ₹1250 on IDFC EMI</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

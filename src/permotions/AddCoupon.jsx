import React, { useState } from "react";

const AddCoupon = () => {
  const [coupon, setCoupon] = useState({
    code: "",
    type: "percentage", // percentage or fixed
    value: "",
    expiry: "",
  });

  const handleChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Coupon Submitted:", coupon);
    // API call or logic here
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Coupon</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <input
            type="text"
            name="code"
            value={coupon.code}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="E.g. SAVE20"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
          <select
            name="type"
            value={coupon.type}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
          <input
            type="number"
            name="value"
            value={coupon.value}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={coupon.type === "percentage" ? "E.g. 20 for 20%" : "E.g. 100 for ₹100"}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            type="date"
            name="expiry"
            value={coupon.expiry}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Coupon
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoupon;

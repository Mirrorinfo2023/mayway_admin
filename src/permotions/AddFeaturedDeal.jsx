import React, { useState } from "react";

const AddFeaturedDeal = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "BOGO",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Featured Deal:", formData);
    // You can add API integration here
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Add Featured Deal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Deal Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Deal Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Summer Sale BOGO"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Buy One Get One Free on all T-Shirts"
          />
        </div>

        {/* Deal Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Deal Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="BOGO">BOGO</option>
            <option value="Discount">Discount</option>
            <option value="Cashback">Cashback</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Add Deal
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFeaturedDeal;

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { post } from '@/utils/network';

export default function CreateCategoryForm() {
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryType: 'Main',
    isActive: true,
    icon: '',
    subCategories: [
      {
        subCategoryName: '',
        subCategoryType: 'Sub',
        isActive: true,
        icon: '',
      },
    ],
  });

  const handleInputChange = (e, index = null, isSub = false) => {
    const { name, value } = e.target;
    if (isSub && index !== null) {
      const updatedSub = [...formData.subCategories];
      updatedSub[index][name] = value;
      setFormData({ ...formData, subCategories: updatedSub });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await post(
        'https://secure.aladin25.live/api/catagory/createcategories',
        formData
      );
      alert(' Category created!');
      console.log(res);
      setFormData({
        categoryName: '',
        categoryType: 'Main',
        isActive: true,
        icon: '',
        subCategories: [
          {
            subCategoryName: '',
            subCategoryType: 'Sub',
            isActive: true,
            icon: '',
          },
        ],
      });
    } catch (err) {
      console.error(err);
      alert(' Failed to create category.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          Create Category
        </h2>

        {/* Category Name */}
        <input
          name="categoryName"
          placeholder="Category Name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.categoryName}
          onChange={handleInputChange}
        />

        {/* Category Icon */}
        <input
          name="icon"
          placeholder="Category Icon URL"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.icon}
          onChange={handleInputChange}
        />

        {/* Subcategory */}
        <div className="space-y-2 mt-4">
          <h3 className="font-semibold text-lg">Subcategory</h3>

          <input
            name="subCategoryName"
            placeholder="Subcategory Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.subCategories[0].subCategoryName}
            onChange={(e) => handleInputChange(e, 0, true)}
          />

          <input
            name="icon"
            placeholder="Subcategory Icon URL"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.subCategories[0].icon}
            onChange={(e) => handleInputChange(e, 0, true)}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
           Create Category
        </Button>
      </form>
    </div>
  );
}

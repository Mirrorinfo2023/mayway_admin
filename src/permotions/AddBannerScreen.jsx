import React, { useState } from "react";
import { useForm } from "react-hook-form";

const AddBannerScreen = () => {
  const { register, handleSubmit, reset } = useForm();
  const [previewImage, setPreviewImage] = useState(null);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data) => {
    if (!data.image[0]) {
      alert("Please select an image");
      return;
    }

    // Simulate upload
    console.log("Banner Data:", data);

    alert("Banner saved successfully!");
    reset();
    setPreviewImage(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Add New Banner</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Image Picker */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Banner Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={onImageChange}
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-3 h-48 w-full object-cover rounded"
            />
          )}
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter banner title"
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            {...register("description", { required: true })}
            rows="3"
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter banner description"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Banner
        </button>
      </form>
    </div>
  );
};

export default AddBannerScreen;

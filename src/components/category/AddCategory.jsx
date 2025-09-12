import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createCategory,
  selectSelectedCategory,
  selectCategoryStatus,
  selectCategoryError,
  clearSelectedCategory,
  updateCategory,
} from "../../redux/slices/categorySlice";
import { X, Image as ImageIcon, Upload, AlertCircle, ArrowLeft, Save } from "lucide-react";
import { toast } from "react-hot-toast";

// Helper function to compress image
const compressImage = (file, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Get compressed base64 image
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
        resolve(compressedBase64);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const AddCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedCategory = useSelector(selectSelectedCategory);
  const status = useSelector(selectCategoryStatus);
  const error = useSelector(selectCategoryError);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
    icon: "",
  });
  const [iconPreview, setIconPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name,
        description: selectedCategory.description,
        is_active: selectedCategory.is_active,
        icon: selectedCategory.icon || "",
        _id: selectedCategory._id,
      });
      if (selectedCategory.icon) {
        setIconPreview(selectedCategory.icon);
      }
    }
  }, [selectedCategory]);

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type. Please upload a JPEG, PNG, or GIF image.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size too large. Please upload an image smaller than 5MB.");
    }
  };

  const handleFile = async (file) => {
    try {
      setUploadError(null);
      validateFile(file);

      // Compress image and convert to base64
      const compressedBase64 = await compressImage(file);
      setIconPreview(compressedBase64);
      setFormData((prev) => ({ ...prev, icon: compressedBase64 }));
    } catch (err) {
      setUploadError(err.message);
      console.error("Error processing image:", err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleIconChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeIcon = () => {
    setIconPreview(null);
    setFormData((prev) => ({ ...prev, icon: "" }));
    setUploadError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        // Show loading toast for update
        toast.loading("Updating category...");
        const result = await dispatch(updateCategory({ ...formData })).unwrap();
        if (result.responseCode === 1) {
          toast.success("Category updated successfully!");
          dispatch(clearSelectedCategory());
          navigate("/category-list");
        } else {
          toast.error(result.responseMessage || "Failed to update category");
        }
      } else {
        // Show loading toast for creation
        toast.loading("Creating new category...");
        const result = await dispatch(
          createCategory({
            ...formData,
          })
        ).unwrap();
        if (result.responseCode === 1) {
          toast.success("Category created successfully!");
          dispatch(clearSelectedCategory());
          navigate("/category-list");
        } else {
          toast.error(result.responseMessage || "Failed to create category");
        }
      }
    } catch (err) {
      console.error("Failed to save category:", err);
      toast.error(err.message || "An error occurred while saving the category");
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      is_active: true,
      icon: "",
    });
    setIconPreview(null);
    dispatch(clearSelectedCategory());
    toast.success("Form reset successfully");
  };

  return (
    <div className="min-h-screen py-4 px-3 sm:py-8 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/category-list")}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-3 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Categories
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {selectedCategory ? "Edit Category" : "Add New Category"}
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden">
          {error && (
            <div className="border-b border-red-200 bg-red-50 px-4 sm:px-6 py-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <p className="ml-3 text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Category Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                placeholder="Enter category name"
                required
                disabled={status === "loading"}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                rows="4"
                placeholder="Enter category description"
                disabled={status === "loading"}
              />
            </div>

            {/* Category Icon */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">Category Icon</label>

              {/* Upload Area */}
              <div
                className={`relative group cursor-pointer rounded-xl transition-all duration-200 ${
                  dragActive
                    ? "border-2 border-blue-500 bg-blue-50"
                    : iconPreview
                    ? "border-2 border-gray-200 bg-white"
                    : "border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col items-center">
                    {iconPreview ? (
                      <div className="relative">
                        <img src={iconPreview} alt="Icon preview" className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-xl shadow-sm" />
                        <button
                          type="button"
                          onClick={removeIcon}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm"
                          disabled={status === "loading"}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="p-4 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-all duration-200 shadow-sm">
                          <ImageIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-gray-700">Drag and drop your image here</p>
                        <p className="mt-1.5 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        <button
                          type="button"
                          onClick={() => document.getElementById("icon-upload").click()}
                          className="mt-4 inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                          disabled={status === "loading"}
                        >
                          <Upload className="h-4 w-4 mr-2 text-gray-400" />
                          Upload Image
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <input
                id="icon-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleIconChange}
                className="hidden"
                disabled={status === "loading"}
              />
              {uploadError && (
                <p className="mt-2 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  {uploadError}
                </p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">Active Status</span>
                <span className="text-xs text-gray-500 mt-0.5">
                  {formData.is_active ? "Category is visible to users" : "Category is hidden from users"}
                </span>
              </div>
              <div className="relative inline-block w-14 align-middle select-none">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  disabled={status === "loading"}
                />
                <label
                  htmlFor="is_active"
                  className={`toggle-label block h-7 rounded-full cursor-pointer transition-colors duration-200 ${
                    formData.is_active ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-sm"
                  disabled={status === "loading"}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {selectedCategory ? "Update Category" : "Add Category"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Custom CSS for toggle switch */}
      <style jsx>{`
        .toggle-checkbox {
          top: 4px;
          left: 4px;
          transition: transform 0.2s ease-in-out;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .toggle-checkbox:checked {
          transform: translateX(150%);
        }
        .toggle-checkbox:not(:checked) {
          transform: translateX(0);
        }
        .toggle-label {
          transition: background-color 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AddCategory;

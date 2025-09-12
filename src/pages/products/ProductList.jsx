import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchProducts,
  updateFilters,
  updatePagination,
  deleteProduct,
  selectAllProducts,
  selectProductStatus,
  selectProductError,
  selectProductFilters,
  selectProductPagination,
  selectProductCategories,
  selectProductStats,
} from "../redux/slices/productSlice";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);
  const filters = useSelector(selectProductFilters);
  const pagination = useSelector(selectProductPagination);
  const categories = useSelector(selectProductCategories);
  const stats = useSelector(selectProductStats);

  console.log("ProductList - Redux state:", {
    products,
    status,
    filters,
    pagination,
    stats,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch products on component mount or when filters/pagination change
  useEffect(() => {
    dispatch(
      fetchProducts({
        filters,
        pagination,
      })
    );
  }, [dispatch, filters, pagination]);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    dispatch(updateFilters({ search: value }));
  };

  // Clear search
  const handleClearSearch = () => {
    dispatch(updateFilters({ search: '' }));
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    dispatch(updateFilters({ [name]: value }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    dispatch(updatePagination({ currentPage: page }));
  };

  // Handle reset filters
  const handleResetFilters = () => {
    dispatch(
      updateFilters({
        category: "all",
        status: "all",
        sortBy: "newest",
        search: "",
        prescriptionRequired: undefined,
      })
    );
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteProduct(selectedProduct.id));
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "out_of_stock":
        return "Out of Stock";
      case "low_stock":
        return "Low Stock";
      default:
        return status;
    }
  };

  if (status === "loading" && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "failed" && error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 text-xl">Failed to load products</div>
        <p className="text-gray-500 mt-2">{error}</p>
        <button
          onClick={() => dispatch(fetchProducts({ filters, pagination }))}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Products
          </h1>
          <Link
            to="/add-product"
            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="mr-2" />
            Add New Product
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-semibold text-gray-800">
              {stats.total}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-semibold text-green-600">
              {stats.active}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">Low Stock</p>
            <p className="text-2xl font-semibold text-yellow-600">
              {stats.lowStock}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">Out of Stock</p>
            <p className="text-2xl font-semibold text-red-600">
              {stats.outOfStock}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">Featured</p>
            <p className="text-2xl font-semibold text-purple-600">
              {stats.featured}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">Prescription Required</p>
            <p className="text-2xl font-semibold text-blue-600">
              {stats.prescription}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
            <div className="relative w-full md:w-64 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.search || ''}
                onChange={handleSearch}
              />
              <FiSearch
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              {filters.search && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>

            <div className="flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
              >
                <FiFilter className="mr-2" size={16} />
                Filters
              </button>

              {Object.values(filters).some(
                (value) =>
                  value !== "all" &&
                  value !== "" &&
                  value !== undefined &&
                  value !== "newest"
              ) && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                {/* Prescription Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prescription
                  </label>
                  <select
                    value={
                      filters.prescriptionRequired === undefined
                        ? "all"
                        : filters.prescriptionRequired.toString()
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      handleFilterChange(
                        "prescriptionRequired",
                        val === "all" ? undefined : val === "true"
                      );
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="true">Required</option>
                    <option value="false">Not Required</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Prescription
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Updated
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={
                                product.images && product.images.length > 0
                                  ? product.images[0]
                                  : "https://placehold.co/100x100/e2e8f0/64748b?text=No+Image"
                              }
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatPrice(product.price)}
                        </div>
                        {product.discount > 0 && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(product.mrp)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                            product.status
                          )}`}
                        >
                          {getStatusLabel(product.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.prescriptionRequired ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Required
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Not Required
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(product.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/products/${product.id}`)
                            }
                            className="text-gray-600 hover:text-gray-900"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/edit-product/${product.id}`)
                            }
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Product"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Product"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center">
                      <div className="text-gray-500">
                        No products found. Try adjusting your filters or adding
                        a new product.
                      </div>
                      <Link
                        to="/add-product"
                        className="inline-flex items-center px-4 py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <FiPlus className="mr-2" />
                        Add New Product
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}
              </span>{" "}
              of <span className="font-medium">{pagination.totalItems}</span>{" "}
              products
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`px-3 py-2 rounded-md ${
                  pagination.currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FiChevronLeft size={16} />
              </button>

              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-2 rounded-md ${
                    pagination.currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-3 py-2 rounded-md ${
                  pagination.currentPage === pagination.totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiTrash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the product "
                        {selectedProduct.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

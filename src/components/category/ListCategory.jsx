import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  fetchCategories,
  deleteCategory,
  setSelectedCategory,
  selectAllCategories,
  selectCategoryStatus,
  selectCategoryError,
  setPage,
  setLimit,
  selectCategoryStats,
  clearSelectedCategory,
  fetchCategoryAnalytics,
  selectAnalytics,
  selectAnalyticsStatus,
  clearSearch,
  setFilters,
  selectFilters,
  toggleCategoryStatus,
} from "../../redux/slices/categorySlice";
import { Edit, Trash2, Power, PowerOff, ChevronLeft, ChevronRight, TrendingUp, Package, Users, Search, X, RefreshCw } from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const ListCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectAllCategories);
  const status = useSelector(selectCategoryStatus);
  const error = useSelector(selectCategoryError);
  const stats = useSelector(selectCategoryStats);
  const analytics = useSelector(selectAnalytics);
  const filters = useSelector(selectFilters);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadCategories();
    dispatch(clearSelectedCategory());
    dispatch(fetchCategoryAnalytics());
  }, [dispatch, filters, currentPage, itemsPerPage]);

  const loadCategories = () => {
    dispatch(
      fetchCategories({
        page: currentPage,
        limit: itemsPerPage,
        ...filters,
      })
    );
  };

  const filteredCategories = categories.filter(category => {
    const statusMatch = (() => {
      if (filters.include_deleted) {
        return category.is_deleted;
      }
      if (filters.is_active === true) {
        return category.is_active && !category.is_deleted;
      }
      if (filters.is_active === false) {
        return !category.is_active && !category.is_deleted;
      }
      return !category.is_deleted;
    })();
  
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = searchTerm === "" || (
      category.name.toLowerCase().includes(searchLower) ||
      (category.description && category.description.toLowerCase().includes(searchLower))
    );

    return statusMatch && searchMatch;
  });

  const handleEdit = (category) => {
    dispatch(setSelectedCategory(category));
    navigate("/category-add");
    toast.success("Editing category: " + category.name);
  };

  const handleDelete = async (category) => {
    try {
      if (!category.is_deleted) {
        toast.loading("Deleting category...");
        const result = await dispatch(deleteCategory(category)).unwrap();
        if (result.responseCode === 1) {
          loadCategories();
          toast.success("Category deleted successfully");
        } else {
          toast.error(result.responseMessage || "Failed to delete category");
        }
      } else {
        const result = await dispatch(deleteCategory(category)).unwrap();
        if (result.responseCode === 1) {
          loadCategories();
          toast.success("Category restored successfully");
        } else {
          toast.error(result.responseMessage || "Failed to restore category");
        }
      }
    } catch (err) {
      console.error("Failed to process category:", err);
      toast.error("Failed to process category: " + (err.message || "Unknown error"));
    }
  };

  const handleToggleActive = async (category) => {
    try {
      const result = await dispatch(toggleCategoryStatus(category)).unwrap();
      if (result.responseCode === 1) {
        loadCategories();
        toast.success(
          category.is_active 
            ? "Category deactivated successfully" 
            : "Category activated successfully"
        );
      } else {
        toast.error(result.responseMessage || "Failed to update category status");
      }
    } catch (err) {
      console.error("Failed to toggle category status:", err);
      toast.error("Failed to update category status: " + (err.message || "Unknown error"));
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    dispatch(setLimit(newLimit));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
    setCurrentPage(1);
  };
  const getDropdownValue = () => {
    if (filters.include_deleted) return "deleted";
    if (filters.is_active === undefined) return "all";
    return filters.is_active.toString();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 sm:p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Categories</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{analytics.stats.total}</h3>
                </div>
                <div className="bg-blue-100 p-3 sm:p-4 rounded-xl">
                  <Package className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 sm:p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Categories</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{analytics.stats.active}</h3>
                </div>
                <div className="bg-green-100 p-3 sm:p-4 rounded-xl">
                  <Users className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 sm:p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Inactive Categories</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{analytics.stats.inactive}</h3>
                </div>
                <div className="bg-yellow-100 p-3 sm:p-4 rounded-xl">
                  <PowerOff className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 sm:p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Deleted Categories</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{analytics.stats.deleted}</h3>
                </div>
                <div className="bg-red-100 p-3 sm:p-4 rounded-xl">
                  <Trash2 className="h-6 w-6 sm:h-7 sm:w-7 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Category Growth Chart */}
            <div className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 sm:p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Growth</h3>
              <div className="p-2">
                <Line
                  data={{
                    labels: analytics.chartData.categoryGrowth.labels,
                    datasets: analytics.chartData.categoryGrowth.datasets,
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                          font: {
                            size: 12
                          }
                        }
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0,0,0,0.05)",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Category Distribution Chart */}
            <div className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 sm:p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Distribution</h3>
              <div className="p-2">
                <Doughnut
                  data={{
                    labels: analytics.chartData.categoryDistribution.labels,
                    datasets: [
                      {
                        data: analytics.chartData.categoryDistribution.data,
                        backgroundColor: analytics.chartData.categoryDistribution.colors,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                          font: {
                            size: 12
                          }
                        },
                      },
                    },
                    cutout: "60%",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Top Categories Table */}
        {analytics && (
          <div className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-5 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-5 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Products</th>
                    <th className="px-5 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Products</th>
                    <th className="px-5 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Growth</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {analytics.chartData.topCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                      <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{category.totalProducts}</div>
                      </td>
                      <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{category.activeProducts}</div>
                      </td>
                      <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-green-600 text-sm font-medium">+{category.growth}%</span>
                          <TrendingUp className="ml-1.5 h-4 w-4 text-green-600" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Main Categories Section */}
        <div className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <div className="p-5 sm:p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
              <button
                onClick={() => navigate("/category-add")}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Add Category
              </button>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search categories..."
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <select
                  value={getDropdownValue()}
                  onChange={(e) => {
                    const value = e.target.value;
                    switch (value) {
                      case "deleted":
                        handleFilterChange("is_active", undefined);
                        handleFilterChange("include_deleted", true);
                        break;
                      case "true":
                        handleFilterChange("is_active", true);
                        handleFilterChange("include_deleted", false);
                        break;
                      case "false":
                        handleFilterChange("is_active", false);
                        handleFilterChange("include_deleted", false);
                        break;
                    }
                    loadCategories();
                  }}
                  className="w-full sm:w-40 pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-5 sm:mx-6 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-5 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Icon</th>
                  <th className="px-5 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-5 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-5 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                      {category.icon ? (
                        <img src={category.icon} alt={category.name} className="h-10 w-10 rounded-xl object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">{category.name.charAt(0)}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{category.description}</div>
                    </td>
                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.is_deleted
                            ? "bg-red-100 text-red-800"
                            : category.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {category.is_deleted ? "Deleted" : category.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <button 
                          onClick={() => handleEdit(category)} 
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150 p-1 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(category)}
                          className={`${
                            category.is_active ? "text-red-600 hover:text-red-900 hover:bg-red-50" : "text-green-600 hover:text-green-900 hover:bg-green-50"
                          } transition-colors duration-150 p-1 rounded-lg`}
                        >
                          {category.is_active ? <PowerOff className="h-5 w-5" /> : <Power className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          className={`text-red-600 hover:text-red-900 transition-colors duration-150 p-1 hover:bg-red-50 rounded-lg`}
                          title={category.is_deleted ? "Restore Category" : "Delete Category"}
                        >
                          {category.is_deleted ? (
                            <RefreshCw className="h-5 w-5" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination and Entries Per Page */}
          <div className="px-5 sm:px-6 py-4 border-t border-gray-100 bg-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Enhanced Entries per page selector */}
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 w-full sm:w-auto">
                <span className="text-sm font-medium text-gray-600">Show</span>
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={itemsPerPage}
                    onChange={handleLimitChange}
                    className="w-full sm:w-auto appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-all duration-200"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">entries</span>
              </div>

              {/* Pagination Info and Controls */}
              <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                {/* Page Info */}
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Page <span className="font-medium text-gray-900">{currentPage}</span> of{" "}
                  <span className="font-medium text-gray-900">{Math.ceil(stats.total / itemsPerPage)}</span>
                </span>

                {/* Navigation Buttons */}
                <div className="flex items-center rounded-xl border border-gray-200 bg-white divide-x divide-gray-200">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 text-sm font-medium ${
                      currentPage === 1 
                        ? "text-gray-400 cursor-not-allowed" 
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    } transition-colors duration-200 rounded-l-xl`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(stats.total / itemsPerPage)}
                    className={`px-3 py-2 text-sm font-medium ${
                      currentPage >= Math.ceil(stats.total / itemsPerPage)
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    } transition-colors duration-200 rounded-r-xl`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-2 text-sm text-gray-500 text-center sm:text-left">
              Showing <span className="font-medium text-gray-700">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredCategories.length)}</span> to{" "}
              <span className="font-medium text-gray-700">{Math.min(currentPage * itemsPerPage, filteredCategories.length)}</span> of{" "}
              <span className="font-medium text-gray-700">{filteredCategories.length}</span> entries
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCategory;

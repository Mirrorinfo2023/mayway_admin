import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEndpointUrl } from "../../api/config";
import { addCategory, deleteToggle, editCategoryData, listCategory, toggleCategory } from "@/api/apicall/category";
import { fetchActiveCategories } from "./productSlice";

const API_URL = getEndpointUrl("/api/dashboard/category");

let mockCategories = [];
const mockAnalytics = {
  stats: {
    total: 120,
    active: 85,
    inactive: 25,
    deleted: 10,
  },
  chartData: {
    categoryGrowth: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Active Categories",
          data: [65, 70, 75, 80, 82, 85],
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.5)",
        },
        {
          label: "Total Products",
          data: [120, 125, 130, 140, 145, 150],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
        },
      ],
    },
    categoryDistribution: {
      labels: ["Electronics", "Fashion", "Home & Garden", "Books", "Sports"],
      data: [30, 25, 20, 15, 10],
      colors: ["rgba(59, 130, 246, 0.8)", "rgba(34, 197, 94, 0.8)", "rgba(249, 115, 22, 0.8)", "rgba(168, 85, 247, 0.8)", "rgba(236, 72, 153, 0.8)"],
    },
    topCategories: [
      { id: 1, name: "Electronics", totalProducts: 450, activeProducts: 380, growth: 12 },
      { id: 2, name: "Fashion", totalProducts: 380, activeProducts: 320, growth: 8 },
      { id: 3, name: "Home & Garden", totalProducts: 320, activeProducts: 280, growth: 15 },
      { id: 4, name: "Books", totalProducts: 280, activeProducts: 250, growth: 5 },
      { id: 5, name: "Sports", totalProducts: 220, activeProducts: 190, growth: 10 },
    ],
  },
};

// Helper function to generate consistent response format
const generateResponse = (data = null, message = "", isSuccess = true) => ({
  response: data,
  responseCode: isSuccess ? 1 : 0,
  responseMessage: message,
  responseStatus: isSuccess ? "Success" : "Error",
  showMessage: true,
});

// Thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params = { page: 1, limit: 10, is_active: undefined, include_deleted: false }, { dispatch }) => {
    try {
      const responseData = await listCategory(params);

      const { responseCode, response, responseMessage } = responseData;
      if (responseCode === 1) {
        mockCategories = [...response];
        let filteredCategories = [...response];
        if (params.is_active !== undefined) {
          filteredCategories = filteredCategories.filter((cat) => cat.is_active === params.is_active);
        }

        if (!params.include_deleted) {
          filteredCategories = filteredCategories.filter((cat) => !cat.is_deleted);
        } else {
          filteredCategories = filteredCategories.filter((cat) => cat.is_deleted);
        }

        const startIndex = (params.page - 1) * params.limit;
        const endIndex = startIndex + params.limit;
        const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

        // After loading categories, update the product categories
        dispatch(fetchActiveCategories());

        return {
          response: {
            categories: paginatedCategories,
            pagination: {
              total: filteredCategories.length,
              page: params.page,
              limit: params.limit,
              totalPages: Math.ceil(filteredCategories.length / params.limit),
            },
          },
          responseCode,
          responseMessage,
        };
      }
      return responseData;
    } catch (error) {
      return generateResponse(null, error.message || "Failed to fetch categories", false);
    }
  }
);

export const createCategory = createAsyncThunk("categories/createCategory", async (formData, { dispatch }) => {
  try {
    const responseData = await addCategory(formData);
    const { responseCode, response } = responseData;
    if (responseCode === 1) {
      const newCategory = {
        id: response._id,
        name: response.name,
        description: response.description,
        icon: response.icon || null,
        is_active: response.is_active,
        is_deleted: response.is_deleted,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };

      // Add to mock categories
      mockCategories.unshift(newCategory);

      // If the category is active, update the product categories
      if (newCategory.is_active && !newCategory.is_deleted) {
        dispatch(fetchActiveCategories());
      }

      return responseData;
    } else {
      return responseData;
    }
  } catch (error) {
    return generateResponse(null, error.message || "Failed to create category", false);
  }
});

export const updateCategory = createAsyncThunk("categories/updateCategory", async (formData, { dispatch }) => {
  try {
    const responseData = await editCategoryData(formData);
    const { responseCode, response } = responseData;
    if (responseCode === 1) {
      // Update in mock categories
      const index = mockCategories.findIndex((cat) => cat.id === response._id);
      if (index !== -1) {
        mockCategories[index] = {
          ...mockCategories[index],
          name: response.name,
          description: response.description,
          icon: response.icon || mockCategories[index].icon,
          is_active: response.is_active,
          updatedAt: response.updatedAt,
        };
      }

      // Update product categories if the active status changed
      dispatch(fetchActiveCategories());

      return responseData;
    } else {
      return responseData;
    }
  } catch (error) {
    return generateResponse(null, error.message || "Failed to update category", false);
  }
});

export const toggleCategoryStatus = createAsyncThunk("categories/toggleCategoryStatus", async (category, { dispatch }) => {
  try {
    const responseData = await toggleCategory(category.id);
    const { responseCode, response } = responseData;
    if (responseCode === 1) {
      // Update in mock categories
      const index = mockCategories.findIndex((cat) => cat.id === category.id);
      if (index !== -1) {
        mockCategories[index] = {
          ...mockCategories[index],
          is_active: !mockCategories[index].is_active,
          updatedAt: new Date().toISOString(),
        };
      }

      // Update product categories since the active status changed
      dispatch(fetchActiveCategories());

      return responseData;
    } else {
      return responseData;
    }
  } catch (error) {
    return generateResponse(null, error.message || "Failed to toggle category status", false);
  }
});

export const deactivateCategory = createAsyncThunk("categories/deactivateCategory", async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const categoryIndex = mockCategories.findIndex((cat) => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error("Category not found");
  }

  mockCategories[categoryIndex] = {
    ...mockCategories[categoryIndex],
    isActive: false,
    updatedAt: new Date().toISOString(),
  };

  return {
    response: mockCategories[categoryIndex],
    responseCode: 1,
    responseMessage: "Category deactivated successfully",
    responseStatus: "Success",
    showMessage: true,
  };
});

export const restoreCategory = createAsyncThunk("categories/restoreCategory", async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const categoryIndex = mockCategories.findIndex((cat) => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error("Category not found");
  }

  mockCategories[categoryIndex] = {
    ...mockCategories[categoryIndex],
    isActive: true,
    updatedAt: new Date().toISOString(),
  };

  return {
    response: mockCategories[categoryIndex],
    responseCode: 1,
    responseMessage: "Category restored successfully",
    responseStatus: "Success",
    showMessage: true,
  };
});

export const deleteCategory = createAsyncThunk("categories/deleteCategory", async (category) => {
  console.log(category, ">>>>>>>>>>>>");
  const action = !category.is_deleted;
  console.log(action, ">>>>>>>>>>>>>>>>>>>>>>status");
  const responseData = await deleteToggle(category, action);
  const { response, responseCode } = responseData;
  if (responseCode === 1) {
    return responseData;
  }
  return responseData;
});

export const searchCategories = createAsyncThunk("categories/searchCategories", async ({ searchTerm = "", page = 1, limit = 10, filters = {} }) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Filter categories based on search term and filters
    let filteredCategories = [...mockCategories];

    // Apply search term filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filteredCategories = filteredCategories.filter(
        (cat) => cat.name.toLowerCase().includes(searchLower) || (cat.description && cat.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filters
    if (filters.is_active !== undefined) {
      filteredCategories = filteredCategories.filter((cat) => cat.isActive === filters.is_active);
    }

    if (!filters.include_deleted) {
      filteredCategories = filteredCategories.filter((cat) => !cat.isDeleted);
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

    return {
      response: {
        categories: paginatedCategories,
        pagination: {
          total: filteredCategories.length,
          page,
          limit,
          totalPages: Math.ceil(filteredCategories.length / limit),
        },
      },
      responseCode: 1,
      responseMessage: "Categories searched successfully",
      responseStatus: "Success",
      showMessage: true,
    };
  } catch (error) {
    return {
      response: null,
      responseCode: 0,
      responseMessage: error.message || "Failed to search categories",
      responseStatus: "Error",
      showMessage: true,
    };
  }
});

export const readCategory = createAsyncThunk("categories/readCategory", async (id, { rejectWithValue }) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const category = mockCategories.find((cat) => cat.id === id);

    if (!category) {
      throw new Error("Category not found");
    }

    return {
      response: category,
      responseCode: 1,
      responseMessage: "Category fetched successfully",
      responseStatus: "Success",
      showMessage: true,
    };
  } catch (error) {
    return rejectWithValue({
      responseCode: 0,
      responseMessage: error.message || "Failed to fetch category",
      responseStatus: "Error",
      showMessage: true,
    });
  }
});

export const editCategory = createAsyncThunk("categories/editCategory", async ({ id, data }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const categoryIndex = mockCategories.findIndex((cat) => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error("Category not found");
  }

  const updatedCategory = {
    ...mockCategories[categoryIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockCategories[categoryIndex] = updatedCategory;

  return {
    response: updatedCategory,
    responseCode: 1,
    responseMessage: "Category updated successfully",
    responseStatus: "Success",
    showMessage: true,
  };
});

export const fetchCategoryAnalytics = createAsyncThunk("categories/fetchAnalytics", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
  return mockAnalytics;
});

export const updatePagination = createAsyncThunk("categories/updatePagination", async ({ page, limit }) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return generateResponse({ page, limit }, "Pagination updated successfully");
  } catch (error) {
    return generateResponse(null, error.message || "Failed to update pagination", false);
  }
});

const initialState = {
  categories: [],
  status: "idle",
  error: null,
  stats: {
    total: 0,
    active: 0,
    rootCategories: 0,
    withProducts: 0,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  hierarchy: {},
  selectedCategory: null,
  searchTerm: "",
  analytics: null,
  analyticsStatus: "idle",
  analyticsError: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    ...initialState,
    searchTerm: "",
    searchResults: [],
    searchStatus: "idle",
    searchError: null,
    filters: {
      is_active: true,
      include_deleted: false,
    },
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      console.log(action.payload);
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // Reset to first page when changing limit
    },
    clearSearch: (state) => {
      state.searchTerm = "";
      state.searchResults = [];
      state.searchStatus = "idle";
      state.searchError = null;
      state.filters = {
        is_active: undefined,
        include_deleted: false,
      };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        if (action.payload.responseCode === 1) {
          state.status = "succeeded";
          state.categories = action.payload.response.categories;
          state.pagination = action.payload.response.pagination;
          state.stats = {
            ...state.stats,
            total: action.payload.response.pagination.total,
            active: mockCategories.filter((cat) => cat.is_active).length,
            inactive: mockCategories.filter((cat) => !cat.is_active).length,
            deleted: mockCategories.filter((cat) => cat.is_deleted).length,
          };
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.responseCode === 1) {
          state.categories.unshift(action.payload.response);
          state.pagination.total += 1;
          state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (action.payload.responseCode === 1) {
          const index = state.categories.findIndex((cat) => cat._id === action.payload.response._id);
          if (index !== -1) {
            state.categories[index] = {
              id: action.payload.response._id,
              name: action.payload.response.name,
              description: action.payload.response.description,
              icon: action.payload.response.icon,
              isActive: action.payload.response.is_active,
              isDeleted: action.payload.response.is_deleted,
              createdAt: action.payload.response.createdAt,
              updatedAt: action.payload.response.updatedAt,
            };
          }
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload?.responseMessage || "Failed to update category";
      })
      .addCase(deactivateCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deactivateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.categories.findIndex((cat) => cat.id === action.payload.response.id);
        if (index !== -1) {
          state.categories[index] = action.payload.response;
        }
      })
      .addCase(deactivateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(restoreCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(restoreCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.categories.findIndex((cat) => cat.id === action.payload.response.id);
        if (index !== -1) {
          state.categories[index] = action.payload.response;
        }
      })
      .addCase(restoreCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = state.categories.filter((cat) => cat.id !== action.payload.response._id);
        state.stats.total -= 1;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(searchCategories.pending, (state) => {
        state.status = "loading";
        state.searchStatus = "loading";
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        if (action.payload.responseCode === 1) {
          state.status = "succeeded";
          state.searchStatus = "succeeded";
          state.categories = action.payload.response.categories;
          state.searchResults = action.payload.response.categories;
          state.pagination = action.payload.response.pagination;
          state.error = null;
          state.searchError = null;
        }
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.searchStatus = "failed";
        state.error = action.error.message;
        state.searchError = action.error.message;
      })
      .addCase(readCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(readCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCategory = action.payload.response;
      })
      .addCase(readCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.responseMessage || "Failed to fetch category";
      })
      .addCase(editCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.categories.findIndex((cat) => cat.id === action.payload.response.id);
        if (index !== -1) {
          state.categories[index] = action.payload.response;
        }
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCategoryAnalytics.pending, (state) => {
        state.analyticsStatus = "loading";
      })
      .addCase(fetchCategoryAnalytics.fulfilled, (state, action) => {
        state.analyticsStatus = "succeeded";
        state.analytics = action.payload;
      })
      .addCase(fetchCategoryAnalytics.rejected, (state, action) => {
        state.analyticsStatus = "failed";
        state.analyticsError = action.error.message;
      })
      .addCase(toggleCategoryStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload + ">>>>>>>>>>>>>>>>");
        if (action.payload.responseCode === 1) {
          console.log(">>>>>>>>>>>>>>>");
          const index = state.categories.findIndex((cat) => cat._id === action.payload.response._id);
          if (index !== -1) {
            state.categories[index] = action.payload.response;
          }
        }
      })
      .addCase(toggleCategoryStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updatePagination.fulfilled, (state, action) => {
        if (action.payload.responseCode === 1) {
          const { page, limit } = action.payload.response;
          state.pagination = {
            ...state.pagination,
            page,
            limit,
            totalPages: Math.ceil(state.pagination.total / limit),
          };
        }
      });
  },
});

export const { setSearchTerm, setSelectedCategory, clearSelectedCategory, clearError, setPage, setLimit, clearSearch, setFilters } = categorySlice.actions;
export const selectAllCategories = (state) => state.categories.categories;
export const selectCategoryStatus = (state) => state.categories.status;
export const selectCategoryError = (state) => state.categories.error;
export const selectCategoryStats = (state) => state.categories.stats;
export const selectCategoryHierarchy = (state) => state.categories.hierarchy;
export const selectRootCategories = (state) => state.categories.categories.filter((cat) => !cat.parentId);
export const selectChildrenCategories = (parentId) => (state) => state.categories.categories.filter((cat) => cat.parentId === parentId);
export const selectSelectedCategory = (state) => state.categories.selectedCategory;
export const selectAnalytics = (state) => state.categories.analytics;
export const selectAnalyticsStatus = (state) => state.categories.analyticsStatus;
export const selectAnalyticsError = (state) => state.categories.analyticsError;
// Additional selectors
export const selectSearchTerm = (state) => state.categories.searchTerm;
export const selectSearchStatus = (state) => state.categories.searchStatus;
export const selectSearchError = (state) => state.categories.searchError;
export const selectSearchResults = (state) => state.categories.searchResults;
export const selectFilters = (state) => state.categories.filters;

export default categorySlice.reducer;

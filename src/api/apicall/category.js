import { apiRequest } from "../client";
import { ENDPOINTS } from "../config";

export const addCategory = async (categorydata) => {
  try {
    const response = await apiRequest.post(ENDPOINTS.CATEGORY.ADD, categorydata);
    const categoryresponse = response.data;
    return categoryresponse;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Login failed. Please check your credentials.",
    };
  }
};

export const listCategory = async (filter) => {
  try {
    const response = await apiRequest.get(ENDPOINTS.CATEGORY.ALL(filter));
    const categoryresponse = response.data;
    return categoryresponse;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Login failed. Please check your credentials.",
    };
  }
};

export const toggleCategory = async (catrgory, action) => {
  try {
    const response = await apiRequest.put(ENDPOINTS.CATEGORY.TOGGLE(catrgory), {
      is_active: action,
    });
    const categoryresponse = response.data;
    return categoryresponse;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Login failed. Please check your credentials.",
    };
  }
};
export const deleteToggle = async (catrgory, action) => {
  try {
    const response = await apiRequest.put(ENDPOINTS.CATEGORY.TOGGLEDELETE(catrgory), {
      is_deleted: action,
    });
    const categoryresponse = response.data;
    return categoryresponse;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Login failed. Please check your credentials.",
    };
  }
};

export const editCategoryData = async (catrgory) => {
  try {
    const response = await apiRequest.put(ENDPOINTS.CATEGORY.UPDATE, catrgory);
    const categoryresponse = response.data;
    return categoryresponse;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Login failed. Please check your credentials.",
    };
  }
};

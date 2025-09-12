// src/api/apicall/auth.js
import { post } from "../client";
import { ENDPOINTS } from "../config";

const TOKEN_KEY = "token";

// ----------------------
// Storage helpers
// ----------------------
export const getAuthToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token) => {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
};
export const clearAuthData = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};

// ----------------------
// Login
// ----------------------
export const login = async (credentials) => {
  try {
    // call API
    const response = await post(ENDPOINTS.AUTH.LOGIN, credentials);

    // API should return something like { responseCode: 1, response: { token: "..." } }
    if (response.responseCode === 1) {
      const token = response.response.token;
      setAuthToken(token);

      return {
        success: true,
        token,
        user: response.response.user || null,
      };
    } else {
      return {
        success: false,
        message: response.message || "Invalid credentials",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

// ----------------------
// Logout
// ----------------------
export const logout = async () => {
  try {
    const token = getAuthToken();
    if (token) {
      await post(ENDPOINTS.AUTH.LOGOUT, { token });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    clearAuthData(); // always clear token
  }
};

// ----------------------
// Verify token
// ----------------------
export const checkToken = async () => {
  try {
    const token = getAuthToken();
    if (!token) return { valid: false };

    const response = await post(ENDPOINTS.AUTH.VERIFY, { token });

    if (response.responseCode === 1) {
      return { valid: response.response.isValid };
    } else {
      clearAuthData();
      return { valid: false };
    }
  } catch (error) {
    console.error("Token verification error:", error);
    clearAuthData();
    return { valid: false };
  }
};

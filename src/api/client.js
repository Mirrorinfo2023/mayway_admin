// src/api/client.js
import axios from "axios";

// Base URL from environment or fallback
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Generic request function
const request = async (method, path, data = {}, config = {}) => {
  try {
    let response;

    switch (method.toUpperCase()) {
      case "GET":
        response = await apiClient.get(path, { params: data, ...config });
        break;
      case "POST":
        response = await apiClient.post(path, data, config);
        break;
      case "PUT":
        response = await apiClient.put(path, data, config);
        break;
      case "DELETE":
        response = await apiClient.delete(path, { data, ...config });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  } catch (error) {
    // Detailed error logging
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error("API Response Error:", {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response
      console.error("API No Response Error:", error.request);
    } else {
      // Other errors (setup, config, etc.)
      console.error("API Request Error:", error.message);
    }
    throw error; // rethrow so calling code can handle it
  }
};

// Named helper functions
export const get = (path, params = {}, config = {}) =>
  request("GET", path, params, config);

export const post = (path, data = {}, config = {}) =>
  request("POST", path, data, config);

export const put = (path, data = {}, config = {}) =>
  request("PUT", path, data, config);

export const del = (path, data = {}, config = {}) =>
  request("DELETE", path, data, config);

// Export axios instance for custom usage
export default apiClient;

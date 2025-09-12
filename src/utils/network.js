import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic request function
export const request = async (method, path, data = {}, config = {}) => {
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
    console.error("Network Error:", error);
    throw error;
  }
};

// Shortcut functions
export const get = (path, params, config) => request("GET", path, params, config);
export const post = (path, data, config) => request("POST", path, data, config);
export const put = (path, data, config) => request("PUT", path, data, config);
export const del = (path, data, config) => request("DELETE", path, data, config);

export default apiClient;

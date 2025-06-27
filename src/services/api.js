import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = process.env.NEXT_PUBLIC_API_TOKEN || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = token;
    }

    // Handle FormData content type
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem("token");
      }

      return Promise.reject(error.response.data);
    }

    return Promise.reject(error);
  }
);

// API methods
const apiService = {
  // GET request
  get: async (path, params = {}, config = {}) => {
    try {
      const response = await api.get(path, { ...config, params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (path, data = {}, config = {}) => {
    try {
      const response = await api.post(path, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (path, data = {}, config = {}) => {
    try {
      const response = await api.put(path, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (path, config = {}) => {
    try {
      const response = await api.delete(path, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (path, data = {}, config = {}) => {
    try {
      const response = await api.patch(path, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Set auth token
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  },

  // Set base URL
  setBaseURL: (url) => {
    api.defaults.baseURL = url;
  },
};

export default apiService;

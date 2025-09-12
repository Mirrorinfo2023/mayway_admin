export const API_CONFIG = {
  // BASE_URL: "https://ecom-backend.plusdistribution.in/api",
  BASE_URL: "http://localhost:3001/api",
  // BASE_URL: "https://secure.aladin25.live/api",
  TIMEOUT: 15000,
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/admin/login",
    LOGOUT: "/admin/logout",
    VERIFY: "/admin/check-token",
  },
  DASHBOARD: {
    STATS: "/admin/dashboard/stats",
    SALES: "/admin/dashboard/sales",
    ACTIVITY: "/admin/dashboard/activity",
    ANALYTICS: "/admin/dashboard/analytics",
  },

  USER: {
    PROFILE: "/admin/profile",
    UPDATE: "/admin/update",
    CHANGE_PASSWORD: "/admin/change-password",
  },
  CATEGORY: {
    ADD: "/dashboard/category/add",
    ALL: (filter) => `/dashboard/category/all?is_active=${filter.is_active}&include_deleted=${filter.include_deleted}`,
    TOGGLE: (category) => `/dashboard/category/${category._id}/toggle-category`,
    TOGGLEDELETE: (category) => `/dashboard/category/${category._id}/restore`,
    UPDATE: "/dashboard/category/edit",
    DETAIL: "/dashboard/products/:id",
    CREATE: "/dashboard/product/add",

    DELETE: "/dashboard/products/:id",
    CATEGORIES: "/dashboard/products/categories",
  },
  PRODUCT: {
    LIST: "/dashboard/products",
    DETAIL: "/dashboard/products/:id",
    CREATE: "/dashboard/product/add",
    UPDATE: "/dashboard/products/:id",
    DELETE: "/dashboard/products/:id",
    CATEGORIES: "/dashboard/products/categories",
  },

  ORDER: {
    LIST: "/orders",
    DETAIL: "/orders/:id",
    CREATE: "/orders",
    UPDATE: "/orders/:id",
    CANCEL: "/orders/:id/cancel",
    TRACK: "/orders/:id/track",
  },

  PLUSCART: {
    OVERVIEW: "/pluscart/overview",
    PROMOTIONS: "/pluscart/promotions",
    BANNERS: "/pluscart/banners",
    CATEGORIES: "/pluscart/categories",
    USERS: "/pluscart/users",
    PRODUCTS: "/pluscart/products",
  },
};

export const formatUrl = (url, params = {}) => {
  let formattedUrl = url;
  Object.keys(params).forEach((key) => {
    formattedUrl = formattedUrl.replace(`:${key}`, params[key]);
  });

  return formattedUrl;
};
export const getEndpointUrl = (endpoint) => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, "");
  const cleanEndpoint = endpoint.replace(/^\//, "");
  return `${baseUrl}/${cleanEndpoint}`;
};

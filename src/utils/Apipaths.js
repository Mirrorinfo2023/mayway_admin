// const BASE_URL = 'http://localhost:3001/';

const BASE_URL = 'https://secure.aladin25.live/';
export const API_PATHS = {
  CREATE_CATEGORY: `${BASE_URL}api/catagory/createcategories`,
  GET_ALL_CATEGORIES: `${BASE_URL}api/catagory/getallcategories`,
  GET_CATEGORY_BY_ID: (id) => `${BASE_URL}api/catagory/getcategories/${id}`,
  DELETE_CATEGORY_BY_ID: (id) => `${BASE_URL}api/catagory/deletecategories/${id}`,

  // Order related paths
  ORDER_LIST: `${BASE_URL}api/orders/list`,
  GET_ORDERS: `${BASE_URL}api/orders/list`,
  ORDER_CREATE: `${BASE_URL}api/orders/create`,
  ORDER_DETAILS: (id) => `${BASE_URL}api/orders/details/${id}`,
  ORDER_UPDATE_STATUS: (status) => `${BASE_URL}api/orders/update-status/${status}`,
  ORDER_CANCEL: (id) => `${BASE_URL}api/orders/cancel/${id}`,
  ORDER_RETURN: (id) => `${BASE_URL}api/orders/return/${id}`,
  ORDER_DELETE: (id) => `${BASE_URL}api/orders/delete/${id}`,
  ORDER_FILTER: `${BASE_URL}api/orders/filter`,

  PRODUCT_LIST: `${BASE_URL}api/products`,
  PRODUCT_BASIC: `${BASE_URL}api/products/basic`,
  PRODUCT_BY_ID: (id) => `${BASE_URL}api/products/${id}`,
  PRODUCT_DETAILS: `${BASE_URL}api/products/details`,
  PRODUCT_WITH_REVIEWS: (id) => `${BASE_URL}api/products/withreviews/${id}`,
  PRODUCT_POST_REVIEWS: `${BASE_URL}api/reviews/create`,
  PRODUCT_CREATE: `${BASE_URL}api/products/create`,
  PRODUCT_UPDATE_REVIEWS: (id) => `${BASE_URL}api/reviews/updatereview/${id}`,

  REVIEW_CREATE: `${BASE_URL}api/reviews/create`,
  REVIEW_GET_ALL: `${BASE_URL}api/reviews/getallreviews`,
  REVIEW_CREATE: `${BASE_URL}review/create`,
  // REVIEW_GET_ALL: `${BASE_URL}review/getallreviews`,
  REVIEW_GET_BY_PRODUCT_ID: (productId) => `${BASE_URL}review/getproductreview/${productId}`,
  REVIEW_GET_BY_ID: (reviewId) => `${BASE_URL}review/getreview/${reviewId}`,
  REVIEW_UPDATE_BY_ID: (reviewId) => `${BASE_URL}review/updatereview/${reviewId}`,

  VENDOR_REGISTER: `${BASE_URL}api/vendors/create`,
  VENDOR_LOGIN: `${BASE_URL}api/vendors/login`,
  GET_ALL_VENDORS: `${BASE_URL}vendor/getall`,
  GET_VENDOR_BY_ID: (id) => `${BASE_URL}vendor/get/${id}`,
  UPDATE_VENDOR: (id) => `${BASE_URL}vendor/update/${id}`,
  DELETE_VENDOR: (id) => `${BASE_URL}vendor/delete/${id}`,


  GET_ALL_USERS: '/api/users',
  UPDATE_USER_STATUS: (id) => `/api/users/${id}/status`,
  CREDIT_USER_INCOME: (id) => `/api/users/${id}/credit`,
  CREATE_SUBCATEGORY: '/subcategories',
  GET_ALL_SUBCATEGORIES: '/subcategories',
  GET_SUBCATEGORY_BY_ID: (id) => `/subcategories/${id}`,
  UPDATE_SUBCATEGORY_BY_ID: (id) => `/subcategories/${id}`,
  DELETE_SUBCATEGORY_BY_ID: (id) => `/subcategories/${id}`,

  CREATE_BRAND: '/brands',
  GET_ALL_BRANDS: '/brands',
  GET_BRAND_BY_ID: (id) => `/brands/${id}`,
  UPDATE_BRAND_BY_ID: (id) => `/brands/${id}`,
  DELETE_BRAND_BY_ID: (id) => `/brands/${id}`,
    GET_PRODUCTS: '/api/inhouse/products',
  ADD_PRODUCT: '/api/inhouse/products',
};

export default API_PATHS;

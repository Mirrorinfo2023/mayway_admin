import apiService from "./api";

// Auth API calls
export const authAPI = {
  login: (credentials) => apiService.post("/auth/login", credentials),
  register: (userData) => apiService.post("/auth/register", userData),
  verifyToken: () => apiService.get("/auth/verify-token"),
  verifyemailOtp: (emailData) => apiService.post("/auth/verify-email-otp", emailData),
  verifyEmail: (emailData) => apiService.post("/auth/verify-email", emailData),
  otpVerify: (otpData) => apiService.post("/auth/verify-otp", otpData),
  otpVerifyForgot: (otpData) => apiService.post("/auth/password-reset-verify", otpData),
  resendOtp: (otpData) => apiService.post("/auth/resend-otp", otpData),
  logout: () => apiService.post("/auth/logout"),
  forgotPassword: (email) => apiService.post("/auth/forgot-password", email),
  resetPassword: (data) => apiService.post("/auth/reset-password", data),
  getProfile: () => apiService.get("/auth/profile"),
  updateProfile: (data) => apiService.put("/auth/profile", data),
};

// Products API calls
export const productsAPI = {
  getAllProducts: (params) => apiService.get("/products", params),
  getProductById: (id) => apiService.get(`/products/${id}`),
  createProduct: (data) => apiService.post("/products", data),
  updateProduct: (id, data) => apiService.put(`/products/${id}`, data),
  deleteProduct: (id) => apiService.delete(`/products/${id}`),
  getProductCategories: () => apiService.get("/products/categories"),
  searchProducts: (query) => apiService.get("/products/search", { query }),
};

// Cart API calls
export const cartAPI = {
  getCart: () => apiService.get("/cart/get-cart"),
  addToCart: (data) => apiService.post("/cart/add-to-cart", data),
  updateCartItem: (data) => apiService.post(`/cart/update-quantity`, data),
  removeFromCart: (itemId) => apiService.delete(`/cart/remove-from-cart/${itemId}`),
  clearCart: () => apiService.delete("/cart"),
};

// Orders API calls
export const ordersAPI = {
  createOrder: (data) => apiService.post("/orders", data),
  getOrders: (params) => apiService.get("/orders", params),
  getOrderById: (id) => apiService.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => apiService.patch(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => apiService.post(`/orders/${id}/cancel`),
};

// User API calls
export const usersAPI = {
  getUsers: (params) => apiService.get("/users", params),
  defaultAddress: (id) => apiService.put(`/user/address/default-address/${id}`),
  getProfile: () => apiService.get("/user/profile"),
  updatePassword: (passWord) => apiService.put("/user/profile/change-password", passWord),
  uploadAvatar: (avtar) => apiService.post("/user/profile/upload-profilepic", avtar),
  getAddresses: () => apiService.get("/user/address/get-all-address"),
  updateAddress: (id, data) => apiService.put(`/user/address/update-address/${id}`, data),
  getUserById: (id) => apiService.get(`/users/${id}`),
  createUser: (data) => apiService.post("/users", data),
  deleteAddress: (id) => apiService.delete(`/user/address/delete-address/${id}`),
  updateUser: (data) => apiService.put(`/user/profile`, data),
  deleteUser: (id) => apiService.delete(`/users/${id}`),
  addAddress: (data) => apiService.post("/user/address/add-new-address", data),
  updateUserRole: (id, role) => apiService.patch(`/users/${id}/role`, { role }),
};

// Reviews API calls
export const reviewsAPI = {
  getProductReviews: (productId, params) => apiService.get(`/products/${productId}/reviews`, params),
  createReview: (productId, data) => apiService.post(`/products/${productId}/reviews`, data),
  updateReview: (reviewId, data) => apiService.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => apiService.delete(`/reviews/${reviewId}`),
};

// Wishlist API calls
export const wishlistAPI = {
  getWishlist: () => apiService.get("/wishlist"),
  addToWishlist: (productId) => apiService.post("/wishlist", { productId }),
  removeFromWishlist: (productId) => apiService.delete(`/wishlist/${productId}`),
};

export const productAPI = {
  uploadProduct: (formData) => apiService.post(`/product/upload-images`, formData),
};

// Address API calls
export const addressAPI = {
  getAddresses: () => apiService.get("/addresses"),
  addAddress: (data) => apiService.post("/addresses", data),
  updateAddress: (id, data) => apiService.put(`/addresses/${id}`, data),
  deleteAddress: (id) => apiService.delete(`/addresses/${id}`),
  setDefaultAddress: (id) => apiService.patch(`/addresses/${id}/default`),
};

// Payment API calls
export const paymentAPI = {
  createPaymentIntent: (data) => apiService.post("/payments/create-intent", data),
  confirmPayment: (paymentId, data) => apiService.post(`/payments/${paymentId}/confirm`, data),
  getPaymentMethods: () => apiService.get("/payments/methods"),
  addPaymentMethod: (data) => apiService.post("/payments/methods", data),
  removePaymentMethod: (methodId) => apiService.delete(`/payments/methods/${methodId}`),
};

export const homeAPI = {
  getHomeContent: async () => {
    // Dummy response for development
    return {
      responseCode: 1,
      responseMessage: "Success",
      response: {
        hero: {
          show: true,
          title: "Summer Collection 2024",
          subtitle: "Discover the latest trends with up to 40% off",
          cta_text: "Shop Now",
          image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800",
          discount: 40,
        },
        categories: {
          show: true,
          items: [
            {
              id: 1,
              name: "Electronics",
              icon: "📱",
              color: "bg-blue-100",
            },
            {
              id: 2,
              name: "Fashion",
              icon: "👕",
              color: "bg-pink-100",
            },
            {
              id: 3,
              name: "Home",
              icon: "🏠",
              color: "bg-green-100",
            },
            {
              id: 4,
              name: "Beauty",
              icon: "💄",
              color: "bg-purple-100",
            },
            {
              id: 5,
              name: "Sports",
              icon: "⚽",
              color: "bg-yellow-100",
            },
            {
              id: 6,
              name: "Books",
              icon: "📚",
              color: "bg-red-100",
            },
          ],
        },
        featured_products: {
          show: true,
          items: [
            {
              id: 1,
              name: "Wireless Headphones",
              description: "Premium noise-cancelling wireless headphones",
              price: 199.99,
              discount: 20,
              image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
              rating: 4.5,
              reviews: 128,
              in_stock: true,
            },
            {
              id: 2,
              name: "Smart Watch",
              description: "Latest smartwatch with health tracking",
              price: 299.99,
              discount: 15,
              image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
              rating: 4.8,
              reviews: 256,
              in_stock: true,
            },
            {
              id: 3,
              name: "Running Shoes",
              description: "Lightweight running shoes for maximum comfort",
              price: 89.99,
              discount: 25,
              image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
              rating: 4.6,
              reviews: 189,
              in_stock: true,
            },
            {
              id: 4,
              name: "Coffee Maker",
              description: "Programmable coffee maker with thermal carafe",
              price: 79.99,
              discount: 10,
              image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
              rating: 4.3,
              reviews: 95,
              in_stock: true,
            },
          ],
        },
        deals_of_the_day: {
          show: true,
          title: "Flash Sale - Limited Time!",
          start_time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // Started 12 hours ago
          end_time: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // Ends in 12 hours
          items: [
            {
              id: 5,
              name: "Gaming Laptop",
              description: "High-performance gaming laptop with RTX 3080",
              price: 1299.99,
              discount: 30,
              image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
              rating: 4.9,
              reviews: 342,
              in_stock: true,
            },
            {
              id: 6,
              name: "Wireless Earbuds",
              description: "True wireless earbuds with noise cancellation",
              price: 149.99,
              discount: 35,
              image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500",
              rating: 4.7,
              reviews: 215,
              in_stock: true,
            },
            {
              id: 7,
              name: "Smart Home Hub",
              description: "Control your home with voice commands",
              price: 199.99,
              discount: 25,
              image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=500",
              rating: 4.4,
              reviews: 167,
              in_stock: true,
            },
            {
              id: 8,
              name: "Fitness Tracker",
              description: "Advanced fitness tracker with heart rate monitor",
              price: 89.99,
              discount: 40,
              image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500",
              rating: 4.6,
              reviews: 198,
              in_stock: true,
            },
          ],
        },
      },
    };
  },
};

// Example usage:
/*
import { productsAPI, cartAPI } from '../services/apicall';

// In your component:
const fetchProducts = async () => {
  try {
    const products = await productsAPI.getAllProducts({ page: 1, limit: 10 });
    // Handle products data
  } catch (error) {
    // Handle error
  }
};

const addToCart = async (productId, quantity) => {
  try {
    await cartAPI.addToCart({ productId, quantity });
    // Handle success
  } catch (error) {
    // Handle error
  }
};
*/

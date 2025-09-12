import { get, post } from '../utils/network';
import API_PATHS from '../utils/Apipaths';


// 1. Get All Products (with optional filters)
export const getAllProducts = async (payload = {}) => {
  return await post({
    path: API_PATHS.PRODUCT_LIST,
    data: payload,
  });
};

// 2. Get Basic Product List
export const getBasicProducts = async () => {
  return await get({
    path: API_PATHS.PRODUCT_BASIC,
  });
};

// 3. Get Product by ID
export const getProductById = async (productId) => {
  return await get({
    path: API_PATHS.PRODUCT_BY_ID(productId),
  });
};

// 4. Get Product Details
export const getProductDetails = async (payload) => {
  return await post({
    path: API_PATHS.PRODUCT_DETAILS,
    data: payload,
  });
};

// 5. Get Product with Reviews
export const getProductWithReviews = async (productId) => {
  return await get({
    path: API_PATHS.PRODUCT_WITH_REVIEWS(productId),
  });
};

// 6. Post a New Product Review
export const postProductReviews = async (payload) => {
  return await post({
    path: API_PATHS.PRODUCT_POST_REVIEWS,
    data: payload,
  });
};

// 7. Create New Product
export const createProduct = async (payload) => {
  return await post({
    path: API_PATHS.PRODUCT_CREATE,
    data: payload,
  });
};

// 8. Update Product Review
export const updateProductReviews = async (reviewId, payload) => {
  return await post({
    path: API_PATHS.PRODUCT_UPDATE_REVIEWS(reviewId),
    data: payload,
  });
};

// 9. In-House Products
export const getInHouseProducts = async () => {
  const response = await get({
    path: API_PATHS.GET_PRODUCTS,
  });

  return response?.data || [];
};

export const addInHouseProduct = async (productData) => {
  const response = await post({
    path: API_PATHS.ADD_PRODUCT,
    data: productData,
  });

  return response;
};

const handleCreateProduct = async () => {
  try {
    const response = await createProduct(productPayload);
    console.log('Product created:', response);
  } catch (error) {
    console.error('Failed to create product:', error);
  }
};



// export async function getInHouseProducts() {
//   const response = await get({
//     path: API_PATHS.GET_PRODUCTS,
//   });

//   return response?.data || []; 
// }
// export async function addInHouseProduct(productData) {
//   const response = await post({
//     path: API_PATHS.ADD_PRODUCT,
//     data: productData,
//   });

//   return response;
// }


// Example product payload
const handleupdateProductReviews = async () => {
  try {
    const response = await updateProductReviews('64f9a1b32cbd4567890123ab', {
      reviewText: 'Great product!',
      rating: 5,
    });
    console.log('Review updated:', response);
  } catch (error) {
    console.error('Failed to update review:', error);
  }
};

const productPayload = {
  sku: "IPH14-256GB-BLK",
  productName: "Apple iPhone 14",
  description: "Latest iPhone with A15 Bionic chip and 256GB storage.",
  shortDescription: "iPhone 14 256GB Black",
  images: [
    { url: "https://example.com/iphone14-front.jpg", alt: "iPhone 14 Front" },
    { url: "https://example.com/iphone14-back.jpg", alt: "iPhone 14 Back" }
  ],
  thumbnail: "https://example.com/iphone14-thumbnail.jpg",
  vendorId: "64f0f20c2abc1234567890ef",    
  categoryId: "64f9a1b32cbd4567890123ab",  
  brand: "Apple",
  price: 79999,
  discount: 10,
  quantity: 50,
  stockStatus: "in_stock",
  tags: ["smartphone", "apple", "iphone"],
  variants: [
    { variantName: "Color", value: "Black", additionalPrice: 0 },
    { variantName: "Storage", value: "256GB", additionalPrice: 2000 }
  ],
  attributes: [
    { key: "Processor", value: "A15 Bionic" },
    { key: "Battery", value: "3200mAh" }
  ],
  isFeatured: true
};
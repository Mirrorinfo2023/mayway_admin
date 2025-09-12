// productApi.js
const BASE_URL = 'https://dummyjson.com';

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

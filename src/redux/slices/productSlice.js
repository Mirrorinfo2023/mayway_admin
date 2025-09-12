import { v4 as uuidv4 } from "uuid";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { listCategory } from "@/api/apicall/category";
// Mock data for development
const mockProducts = [
  {
    id: "PRD-10001",
    name: "Apple iPhone 14 Pro Max",
    description: [
      "6.7-inch Super Retina XDR display",
      "A16 Bionic chip for fast performance",
      "Advanced camera system with ProRAW and ProRes"
    ],
    category: "Smartphones",
    manufacturer: "Apple Inc.",
    sku: "IPH14PM-256-BLK",
    price: 1149.0,
    mrp: 1299.0,
    discount: 12,
    stock: 50,
    status: "active",
    composition: "Aluminium, Glass, Lithium Battery",
    dosageForm: "N/A",
    packSize: "Box with accessories",
    prescriptionRequired: false,
    batchNumber: "IPH20240601",
    expiryDate: "2030-12-31",
    storageInstructions: "Store at room temperature",
    sideEffects: ["None"],
    images: [
      "https://placehold.co/400x400/111827/white?text=iPhone+1",
      "https://placehold.co/400x400/111827/white?text=iPhone+2"
    ],
    featured: true,
    ratings: 4.9,
    reviewCount: 540,
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2025-06-15T10:00:00Z"
  },
  {
    id: "PRD-10002",
    name: "Nike Air Max 270",
    description: [
      "Breathable mesh upper for ventilation",
      "Visible Air unit for maximum cushioning",
      "Sleek streetwear style"
    ],
    category: "Footwear",
    manufacturer: "Nike",
    sku: "NAIR270-BLK-9",
    price: 149.99,
    mrp: 179.99,
    discount: 17,
    stock: 120,
    status: "active",
    composition: "Mesh, Foam, Rubber",
    dosageForm: "N/A",
    packSize: "1 Pair of Shoes",
    prescriptionRequired: false,
    batchNumber: "NK20240512",
    expiryDate: "2030-01-01",
    storageInstructions: "Keep dry and clean",
    sideEffects: ["None"],
    images: [
      "https://placehold.co/400x400/2563eb/white?text=Nike+Air+1",
      "https://placehold.co/400x400/2563eb/white?text=Nike+Air+2"
    ],
    featured: true,
    ratings: 4.6,
    reviewCount: 320,
    createdAt: "2024-04-10T12:00:00Z",
    updatedAt: "2025-04-20T15:00:00Z"
  },
  {
    id: "PRD-10003",
    name: "Wooden Study Desk",
    description: [
      "Solid Sheesham wood",
      "Built-in drawer and shelf",
      "Matte finish"
    ],
    category: "Furniture",
    manufacturer: "HomeCraft",
    sku: "WOODDESK-42",
    price: 259.99,
    mrp: 299.99,
    discount: 13,
    stock: 20,
    status: "active",
    composition: "Wood",
    dosageForm: "N/A",
    packSize: "1 Unit",
    prescriptionRequired: false,
    batchNumber: "HCFURN2024",
    expiryDate: "2035-12-31",
    storageInstructions: "Avoid direct sunlight and moisture",
    sideEffects: ["None"],
    images: [
      "https://placehold.co/400x400/f59e0b/white?text=Study+Desk+1",
      "https://placehold.co/400x400/f59e0b/white?text=Study+Desk+2"
    ],
    featured: false,
    ratings: 4.3,
    reviewCount: 75,
    createdAt: "2024-03-01T08:30:00Z",
    updatedAt: "2024-07-01T10:15:00Z"
  },
  {
    id: "PRD-10004",
    name: "Sony WH-1000XM5 Headphones",
    description: [
      "Industry-leading noise cancellation",
      "Up to 30 hours battery life",
      "Touch sensor controls"
    ],
    category: "Audio",
    manufacturer: "Sony",
    sku: "SONYXM5-BLK",
    price: 399.99,
    mrp: 499.99,
    discount: 20,
    stock: 35,
    status: "active",
    composition: "Plastic, Foam, Electronics",
    dosageForm: "N/A",
    packSize: "1 Headphone + Case + Cable",
    prescriptionRequired: false,
    batchNumber: "SN20240401",
    expiryDate: "2030-06-30",
    storageInstructions: "Store in case when not in use",
    sideEffects: ["Ear fatigue after extended use"],
    images: [
      "https://placehold.co/400x400/9333ea/white?text=Sony+XM5+1",
      "https://placehold.co/400x400/9333ea/white?text=Sony+XM5+2"
    ],
    featured: true,
    ratings: 4.7,
    reviewCount: 290,
    createdAt: "2024-02-18T11:00:00Z",
    updatedAt: "2025-05-10T09:45:00Z"
  },
  {
    id: "PRD-10005",
    name: "Wildcraft 44L Backpack",
    description: [
      "Durable water-resistant fabric",
      "Laptop sleeve and multiple compartments",
      "Ideal for college and travel"
    ],
    category: "Bags & Luggage",
    manufacturer: "Wildcraft",
    sku: "WCRAFT-BAG44",
    price: 49.99,
    mrp: 69.99,
    discount: 28,
    stock: 80,
    status: "active",
    composition: "Polyester",
    dosageForm: "N/A",
    packSize: "1 Backpack",
    prescriptionRequired: false,
    batchNumber: "WCBAG2024",
    expiryDate: "2032-12-01",
    storageInstructions: "Wipe with clean cloth",
    sideEffects: ["None"],
    images: [
      "https://placehold.co/400x400/2f855a/white?text=Backpack+1",
      "https://placehold.co/400x400/2f855a/white?text=Backpack+2"
    ],
    featured: false,
    ratings: 4.5,
    reviewCount: 190,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2025-06-05T14:20:00Z"
  },
  {
    id: "PRD-10006",
    name: "Amazfit GTR 4 Smartwatch",
    description: [
      "1.43-inch AMOLED Display",
      "150+ sports modes",
      "GPS & Alexa Built-in"
    ],
    category: "Wearables",
    manufacturer: "Amazfit",
    sku: "GTR4-BLK",
    price: 199.99,
    mrp: 229.99,
    discount: 13,
    stock: 45,
    status: "active",
    composition: "Aluminium alloy, Silicone strap",
    dosageForm: "N/A",
    packSize: "1 Smartwatch + Charger",
    prescriptionRequired: false,
    batchNumber: "AZGTR42024",
    expiryDate: "2031-06-15",
    storageInstructions: "Keep dry, avoid magnetic fields",
    sideEffects: ["Mild skin irritation if worn too tight"],
    images: [
      "https://placehold.co/400x400/0f172a/white?text=GTR+4+1",
      "https://placehold.co/400x400/0f172a/white?text=GTR+4+2"
    ],
    featured: true,
    ratings: 4.4,
    reviewCount: 210,
    createdAt: "2024-05-10T10:30:00Z",
    updatedAt: "2025-07-01T12:00:00Z"
  }
];



// Helper function to simulate API delay
const mockApiDelay = () => new Promise((resolve) => setTimeout(resolve, 800));

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ filters, pagination }, { getState, rejectWithValue }) => {
    try {
      // In a real app, you would use axios.get with query params
      // For now, simulating API fetching with mock data
      await mockApiDelay();

      // Use products from the state, which includes any added products
      const state = getState();
      let allProducts = state.products.allItems;

      // If there are no products in the state yet, use the mockProducts
      if (!allProducts || allProducts.length === 0) {
        allProducts = [...mockProducts];
      }

      // Apply filters
      let filteredProducts = [...allProducts];

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name?.toLowerCase().includes(searchTerm) ||
            product.category?.toLowerCase().includes(searchTerm) ||
            (Array.isArray(product.description)
              ? product.description.some((desc) =>
                  desc.toLowerCase().includes(searchTerm)
                )
              : product.description?.toLowerCase().includes(searchTerm)) ||
            product.manufacturer?.toLowerCase().includes(searchTerm)
        );
      }

      // Only filter by category if a specific category is selected (not 'all')
      if (filters?.category && filters.category !== "all") {
        filteredProducts = filteredProducts.filter(
          (product) => product.category === filters.category
        );
      }

      // Only filter by status if a specific status is selected (not 'all')
      if (filters?.status && filters.status !== "all") {
        filteredProducts = filteredProducts.filter(
          (product) => product.status === filters.status
        );
      }

      if (filters?.prescriptionRequired !== undefined) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.prescriptionRequired === filters.prescriptionRequired
        );
      }

      // Apply sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case "price_low":
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case "price_high":
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case "name_asc":
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "name_desc":
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case "newest":
            filteredProducts.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;
          case "oldest":
            filteredProducts.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            break;
          default:
            break;
        }
      }

      // Calculate pagination
      const totalItems = filteredProducts.length;
      const totalPages = Math.ceil(totalItems / pagination.itemsPerPage) || 1; // Ensure at least 1 page
      const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
      const endIndex = startIndex + pagination.itemsPerPage;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      return {
        filteredProducts: paginatedProducts,
        total: totalItems,
        totalPages,
        allProducts, // Return all products for stats calculation
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { getState, rejectWithValue }) => {
    try {
      // In a real app, you would use axios.get with the product ID
      await mockApiDelay();

      // First try to get product from the state
      const state = getState();
      let product = state.products.items.find((p) => p.id === id);

      // If not found in state, check the mockProducts as a fallback
      if (!product) {
        product = mockProducts.find((p) => p.id === id);
      }

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch product");
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      await mockApiDelay();

      // Calculate status based on stock level
      let status = "active";
      const stock = parseInt(productData.stock);
      if (stock === 0) {
        status = "out_of_stock";
      } else if (stock < 10) {
        status = "low_stock";
      }

      // Ensure all array fields are properly formatted
      const formattedProduct = {
        ...productData,
        id: `PRD-${uuidv4().slice(0, 8)}`,
        status,
        description: Array.isArray(productData.description)
          ? productData.description
          : productData.description
          ? [productData.description]
          : [],
        sideEffects: Array.isArray(productData.sideEffects)
          ? productData.sideEffects
          : productData.sideEffects
          ? [productData.sideEffects]
          : [],
        composition: Array.isArray(productData.composition)
          ? productData.composition
          : productData.composition
          ? [productData.composition]
          : [],
        packSize: Array.isArray(productData.packSize)
          ? productData.packSize
          : productData.packSize
          ? [productData.packSize]
          : [],
        storageInstructions: Array.isArray(productData.storageInstructions)
          ? productData.storageInstructions
          : productData.storageInstructions
          ? [productData.storageInstructions]
          : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return formattedProduct;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      await mockApiDelay();

      // Get the existing product from state
      const state = getState();
      const existingProduct = state.products.allItems.find((p) => p.id === id);

      if (!existingProduct) {
        throw new Error("Product not found");
      }

      // Calculate status based on stock level
      let status = "active";
      const stock = parseInt(data.stock);
      if (stock === 0) {
        status = "out_of_stock";
      } else if (stock < 10) {
        status = "low_stock";
      }

      // Ensure all array fields are properly formatted
      const formattedData = {
        ...existingProduct,
        ...data,
        status,
        description: Array.isArray(data.description)
          ? data.description
          : data.description
          ? [data.description]
          : [],
        sideEffects: Array.isArray(data.sideEffects)
          ? data.sideEffects
          : data.sideEffects
          ? [data.sideEffects]
          : [],
        composition: Array.isArray(data.composition)
          ? data.composition
          : data.composition
          ? [data.composition]
          : [],
        packSize: Array.isArray(data.packSize)
          ? data.packSize
          : data.packSize
          ? [data.packSize]
          : [],
        storageInstructions: Array.isArray(data.storageInstructions)
          ? data.storageInstructions
          : data.storageInstructions
          ? [data.storageInstructions]
          : [],
        updatedAt: new Date().toISOString(),
      };

      return { id, data: formattedData };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { getState, rejectWithValue }) => {
    try {
      // In a real app, you would use axios.delete to delete a product
      await mockApiDelay();

      // Check if product exists in the state
      const state = getState();
      const productIndex = state.products.items.findIndex((p) => p.id === id);

      if (productIndex === -1) {
        throw new Error("Product not found");
      }

      // Return the ID to remove from Redux state in the reducer
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete product"
      );
    }
  }
);

export const uploadProductImage = createAsyncThunk(
  "products/uploadProductImage",
  async ({ productId, imageFile }, { getState, rejectWithValue }) => {
    try {
      console.log(
        `Starting upload for product ${productId}, file:`,
        imageFile.name
      );

      // Create a FileReader to read the image file
      const reader = new FileReader();

      // Convert the file reading to a Promise
      const imageDataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(imageFile);
      });

      // In a real app, you would upload the image to a server
      await mockApiDelay();

      // Return the data URL as the image URL
      return {
        productId,
        imageUrl: imageDataUrl,
        fileName: imageFile.name,
      };
    } catch (error) {
      console.error(`Error uploading image for product ${productId}:`, error);
      return rejectWithValue(error.message || "Failed to upload image");
    }
  }
);

export const deleteProductImage = createAsyncThunk(
  "products/deleteProductImage",
  async ({ productId, imageUrl }, { rejectWithValue }) => {
    try {
      // In a real app, you would delete the image from the server or cloud storage
      await mockApiDelay();

      return { productId, imageUrl };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete image");
    }
  }
);

export const searchCategories = createAsyncThunk(
  "products/searchCategories",
  async (searchTerm, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await mockApiDelay();

      // Mock response format
      const response = {
        response: null,
        responseCode: 1,
        responseMessage: "Categories fetched successfully",
        responseStatus: "Success",
        showMessage: true,
      };

      return {
        ...response,
        // Filter categories based on search term
        categories: initialState.categories.filter((category) =>
          category.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      };
    } catch (error) {
      return rejectWithValue({
        response: null,
        responseCode: 0,
        responseMessage: error.message || "Failed to search categories",
        responseStatus: "Error",
        showMessage: true,
      });
    }
  }
);

// New thunk to fetch active categories from categorySlice
export const fetchActiveCategories = createAsyncThunk(
  "products/fetchActiveCategories",
  async (_, { getState, dispatch }) => {
    try {
      // Simulate API delay
      const categories = await listCategory({
        is_active: true,
        include_deleted: false,
      });
      const { response } = categories;
      // In a real app, you would make an API call to get active categories
      // For now, we'll get categories from the category slice if available
      const state = getState();
      let activeCategories = response;
      console.log(activeCategories, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

      // If no categories found in categorySlice or they're not loaded yet, use the default ones
      if (activeCategories.length === 0) {
        console.log("No active categories found, using defaults");
        // Convert string array to objects with id and name
        activeCategories = initialState.categories.map((name, index) => ({
          _id: `default-${index}`,
          name,
        }));
      }

      return activeCategories;
    } catch (error) {
      console.error("Error fetching active categories:", error);
      // Return default categories as objects with id and name
      return initialState.categories.map((name, index) => ({
        _id: `default-${index}`,
        name,
      }));
    }
  }
);

const initialState = {
  items: mockProducts, // Items shown in the current view (filtered)
  allItems: mockProducts, // All items regardless of filtering
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  selectedProduct: null,
  filters: {
    category: "all",
    status: "all",
    sortBy: "newest",
    search: "",
    prescriptionRequired: undefined,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: mockProducts.length,
  },
  categories: [],
  dosageForms: [
    "Tablet",
    "Capsule",
    "Liquid",
    "Injection",
    "Cream",
    "Ointment",
    "Gel",
    "Spray",
    "Drops",
    "Powder",
    "Syrup",
    "Lotion",
    "Suppository",
    "Inhaler",
    "N/A"
  ],
  stats: {
    total: 0,
    active: 0,
    lowStock: 0,
    outOfStock: 0,
    featured: 0,
    prescription: 0,
  },
  categorySearch: {
    searchTerm: "",
    filteredCategories: [],
    status: "idle",
    error: null,
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to first page when filters change
      state.pagination.currentPage = 1;
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearProductError: (state) => {
      state.error = null;
    },
    reorderProductImages: (state, action) => {
      const { productId, newOrder } = action.payload;
      const productIndex = state.items.findIndex((p) => p.id === productId);
      if (productIndex !== -1) {
        state.items[productIndex].images = newOrder;
      }
      if (state.selectedProduct && state.selectedProduct.id === productId) {
        state.selectedProduct.images = newOrder;
      }
    },
    updateProductStats: (state) => {
      // Calculate product stats based on all items
      const total = state.allItems.length;
      const active = state.allItems.filter((p) => p.status === "active").length;
      const lowStock = state.allItems.filter(
        (p) => p.status === "low_stock"
      ).length;
      const outOfStock = state.allItems.filter(
        (p) => p.status === "out_of_stock"
      ).length;
      const featured = state.allItems.filter((p) => p.featured).length;
      const prescription = state.allItems.filter(
        (p) => p.prescriptionRequired
      ).length;

      state.stats = {
        total,
        active,
        lowStock,
        outOfStock,
        featured,
        prescription,
      };
    },
    setCategorySearchTerm: (state, action) => {
      state.categorySearch.searchTerm = action.payload;
    },
    clearCategorySearch: (state) => {
      state.categorySearch.searchTerm = "";
      state.categorySearch.filteredCategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Update the items with fetched products
        state.items = action.payload.filteredProducts;

        // Make sure allItems contains all products
        if (action.payload.allProducts) {
          state.allItems = action.payload.allProducts;
        }

        // Update pagination metadata
        state.pagination.totalItems = action.payload.total;
        state.pagination.totalPages = action.payload.totalPages;

        // Update the stats based on all products, not just the paginated ones
        const allProducts = action.payload.allProducts;
        const total = allProducts.length;
        const active = allProducts.filter((p) => p.status === "active").length;
        const lowStock = allProducts.filter(
          (p) => p.status === "low_stock"
        ).length;
        const outOfStock = allProducts.filter(
          (p) => p.status === "out_of_stock"
        ).length;
        const featured = allProducts.filter((p) => p.featured).length;
        const prescription = allProducts.filter(
          (p) => p.prescriptionRequired
        ).length;

        state.stats = {
          total,
          active,
          lowStock,
          outOfStock,
          featured,
          prescription,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch Product by Id
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Add to both arrays
        state.items.unshift(action.payload);
        state.allItems.unshift(action.payload);

        // Update stats after adding a product
        productSlice.caseReducers.updateProductStats(state);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedProduct = action.payload.data; // Get the updated product data

        // Update in filtered items
        const filteredIndex = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (filteredIndex !== -1) {
          state.items[filteredIndex] = updatedProduct;
        }

        // Update in all items
        const allItemsIndex = state.allItems.findIndex(
          (item) => item.id === action.payload.id
        );
        if (allItemsIndex !== -1) {
          state.allItems[allItemsIndex] = updatedProduct;
        }

        // If this is the currently selected product, update it too
        if (
          state.selectedProduct &&
          state.selectedProduct.id === action.payload.id
        ) {
          state.selectedProduct = updatedProduct;
        }

        // Update stats after updating a product
        productSlice.caseReducers.updateProductStats(state);
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Remove from both arrays
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.allItems = state.allItems.filter(
          (item) => item.id !== action.payload
        );

        // Clear selected product if it was deleted
        if (
          state.selectedProduct &&
          state.selectedProduct.id === action.payload
        ) {
          state.selectedProduct = null;
        }

        // Update stats after deleting a product
        productSlice.caseReducers.updateProductStats(state);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Upload Product Image
      .addCase(uploadProductImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadProductImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { productId, imageUrl } = action.payload;

        // Add the image URL to the product's images array in filtered items
        const productIndex = state.items.findIndex((p) => p.id === productId);
        if (productIndex !== -1) {
          if (!state.items[productIndex].images) {
            state.items[productIndex].images = [];
          }
          state.items[productIndex].images.push(imageUrl);
        }

        // Add the image URL to the product's images array in all items
        const allProductIndex = state.allItems.findIndex(
          (p) => p.id === productId
        );
        if (allProductIndex !== -1) {
          if (!state.allItems[allProductIndex].images) {
            state.allItems[allProductIndex].images = [];
          }
          state.allItems[allProductIndex].images.push(imageUrl);
        }

        // If this is the currently selected product, update it too
        if (state.selectedProduct && state.selectedProduct.id === productId) {
          if (!state.selectedProduct.images) {
            state.selectedProduct.images = [];
          }
          state.selectedProduct.images.push(imageUrl);
        }
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete Product Image
      .addCase(deleteProductImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { productId, imageUrl } = action.payload;

        // Remove the image URL from the product's images array in filtered items
        const productIndex = state.items.findIndex((p) => p.id === productId);
        if (productIndex !== -1 && state.items[productIndex].images) {
          state.items[productIndex].images = state.items[
            productIndex
          ].images.filter((img) => img !== imageUrl);
        }

        // Remove the image URL from the product's images array in all items
        const allProductIndex = state.allItems.findIndex(
          (p) => p.id === productId
        );
        if (allProductIndex !== -1 && state.allItems[allProductIndex].images) {
          state.allItems[allProductIndex].images = state.allItems[
            allProductIndex
          ].images.filter((img) => img !== imageUrl);
        }

        // If this is the currently selected product, update it too
        if (
          state.selectedProduct &&
          state.selectedProduct.id === productId &&
          state.selectedProduct.images
        ) {
          state.selectedProduct.images = state.selectedProduct.images.filter(
            (img) => img !== imageUrl
          );
        }
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add these new cases for category search
      .addCase(searchCategories.pending, (state) => {
        state.categorySearch.status = "loading";
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.categorySearch.status = "succeeded";
        state.categorySearch.filteredCategories = action.payload.categories;
        state.categorySearch.error = null;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.categorySearch.status = "failed";
        state.categorySearch.error = action.payload;
      })

      // New cases for fetchActiveCategories
      .addCase(fetchActiveCategories.pending, (state) => {
        // We don't need to set loading state here as this is a background operation
      })
      .addCase(fetchActiveCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchActiveCategories.rejected, (state) => {
        // Keep existing categories on error
      });
  },
});

// Selectors
export const selectAllProducts = (state) => state.products.items || [];
export const selectProductStatus = (state) => state.products.status;
export const selectProductError = (state) => state.products.error;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectProductFilters = (state) => state.products.filters;
export const selectProductPagination = (state) => state.products.pagination;
export const selectProductCategories = (state) => state.products.categories;
export const selectDosageForms = (state) => state.products.dosageForms;
export const selectProductStats = (state) => state.products.stats;
export const selectCategorySearch = (state) => state.products.categorySearch;

// Memoized selector for filtered products
export const selectFilteredProducts = (state) => {
  const { allItems, filters } = state.products;

  let filteredItems = [...allItems];

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredItems = filteredItems.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (Array.isArray(product.description)
          ? product.description.some((desc) =>
              desc.toLowerCase().includes(searchTerm)
            )
          : product.description?.toLowerCase().includes(searchTerm)) ||
        product.manufacturer?.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.category && filters.category !== "all") {
    filteredItems = filteredItems.filter(
      (product) => product.category === filters.category
    );
  }

  if (filters.status && filters.status !== "all") {
    filteredItems = filteredItems.filter(
      (product) => product.status === filters.status
    );
  }

  if (filters.prescriptionRequired !== undefined) {
    filteredItems = filteredItems.filter(
      (product) => product.prescriptionRequired === filters.prescriptionRequired
    );
  }

  return filteredItems;
};

export const {
  setSelectedProduct,
  updateFilters,
  updatePagination,
  clearProductError,
  reorderProductImages,
  updateProductStats,
  setCategorySearchTerm,
  clearCategorySearch,
} = productSlice.actions;

export default productSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Mock data for Mirror overview
const mockOverviewData = {
  stats: {
    totalUsers: 15840,
    activeUsers: 12652,
    totalOrders: 8562,
    totalRevenue: 4582650,
    totalProducts: 1245,
    averageOrderValue: 535.23,
    percentChanges: {
      users: 12.3,
      orders: 8.7,
      revenue: 15.2,
      products: 5.4
    }
  },
  recentOrders: [
    {
      id: "ORD-PC-7845",
      customerName: "Rahul Sharma",
      date: "2023-06-18T08:30:00",
      amount: 1250.50,
      status: "delivered",
      items: 4
    },
    {
      id: "ORD-PC-7844",
      customerName: "Priya Patel",
      date: "2023-06-18T07:45:00",
      amount: 875.25,
      status: "processing",
      items: 3
    },
    {
      id: "ORD-PC-7843",
      customerName: "Amit Singh",
      date: "2023-06-18T07:15:00",
      amount: 2340.80,
      status: "shipped",
      items: 6
    },
    {
      id: "ORD-PC-7842",
      customerName: "Deepa Gupta",
      date: "2023-06-18T06:30:00",
      amount: 560.40,
      status: "delivered",
      items: 2
    },
    {
      id: "ORD-PC-7841",
      customerName: "Vikram Reddy",
      date: "2023-06-17T18:20:00",
      amount: 1875.35,
      status: "delivered",
      items: 5
    }
  ],
  topProducts: [
    {
      id: "PROD-PC-456",
      name: "Ayurvedic Immunity Booster",
      salesCount: 1245,
      amount: 124500,
      category: "Supplements"
    },
    {
      id: "PROD-PC-234",
      name: "Diabetes Care Monthly Package",
      salesCount: 860,
      amount: 258000,
      category: "Chronic Care"
    },
    {
      id: "PROD-PC-789",
      name: "Multivitamin Daily Pack",
      salesCount: 720,
      amount: 57600,
      category: "Vitamins"
    },
    {
      id: "PROD-PC-567",
      name: "Protein Supplement Powder",
      salesCount: 695,
      amount: 104250,
      category: "Supplements"
    },
    {
      id: "PROD-PC-890",
      name: "Organic Herbal Tea Set",
      salesCount: 530,
      amount: 31800,
      category: "Wellness"
    }
  ],
  activePromotions: [
    {
      id: "PROMO-124",
      title: "Weekend Flash Sale",
      discount: 25,
      startDate: "2023-06-17T00:00:00",
      endDate: "2023-06-19T23:59:59",
      productsCount: 45,
      status: "active"
    },
    {
      id: "PROMO-123",
      title: "Wellness Package Discount",
      discount: 15,
      startDate: "2023-06-15T00:00:00",
      endDate: "2023-06-25T23:59:59",
      productsCount: 28,
      status: "active"
    },
    {
      id: "PROMO-122",
      title: "First Order Special",
      discount: 20,
      startDate: "2023-06-01T00:00:00",
      endDate: "2023-06-30T23:59:59",
      productsCount: 120,
      status: "active"
    }
  ],
  salesData: {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Orders",
          data: [65, 78, 52, 91, 83, 105, 120]
        },
        {
          label: "Revenue",
          data: [32500, 39000, 26000, 45500, 41500, 52500, 60000]
        }
      ]
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Orders",
          data: [420, 385, 490, 574]
        },
        {
          label: "Revenue",
          data: [210000, 192500, 245000, 287000]
        }
      ]
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Orders",
          data: [1250, 1380, 1420, 1500, 1680, 1869]
        },
        {
          label: "Revenue",
          data: [625000, 690000, 710000, 750000, 840000, 934500]
        }
      ]
    }
  },
  userActivity: {
    activeHours: {
      labels: ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"],
      data: [120, 80, 180, 640, 780, 820, 950, 620]
    },
    deviceUsage: {
      labels: ["Mobile", "Tablet", "Desktop"],
      data: [75, 15, 10]
    },
    userRetention: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
      data: [100, 85, 76, 68, 65]
    }
  }
};

// Mock data for flash sale products
const mockFlashSaleProducts = [
  {
    id: "FS001",
    name: "Vitamin D3 1000 IU",
    originalPrice: 299,
    salePrice: 199,
    discount: 33,
    stockLeft: 25,
    image: "path/to/vitamin-d3.jpg"
  },
  {
    id: "FS002",
    name: "Multivitamin Tablets",
    originalPrice: 599,
    salePrice: 399,
    discount: 33,
    stockLeft: 40,
    image: "path/to/multivitamin.jpg"
  }
];

// Mock data for categories
const mockCategories = [
  {
    id: "CAT001",
    name: "Medicines",
    icon: "💊",
    slug: "medicines"
  },
  {
    id: "CAT002",
    name: "Vitamins",
    icon: "💉",
    slug: "vitamins"
  },
  {
    id: "CAT003",
    name: "Personal Care",
    icon: "🧴",
    slug: "personal-care"
  },
  {
    id: "CAT004",
    name: "Health Devices",
    icon: "🩺",
    slug: "health-devices"
  }
];

// Mock data for health promotions
const mockHealthPromotions = [
  {
    id: "PROM001",
    title: "Health Checkup Kits",
    description: "Complete health screening kits at special prices",
    discount: 20,
    tag: "Best Seller"
  },
  {
    id: "PROM002",
    title: "Vitamin Supplements",
    description: "Premium quality vitamins for daily health",
    discount: 15,
    tag: "New"
  }
];

// Mock data for health tips
const mockHealthTips = [
  {
    id: "TIP001",
    title: "Stay Hydrated",
    description: "Drink 8 glasses of water daily",
    icon: "💧"
  },
  {
    id: "TIP002",
    title: "Regular Exercise",
    description: "30 minutes of daily activity",
    icon: "🏃"
  }
];

// Mock data for featured products
const mockFeaturedProducts = [
  {
    id: "PROD001",
    name: "Paracetamol 500mg",
    originalPrice: 65,
    salePrice: 49,
    discount: 25,
    rating: 4.5,
    ratingCount: 2345,
    image: "path/to/paracetamol.jpg"
  },
  {
    id: "PROD002",
    name: "Vitamin C 1000mg",
    price: 299,
    rating: 4.2,
    ratingCount: 0,
    image: "path/to/vitamin-c.jpg"
  }
];

// Mock data for special offers
const mockSpecialOffers = [
  {
    id: "SO001",
    title: "Summer Health Package",
    description: "Complete health checkup with vitamin supplements",
    discount: 30,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    image: "path/to/summer-package.jpg",
    products: ["PROD001", "PROD002", "PROD003"]
  },
  {
    id: "SO002",
    title: "Diabetes Care Bundle",
    description: "Monthly supply of diabetes medicines and testing strips",
    discount: 25,
    validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    image: "path/to/diabetes-bundle.jpg",
    products: ["PROD004", "PROD005", "PROD006"]
  }
];

// Mock data for UI sections
const mockUiConfig = {
  sections: [
    {
      id: "search",
      name: "Search Bar",
      isEnabled: true
    },
    {
      id: "flashSale",
      name: "Flash Sale",
      isEnabled: true,
      timer: {
        days: 3,
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      id: "categories",
      name: "Categories",
      isEnabled: true
    },
    {
      id: "healthPromotions",
      name: "Health Promotions",
      isEnabled: true
    },
    {
      id: "healthTips",
      name: "Health Tips",
      isEnabled: true
    },
    {
      id: "featuredProducts",
      name: "Featured Products",
      isEnabled: true
    },
    {
      id: "specialOffers",
      name: "Special Offers",
      isEnabled: true,
      order: 6
    }
  ]
};

// Thunks
export const fetchHomeData = createAsyncThunk(
  "plusCart/fetchHomeData",
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      response: {
        flashSale: {
          products: mockFlashSaleProducts,
          endsIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        },
        categories: mockCategories,
        healthPromotions: mockHealthPromotions,
        healthTips: mockHealthTips,
        featuredProducts: mockFeaturedProducts
      },
      responseCode: 1,
      responseMessage: "Home data fetched successfully",
      responseStatus: "Success",
      showMessage: true
    };
  }
);

export const updateFlashSale = createAsyncThunk(
  "plusCart/updateFlashSale",
  async (flashSaleData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      response: {
        ...flashSaleData
      },
      responseCode: 1,
      responseMessage: "Flash sale updated successfully",
      responseStatus: "Success",
      showMessage: true
    };
  }
);

export const updateFeaturedProducts = createAsyncThunk(
  "plusCart/updateFeaturedProducts",
  async (products) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      response: products,
      responseCode: 1,
      responseMessage: "Featured products updated successfully",
      responseStatus: "Success",
      showMessage: true
    };
  }
);

export const updateHealthPromotions = createAsyncThunk(
  "plusCart/updateHealthPromotions",
  async (promotions) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      response: promotions,
      responseCode: 1,
      responseMessage: "Health promotions updated successfully",
      responseStatus: "Success",
      showMessage: true
    };
  }
);

// Thunk for fetching UI config
export const fetchUiConfig = createAsyncThunk(
  "plusCart/fetchUiConfig",
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      response: mockUiConfig,
      responseCode: 1,
      responseMessage: "UI configuration fetched successfully",
      responseStatus: "Success",
      showMessage: true
    };
  }
);

// Thunk for toggling section visibility
export const toggleSectionVisibility = createAsyncThunk(
  "plusCart/toggleSectionVisibility",
  async ({ sectionId, isEnabled }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      response: { sectionId, isEnabled },
      responseCode: 1,
      responseMessage: `Section ${isEnabled ? 'enabled' : 'disabled'} successfully`,
      responseStatus: "Success",
      showMessage: true
    };
  }
);

// Thunk for updating flash sale timer
export const updateFlashSaleTimer = createAsyncThunk(
  "plusCart/updateFlashSaleTimer",
  async (days) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const endDate = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toISOString();

    return {
      response: {
        days,
        endDate,
      },
      responseCode: 1,
      responseMessage: `Flash sale timer updated to ${days} days successfully`,
      responseStatus: "Success",
      showMessage: true,
    };
  }
);


// Thunk for updating special offers
export const updateSpecialOffers = createAsyncThunk(
  "plusCart/updateSpecialOffers",
  async (offers) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      response: offers,
      responseCode: 1,
      responseMessage: "Special offers updated successfully",
      responseStatus: "Success",
      showMessage: true
    };
  }
);

const initialState = {
  overview: mockOverviewData,
  flashSale: {
    products: mockFlashSaleProducts,
    endsIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  categories: mockCategories,
  healthPromotions: mockHealthPromotions,
  healthTips: mockHealthTips,
  featuredProducts: mockFeaturedProducts,
  specialOffers: mockSpecialOffers,
  uiConfig: mockUiConfig,
  status: 'idle',
  error: null,
  chartType: 'daily',
  chartView: 'orders',
  lastUpdated: null
};

const plusCartSlice = createSlice({
  name: 'plusCart',
  initialState,
  reducers: {
    setChartType: (state, action) => {
      state.chartType = action.payload;
    },
    setChartView: (state, action) => {
      state.chartView = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateFlashSaleTimer: (state, action) => {
      state.flashSale.endsIn = action.payload;
    },
    updateProductStock: (state, action) => {
      const { productId, newStock } = action.payload;
      const product = state.flashSale.products.find(p => p.id === productId);
      if (product) {
        product.stockLeft = newStock;
      }
    },
    resetUiConfig: (state) => {
      state.uiConfig = mockUiConfig;
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.flashSale = action.payload.response.flashSale;
        state.categories = action.payload.response.categories;
        state.healthPromotions = action.payload.response.healthPromotions;
        state.healthTips = action.payload.response.healthTips;
        state.featuredProducts = action.payload.response.featuredProducts;
        state.specialOffers = mockSpecialOffers;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateFlashSale.fulfilled, (state, action) => {
        state.flashSale = action.payload.response;
      })
      .addCase(updateFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload.response;
      })
      .addCase(updateHealthPromotions.fulfilled, (state, action) => {
        state.healthPromotions = action.payload.response;
      })
      .addCase(fetchUiConfig.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUiConfig.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.uiConfig = action.payload.response;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUiConfig.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(toggleSectionVisibility.fulfilled, (state, action) => {
        const { sectionId, isEnabled } = action.payload.response;
        const section = state.uiConfig.sections.find(s => s.id === sectionId);
        if (section) {
          section.isEnabled = isEnabled;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateFlashSaleTimer.fulfilled, (state, action) => {
        const { days, endDate } = action.payload.response;
        const flashSaleSection = state.uiConfig.sections.find(s => s.id === "flashSale");
        if (flashSaleSection) {
          flashSaleSection.timer = { days, endDate };
        }
      })
      .addCase(updateSpecialOffers.fulfilled, (state, action) => {
        state.specialOffers = action.payload.response;
      });
  }
});

export const { setChartType, setChartView, setStatus, setError, updateProductStock, resetUiConfig } = plusCartSlice.actions;

// Selectors
export const selectPlusCartOverview = (state) => state.plusCart.overview;
export const selectPlusCartStats = (state) => state.plusCart.overview.stats;
export const selectPlusCartRecentOrders = (state) => state.plusCart.overview.recentOrders;
export const selectPlusCartTopProducts = (state) => state.plusCart.overview.topProducts;
export const selectPlusCartActivePromotions = (state) => state.plusCart.overview.activePromotions;
export const selectPlusCartSalesData = (state) => state.plusCart.overview.salesData;
export const selectPlusCartUserActivity = (state) => state.plusCart.overview.userActivity;
export const selectPlusCartChartType = (state) => state.plusCart.chartType;
export const selectPlusCartChartView = (state) => state.plusCart.chartView;
export const selectPlusCartStatus = (state) => state.plusCart.status;
export const selectPlusCartError = (state) => state.plusCart.error;
export const selectFlashSale = (state) => state.plusCart.flashSale;
export const selectCategories = (state) => state.plusCart.categories;
export const selectHealthPromotions = (state) => state.plusCart.healthPromotions;
export const selectHealthTips = (state) => state.plusCart.healthTips;
export const selectFeaturedProducts = (state) => state.plusCart.featuredProducts;
export const selectUiConfig = (state) => state.plusCart.uiConfig;
export const selectUiStatus = (state) => state.plusCart.status;
export const selectUiError = (state) => state.plusCart.error;
export const selectLastUpdated = (state) => state.plusCart.lastUpdated;
export const selectSectionById = (state, sectionId) => 
  state.plusCart.uiConfig.sections.find(s => s.id === sectionId);
export const selectVisibleSections = (state) => 
  state.plusCart.uiConfig.sections
    .filter(s => s.isEnabled)
    .sort((a, b) => a.order - b.order);
export const selectFlashSaleTimer = (state) => 
  state.plusCart.uiConfig.sections.find(s => s.id === "flashSale")?.timer;
export const selectSpecialOffers = (state) => state.plusCart.specialOffers;

export default plusCartSlice.reducer; 
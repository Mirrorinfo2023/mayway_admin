import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Mock data for development
const mockStats = {
  totalUsers: 1248,
  totalProducts: 684,
  totalOrders: 3942,
  totalRevenue: 287650,
  percentChanges: {
    users: 12.5,
    products: 8.3,
    orders: 15.7,
    revenue: 23.4,
  },
};

const mockSalesData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Revenue',
      data: [12500, 18200, 14800, 13500, 19300, 22800, 24100],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    },
    {
      label: 'Orders',
      data: [145, 132, 151, 184, 178, 196, 201],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
    },
  ],
};

const mockRecentActivity = [
  {
    id: 1,
    type: 'order',
    message: 'New order #38294 received from John Doe',
    timestamp: '2 minutes ago',
  },
  {
    id: 2,
    type: 'user',
    message: 'New user Sarah Smith registered',
    timestamp: '45 minutes ago',
  },
  {
    id: 3,
    type: 'product',
    message: 'Product "Vitamin C 1000mg" is low in stock (5 remaining)',
    timestamp: '2 hours ago',
  },
  {
    id: 4,
    type: 'order',
    message: 'Order #38280 has been shipped',
    timestamp: '3 hours ago',
  },
  {
    id: 5,
    type: 'user',
    message: 'Michael Johnson updated their profile',
    timestamp: '5 hours ago',
  },
];

// Add product analytics data to mock data
const mockProductAnalytics = {
  sales: {
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Units Sold',
          data: [12, 19, 15, 22, 35, 40, 38],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.4)',
          tension: 0.4,
        }
      ]
    },
    weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Units Sold',
          data: [85, 102, 135, 160],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.4)',
          tension: 0.4,
        }
      ]
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Units Sold',
          data: [350, 410, 520, 480, 390, 460, 510, 540, 590, 610, 650, 680],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.4)',
          tension: 0.4,
        }
      ]
    }
  },
  revenue: {
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Revenue ($)',
          data: [420, 650, 510, 780, 1200, 1400, 1300],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.4)',
          tension: 0.4,
        }
      ]
    },
    weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Revenue ($)',
          data: [2950, 3580, 4725, 5600],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.4)',
          tension: 0.4,
        }
      ]
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Revenue ($)',
          data: [12250, 14350, 18200, 16800, 13650, 16100, 17850, 18900, 20650, 21350, 22750, 23800],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.4)',
          tension: 0.4,
        }
      ]
    }
  },
  inventory: {
    data: {
      labels: ['In Stock', 'Low Stock', 'Out of Stock', 'On Order'],
      datasets: [
        {
          label: 'Inventory Status',
          data: [65, 15, 5, 15],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',  // green
            'rgba(251, 191, 36, 0.8)',  // yellow
            'rgba(239, 68, 68, 0.8)',   // red
            'rgba(59, 130, 246, 0.8)',  // blue
          ],
        },
      ],
    }
  },
  category: {
    data: {
      labels: ['Analgesics', 'Antibiotics', 'Supplements', 'Antihistamines', 'Other'],
      datasets: [
        {
          label: 'Sales by Category',
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',  // blue
            'rgba(139, 92, 246, 0.8)',  // purple
            'rgba(16, 185, 129, 0.8)',  // green
            'rgba(251, 191, 36, 0.8)',  // yellow
            'rgba(107, 114, 128, 0.8)', // gray
          ],
        },
      ],
    }
  },
  metrics: {
    totalSales: 1248,
    totalSalesGrowth: 8.5,
    revenue: 43650,
    revenueGrowth: 12.3,
    avgOrderValue: 35.2,
    avgOrderGrowth: 4.8,
    returnRate: 2.4,
    returnRateChange: -0.7
  }
};

// Async thunks for API calls
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      // For development, use mock data
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      // Comment this out for development
      // const response = await axios.get('/api/dashboard/stats');
      // return response.data;
      
      return mockStats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return rejectWithValue('Failed to fetch dashboard statistics. Please try again.');
    }
  }
);

export const fetchSalesData = createAsyncThunk(
  'dashboard/fetchSalesData',
  async (period = 'weekly', { rejectWithValue }) => {
    try {
      // For development, use mock data
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network delay
      
      // Comment this out for development
      // const response = await axios.get(`/api/dashboard/sales?period=${period}`);
      // return response.data;
      
      return mockSalesData;
    } catch (error) {
      console.error('Error fetching sales data:', error);
      return rejectWithValue('Failed to fetch sales data. Please try again.');
    }
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchRecentActivity',
  async (_, { rejectWithValue }) => {
    try {
      // For development, use mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Comment this out for development
      // const response = await axios.get('/api/dashboard/activity');
      // return response.data;
      
      return mockRecentActivity;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return rejectWithValue('Failed to fetch recent activity. Please try again.');
    }
  }
);

export const fetchProductAnalytics = createAsyncThunk(
  'dashboard/fetchProductAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      // For development, use mock data
      await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay
      
      // Comment this out for development
      // const response = await axios.get('/api/dashboard/product-analytics');
      // return response.data;
      
      return mockProductAnalytics;
    } catch (error) {
      console.error('Error fetching product analytics data:', error);
      return rejectWithValue('Failed to fetch product analytics data. Please try again.');
    }
  }
);

const initialState = {
  stats: {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    percentChanges: {
      users: 0,
      products: 0,
      orders: 0,
      revenue: 0,
    },
  },
  salesData: {
    labels: [],
    datasets: [],
  },
  recentActivity: [],
  period: 'weekly',
  status: 'idle',
  error: null,
  lastFetched: null,
  productAnalytics: {
    sales: {
      daily: { labels: [], datasets: [] },
      weekly: { labels: [], datasets: [] },
      monthly: { labels: [], datasets: [] }
    },
    revenue: {
      daily: { labels: [], datasets: [] },
      weekly: { labels: [], datasets: [] },
      monthly: { labels: [], datasets: [] }
    },
    inventory: { data: { labels: [], datasets: [] } },
    category: { data: { labels: [], datasets: [] } },
    metrics: {
      totalSales: 0,
      totalSalesGrowth: 0,
      revenue: 0,
      revenueGrowth: 0,
      avgOrderValue: 0,
      avgOrderGrowth: 0,
      returnRate: 0,
      returnRateChange: 0
    }
  },
  chartType: 'sales',
  chartTimeRange: 'weekly',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    clearDashboardError: (state) => {
      state.error = null;
    },
    setChartType: (state, action) => {
      state.chartType = action.payload;
    },
    setChartTimeRange: (state, action) => {
      state.chartTimeRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch dashboard data';
      })
      // Fetch Sales Data
      .addCase(fetchSalesData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSalesData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.salesData = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchSalesData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch sales data';
      })
      // Fetch Recent Activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recentActivity = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch recent activity';
      })
      // Fetch Product Analytics
      .addCase(fetchProductAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProductAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productAnalytics = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchProductAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch product analytics data';
      });
  },
});

// Selectors
export const selectDashboardStats = (state) => state.dashboard.stats;
export const selectSalesData = (state) => state.dashboard.salesData;
export const selectRecentActivity = (state) => state.dashboard.recentActivity;
export const selectDashboardStatus = (state) => state.dashboard.status;
export const selectDashboardError = (state) => state.dashboard.error;
export const selectDashboardPeriod = (state) => state.dashboard.period;
export const selectLastFetched = (state) => state.dashboard.lastFetched;
export const selectProductAnalytics = (state) => state.dashboard.productAnalytics;
export const selectChartType = (state) => state.dashboard.chartType;
export const selectChartTimeRange = (state) => state.dashboard.chartTimeRange;
export const selectProductMetrics = (state) => state.dashboard.productAnalytics.metrics;

export const { setPeriod, clearDashboardError, setChartType, setChartTimeRange } = dashboardSlice.actions;

export default dashboardSlice.reducer; 
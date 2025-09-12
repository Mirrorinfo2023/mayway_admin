import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Users, Package, DollarSign, ShoppingCart, TrendingUp, TrendingDown, RefreshCw, AlertTriangle, ChevronRight } from "lucide-react";
import {
  fetchDashboardStats,
  fetchSalesData,
  fetchRecentActivity,
  fetchProductAnalytics,
  selectDashboardStats,
  selectDashboardStatus,
  selectDashboardError,
  selectRecentActivity,
  setPeriod,
  selectDashboardPeriod,
} from "../redux/slices/dashboardSlice";
import ProductChart from "../components/common/ProductChart";
import "../styles/animations.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const status = useSelector(selectDashboardStatus);
  const error = useSelector(selectDashboardError);
  const recentActivity = useSelector(selectRecentActivity);
  const currentPeriod = useSelector(selectDashboardPeriod);
  const [isLoading, setIsLoading] = useState(false);
  const [renderError, setRenderError] = useState(null);

  // Transform the API data to our UI format
  const statsData = [
    {
      title: "Total Users",
      value: stats?.totalUsers?.toLocaleString() || "0",
      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />,
      change: {
        value: `${Math.abs(stats?.percentChanges?.users || 0)}%`,
        type: (stats?.percentChanges?.users || 0) >= 0 ? "increase" : "decrease",
      },
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-100 dark:bg-blue-800/30",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts?.toLocaleString() || "0",
      icon: <Package className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />,
      change: {
        value: `${Math.abs(stats?.percentChanges?.products || 0)}%`,
        type: (stats?.percentChanges?.products || 0) >= 0 ? "increase" : "decrease",
      },
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconBg: "bg-purple-100 dark:bg-purple-800/30",
    },
    {
      title: "Revenue",
      value: `$${stats?.totalRevenue?.toLocaleString() || "0"}`,
      icon: <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />,
      change: {
        value: `${Math.abs(stats?.percentChanges?.revenue || 0)}%`,
        type: (stats?.percentChanges?.revenue || 0) >= 0 ? "increase" : "decrease",
      },
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconBg: "bg-green-100 dark:bg-green-800/30",
    },
    {
      title: "Orders",
      value: stats?.totalOrders?.toLocaleString() || "0",
      icon: <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />,
      change: {
        value: `${Math.abs(stats?.percentChanges?.orders || 0)}%`,
        type: (stats?.percentChanges?.orders || 0) >= 0 ? "increase" : "decrease",
      },
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconBg: "bg-orange-100 dark:bg-orange-800/30",
    },
  ];

  // Fetch dashboard data on component mount
  useEffect(() => {
    try {
      console.log("Dispatching dashboard data fetches");
      dispatch(fetchDashboardStats());
      dispatch(fetchSalesData(currentPeriod));
      dispatch(fetchRecentActivity());
      dispatch(fetchProductAnalytics());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setRenderError(err.message);
    }
  }, [dispatch, currentPeriod]);

  const handleRefresh = () => {
    setIsLoading(true);
    setRenderError(null);
    try {
      Promise.all([
        dispatch(fetchDashboardStats()),
        dispatch(fetchSalesData(currentPeriod)),
        dispatch(fetchRecentActivity()),
        dispatch(fetchProductAnalytics()),
      ]).finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 600);
      });
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
      setRenderError(err.message);
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (period) => {
    dispatch(setPeriod(period));
    dispatch(fetchSalesData(period));
  };

  // If there's an error, show error UI
  if (error || renderError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm animate-fadeIn">
        <AlertTriangle size={40} className="text-red-500 mb-4" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">Dashboard Error</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center text-sm sm:text-base">
          {error || renderError || "Failed to load dashboard data. Please try again."}
        </p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // If data is loading for the first time, show a loading UI
  if (status === "loading" && !stats.totalUsers) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Welcome to Mirror Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Here's what's happening with your store today.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 outline-none focus:outline-none">
          {/* Search Bar - Always visible */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl shadow-sm p-3 sm:p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer ${
              status === "loading" && !isLoading ? "opacity-70 animate-pulse" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className={`p-1.5 sm:p-2 rounded-lg ${stat.iconBg}`}>{stat.icon}</div>
              <span
                className={`flex items-center gap-1 text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                  stat.change.type === "increase"
                    ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                    : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                }`}
              >
                {stat.change.type === "increase" ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />}
                {stat.change.value}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</h3>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">vs. last month</p>
          </div>
        ))}
      </div>

      {/* Period Toggle - Scrollable on mobile */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-sm overflow-x-auto">
        <div className="min-w-max flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">Sales Overview</h2>
          <div className="inline-flex rounded-md shadow-sm">
            {["daily", "weekly", "monthly", "yearly"].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => handlePeriodChange(period)}
                className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium ${
                  currentPeriod === period
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                } ${period === "daily" ? "rounded-l-lg" : ""} ${
                  period === "yearly" ? "rounded-r-lg" : ""
                } border border-gray-200 dark:border-gray-600 transition-colors`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Analytics Chart */}
      <ProductChart />

      {/* Quick Actions and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-4 sm:p-6 text-white">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Add New Product</h3>
            <p className="text-sm text-blue-100 mb-3 sm:mb-4">Create a new product listing with details and inventory</p>
            <button className="bg-white text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base flex items-center gap-1">
              Add Product
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-4 sm:p-6 text-white">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Process Orders</h3>
            <p className="text-sm text-purple-100 mb-3 sm:mb-4">View and process pending customer orders</p>
            <button className="bg-white text-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-purple-50 transition-colors text-sm sm:text-base flex items-center gap-1">
              View Orders
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
            Recent Activity
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full pulse">
              Live
            </span>
          </h3>
          <div className="space-y-2 sm:space-y-4">
            {status === "loading" && !recentActivity.length
              ? // Skeleton loader for activity
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 animate-pulse">
                      <div className="w-2 h-2 mt-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="flex-1">
                        <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-1 sm:mb-2"></div>
                        <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
              : recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className={`w-2 h-2 mt-2 rounded-full ${activity.type === "order" ? "bg-green-500" : "bg-blue-500"}`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

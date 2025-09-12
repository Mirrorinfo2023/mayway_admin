import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Package, TrendingUp, TrendingDown } from "lucide-react";
import {
  fetchProductAnalytics,
  selectProductAnalytics,
  selectChartType,
  selectChartTimeRange,
  selectProductMetrics,
  setChartType,
  setChartTimeRange,
  selectDashboardStatus,
} from "../../redux/slices/dashboardSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
);
ChartJS.defaults.font.family = "Inter, sans-serif";
ChartJS.defaults.color = "rgba(107, 114, 128, 0.8)";
ChartJS.defaults.borderColor = "rgba(229, 231, 235, 0.5)";

const ProductChart = () => {
  const dispatch = useDispatch();
  const productAnalytics = useSelector(selectProductAnalytics);
  const chartType = useSelector(selectChartType);
  const timeRange = useSelector(selectChartTimeRange);
  const metrics = useSelector(selectProductMetrics);
  const status = useSelector(selectDashboardStatus);

  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false); // ✅ track mobile size

  useEffect(() => {
    dispatch(fetchProductAnalytics());
  }, [dispatch]);

  // ✅ set mobile flag only in browser
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 640);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getFormattedChartData = (data) => {
    if (chartType === "sales" || chartType === "revenue") {
      const chartData = data[chartType][timeRange];
      if (!chartData?.datasets?.length) return { labels: [], datasets: [] };

      return {
        labels: chartData.labels,
        datasets: chartData.datasets.map((dataset) => ({
          ...dataset,
          backgroundColor: (context) => {
            if (!context?.chart?.ctx) return dataset.backgroundColor;
            const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(
              0,
              chartType === "sales"
                ? "rgba(59, 130, 246, 0.4)"
                : "rgba(16, 185, 129, 0.4)"
            );
            gradient.addColorStop(
              1,
              chartType === "sales"
                ? "rgba(59, 130, 246, 0.0)"
                : "rgba(16, 185, 129, 0.0)"
            );
            return gradient;
          },
          borderWidth: 2,
          pointBackgroundColor:
            chartType === "sales" ? "rgb(59, 130, 246)" : "rgb(16, 185, 129)",
          pointBorderColor: "white",
          pointBorderWidth: 2,
        })),
      };
    }

    if (chartType === "inventory" || chartType === "category") {
      const chartData = data[chartType].data;
      if (!chartData?.datasets?.length) return { labels: [], datasets: [] };

      const colors =
        chartType === "inventory"
          ? ["rgb(34, 197, 94)", "rgb(234, 179, 8)", "rgb(239, 68, 68)", "rgb(59, 130, 246)"]
          : ["rgb(99, 102, 241)", "rgb(168, 85, 247)", "rgb(236, 72, 153)", "rgb(14, 165, 233)"];

      return {
        ...chartData,
        datasets: chartData.datasets.map((dataset) => ({
          ...dataset,
          backgroundColor: colors,
          borderWidth: 0,
        })),
      };
    }

    return { labels: [], datasets: [] };
  };

  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: isMobile ? "bottom" : "right",
          labels: {
            usePointStyle: true,
            padding: isMobile ? 10 : 15,
            font: { size: isMobile ? 10 : 12 },
          },
        },
        tooltip: {
          backgroundColor: "rgba(17, 24, 39, 0.95)",
          padding: isMobile ? 8 : 12,
          titleFont: { size: isMobile ? 12 : 14 },
          bodyFont: { size: isMobile ? 11 : 13 },
          callbacks: {
            label: (context) => {
              const value = context.parsed?.y || context.parsed || 0;
              return chartType === "revenue"
                ? `$${value.toLocaleString()}`
                : value.toLocaleString();
            },
          },
        },
      },
    };

    if (chartType === "inventory" || chartType === "category") {
      return { ...baseOptions, cutout: "75%" };
    }

    return {
      ...baseOptions,
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: isMobile ? 10 : 12 },
            maxRotation: isMobile ? 45 : 0,
          },
        },
        y: {
          position: "right",
          grid: { color: "rgba(203, 213, 225, 0.2)" },
          ticks: {
            font: { size: isMobile ? 10 : 12 },
            callback: (value) =>
              chartType === "revenue" ? `$${value}` : value,
          },
        },
      },
    };
  };

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [chartType, timeRange]);

  const renderChart = () => {
    const options = getChartOptions();
    const data = getFormattedChartData(productAnalytics);

    if (chartType === "sales") return <Line data={data} options={options} />;
    if (chartType === "revenue") return <Bar data={data} options={options} />;
    if (chartType === "inventory" || chartType === "category") {
      return <Doughnut data={data} options={options} />;
    }
    return null;
  };

  if (status === "loading" && !productAnalytics.sales.daily.labels.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      {/* … your existing JSX stays the same … */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        <div className="h-[300px] sm:h-[400px]">{renderChart()}</div>
      </div>
    </div>
  );
};

export default ProductChart;

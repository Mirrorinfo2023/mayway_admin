import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  ChevronRight,
  TrendingUp,
  Clock,
  LineChart as LineChartIcon,
  BarChart2,
  PieChart as PieChartIcon,
  Percent,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  selectPlusCartStats,
  selectPlusCartRecentOrders,
  selectPlusCartTopProducts,
  selectPlusCartActivePromotions,
  selectPlusCartSalesData,
  selectPlusCartChartType,
  selectPlusCartChartView,
  setChartType,
  setChartView,
} from "@/redux/slices/plusCartSlice";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Overview = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectPlusCartStats);
  const recentOrders = useSelector(selectPlusCartRecentOrders);
  const topProducts = useSelector(selectPlusCartTopProducts);
  const activePromotions = useSelector(selectPlusCartActivePromotions);
  const salesData = useSelector(selectPlusCartSalesData);
  const chartType = useSelector(selectPlusCartChartType);
  const chartView = useSelector(selectPlusCartChartView);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format numbers with commas
  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Prepare chart data
  const getChartData = () => {
    const data = salesData[chartType];

    return {
      labels: data.labels,
      datasets: [
        {
          label: chartView === "orders" ? "Orders" : "Revenue",
          data: data.datasets.find((d) => d.label.toLowerCase() === chartView).data,
          borderColor: chartView === "orders" ? "rgb(99, 102, 241)" : "rgb(34, 197, 94)",
          backgroundColor: chartView === "orders" ? "rgba(99, 102, 241, 0.5)" : "rgba(34, 197, 94, 0.5)",
          tension: 0.2,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Mirror ${chartView === "orders" ? "Orders" : "Revenue"} - ${chartType.charAt(0).toUpperCase() + chartType.slice(1)}`,
      },
    },
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Mirror Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.percentChanges.users > 0 ? "text-green-500" : "text-red-500"}`}>
                {stats.percentChanges.users > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                {Math.abs(stats.percentChanges.users)}% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalOrders)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.percentChanges.orders > 0 ? "text-green-500" : "text-red-500"}`}>
                {stats.percentChanges.orders > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                {Math.abs(stats.percentChanges.orders)}% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${stats.percentChanges.revenue > 0 ? "text-green-500" : "text-red-500"}`}>
                {stats.percentChanges.revenue > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                {Math.abs(stats.percentChanges.revenue)}% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center text-green-500">
                <ArrowUp className="h-4 w-4 mr-1" />
                4.2% from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Overview of Mirror app sales and revenue</CardDescription>
          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-2">
              <Button variant={chartView === "orders" ? "default" : "outline"} size="sm" onClick={() => dispatch(setChartView("orders"))}>
                Orders
              </Button>
              <Button variant={chartView === "revenue" ? "default" : "outline"} size="sm" onClick={() => dispatch(setChartView("revenue"))}>
                Revenue
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant={chartType === "daily" ? "default" : "outline"} size="sm" onClick={() => dispatch(setChartType("daily"))}>
                Daily
              </Button>
              <Button variant={chartType === "weekly" ? "default" : "outline"} size="sm" onClick={() => dispatch(setChartType("weekly"))}>
                Weekly
              </Button>
              <Button variant={chartType === "monthly" ? "default" : "outline"} size="sm" onClick={() => dispatch(setChartType("monthly"))}>
                Monthly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Line options={chartOptions} data={getChartData()} />
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from Mirror app</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{formatCurrency(order.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "success"
                            : order.status === "processing"
                            ? "outline"
                            : order.status === "shipped"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full flex items-center justify-center">
              View All Orders <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Top Products */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products in the Mirror app</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{formatNumber(product.salesCount)}</TableCell>
                    <TableCell>{formatCurrency(product.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full flex items-center justify-center">
              View All Products <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Active Promotions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Promotions</CardTitle>
          <CardDescription>Current active promotions in the Mirror app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activePromotions.map((promo) => (
              <Card key={promo.id} className="bg-muted">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{promo.discount}% Off</Badge>
                    <Badge variant="outline" className="text-green-500 bg-green-50">
                      Active
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{promo.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Products:</span>
                    <span className="font-medium">{promo.productsCount} items</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start Date:</span>
                    {/* <span className="font-medium">{new Date(promo.startDate).toLocaleDateString()}</span> */}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">End Date:</span>
                    {/* <span className="font-medium">{new Date(promo.endDate).toLocaleDateString()}</span> */}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full flex items-center justify-center">
            Manage Promotions <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Overview;

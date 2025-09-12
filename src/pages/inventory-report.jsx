import React, { useState } from 'react';
import { FiCalendar, FiDownload, FiFilter, FiAlertTriangle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const InventoryReport = () => {
  const [dateRange, setDateRange] = useState('month');
  
  // Dummy data for inventory metrics
  const inventoryMetrics = [
    { metric: 'Total Products', value: '3,245', change: '+5.2%', changeType: 'positive' },
    { metric: 'Out of Stock', value: '78', change: '-12.5%', changeType: 'positive' },
    { metric: 'Low Stock', value: '124', change: '+8.7%', changeType: 'negative' },
    { metric: 'Inventory Value', value: '₹24.5M', change: '+3.8%', changeType: 'positive' },
  ];
  
  // Dummy data for inventory by category
  const inventoryByCategory = [
    { name: 'Electronics', count: 950, value: 8500000 },
    { name: 'Clothing', count: 875, value: 5200000 },
    { name: 'Home & Kitchen', count: 625, value: 4100000 },
    { name: 'Books', count: 420, value: 2800000 },
    { name: 'Beauty', count: 375, value: 3900000 },
  ];
  
  // Dummy data for stock levels over time
  const stockLevelTrend = [
    { name: 'Jan', inStock: 2800, lowStock: 120, outOfStock: 80 },
    { name: 'Feb', inStock: 2900, lowStock: 110, outOfStock: 90 },
    { name: 'Mar', inStock: 3100, lowStock: 105, outOfStock: 95 },
    { name: 'Apr', inStock: 3000, lowStock: 115, outOfStock: 85 },
    { name: 'May', inStock: 3200, lowStock: 130, outOfStock: 70 },
    { name: 'Jun', inStock: 3300, lowStock: 125, outOfStock: 75 },
  ];
  
  // Dummy data for low stock items
  const lowStockItems = [
    { id: 1, name: 'iPhone 13 Pro Max (256GB)', sku: 'IP-13PM-256', category: 'Electronics', inStock: 8, threshold: 10, status: 'Low Stock' },
    { id: 2, name: 'Samsung Galaxy S22 Ultra', sku: 'SG-S22U-512', category: 'Electronics', inStock: 5, threshold: 15, status: 'Low Stock' },
    { id: 3, name: 'Nike Air Max 270', sku: 'NKE-AM270-42', category: 'Footwear', inStock: 7, threshold: 20, status: 'Low Stock' },
    { id: 4, name: 'Sony WH-1000XM4 Headphones', sku: 'SNY-WH1000XM4', category: 'Electronics', inStock: 0, threshold: 12, status: 'Out of Stock' },
    { id: 5, name: 'Apple Watch Series 7', sku: 'AW-S7-41MM', category: 'Electronics', inStock: 4, threshold: 10, status: 'Low Stock' },
  ];
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Inventory Report</h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FiCalendar size={14} />
              </div>
            </div>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm hover:bg-gray-50">
              <FiFilter className="mr-2" size={14} />
              Filter
            </button>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm hover:bg-gray-50">
              <FiDownload className="mr-2" size={14} />
              Export
            </button>
          </div>
        </div>
        
        {/* Inventory Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {inventoryMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-500 mb-1">{metric.metric}</div>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-semibold text-gray-800">{metric.value}</div>
                <div className={`text-sm ${metric.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Inventory Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Inventory Levels Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stockLevelTrend}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="inStock" name="In Stock" stroke="#82ca9d" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="lowStock" name="Low Stock" stroke="#ffc658" />
                <Line type="monotone" dataKey="outOfStock" name="Out of Stock" stroke="#ff8042" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Inventory by Category Chart */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Inventory by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inventoryByCategory}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="count" name="Product Count" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="value" name="Inventory Value (₹)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Low Stock Alert Table */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-4">
            <FiAlertTriangle className="text-amber-500 mr-2" size={20} />
            <h2 className="text-lg font-medium text-gray-800">Low Stock Alerts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    In Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Threshold
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.inStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.threshold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Out of Stock' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport; 
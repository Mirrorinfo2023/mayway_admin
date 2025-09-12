import React, { useState } from 'react';
import { FiCalendar, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesReport = () => {
  const [dateRange, setDateRange] = useState('month');
  
  // Dummy data for sales report
  const salesData = [
    { name: 'Jan', sales: 4000, revenue: 240000 },
    { name: 'Feb', sales: 3000, revenue: 190000 },
    { name: 'Mar', sales: 5000, revenue: 280000 },
    { name: 'Apr', sales: 2780, revenue: 170000 },
    { name: 'May', sales: 1890, revenue: 120000 },
    { name: 'Jun', sales: 2390, revenue: 150000 },
    { name: 'Jul', sales: 3490, revenue: 210000 },
  ];
  
  const overviewStats = [
    { label: 'Total Sales', value: '₹1,360,000', change: '+12.5%', changeType: 'positive' },
    { label: 'Orders', value: '22,610', change: '+8.2%', changeType: 'positive' },
    { label: 'Average Order Value', value: '₹6,015', change: '+4.3%', changeType: 'positive' },
    { label: 'Conversion Rate', value: '3.8%', change: '-0.5%', changeType: 'negative' },
  ];
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sales Report</h1>
          
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
              <FiRefreshCw className="mr-2" size={14} />
              Refresh
            </button>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm hover:bg-gray-50">
              <FiDownload className="mr-2" size={14} />
              Export
            </button>
          </div>
        </div>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {overviewStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-semibold text-gray-800">{stat.value}</div>
                <div className={`text-sm ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Sales Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
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
                <Bar yAxisId="left" dataKey="sales" name="Number of Sales" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue (₹)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SalesReport; 
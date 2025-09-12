import React, { useState } from 'react';
import { FiCalendar, FiDownload, FiChevronDown, FiSearch } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CustomerReport = () => {
  const [dateRange, setDateRange] = useState('month');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Dummy data for customer segments
  const customerSegments = [
    { name: 'New', value: 30, color: '#8884d8' },
    { name: 'Returning', value: 45, color: '#82ca9d' },
    { name: 'Loyal', value: 25, color: '#ffc658' },
  ];
  
  // Dummy data for customer demographics
  const customerDemographics = [
    { name: '18-24', value: 15, color: '#0088FE' },
    { name: '25-34', value: 35, color: '#00C49F' },
    { name: '35-44', value: 25, color: '#FFBB28' },
    { name: '45-54', value: 15, color: '#FF8042' },
    { name: '55+', value: 10, color: '#8884d8' },
  ];
  
  // Dummy data for customer metrics
  const customerMetrics = [
    { metric: 'Total Customers', value: '12,450', change: '+8.5%', changeType: 'positive' },
    { metric: 'New Customers', value: '3,725', change: '+12.3%', changeType: 'positive' },
    { metric: 'Customer Retention', value: '76%', change: '-2.1%', changeType: 'negative' },
    { metric: 'Average Customer Value', value: '₹15,280', change: '+5.4%', changeType: 'positive' },
  ];
  
  // Dummy data for top customers
  const topCustomers = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', orders: 24, spent: '₹58,720', lastPurchase: '2 days ago' },
    { id: 2, name: 'Priya Patel', email: 'priya.p@example.com', orders: 18, spent: '₹42,350', lastPurchase: '1 week ago' },
    { id: 3, name: 'Amit Kumar', email: 'amit.k@example.com', orders: 15, spent: '₹36,900', lastPurchase: '3 days ago' },
    { id: 4, name: 'Sneha Reddy', email: 'sneha.r@example.com', orders: 12, spent: '₹28,500', lastPurchase: '5 days ago' },
    { id: 5, name: 'Vikram Singh', email: 'vikram.s@example.com', orders: 10, spent: '₹24,800', lastPurchase: '2 weeks ago' },
  ];
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Customer Report</h1>
          
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
            
            <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm hover:bg-gray-50"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <span>Filters</span>
              <FiChevronDown className="ml-2" size={14} />
            </button>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm hover:bg-gray-50">
              <FiDownload className="mr-2" size={14} />
              Export
            </button>
          </div>
        </div>
        
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {customerMetrics.map((metric, index) => (
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
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Segments */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Customer Segments</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerSegments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Customer Demographics */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Age Demographics</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerDemographics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerDemographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Top Customers Table */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Top Customers</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" size={14} />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Purchase
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.spent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.lastPurchase}
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

export default CustomerReport; 
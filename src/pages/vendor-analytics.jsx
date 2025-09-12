import React from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts';
import * as XLSX from 'xlsx';

const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

// 🔹 Static Vendor Data
const staticVendors = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '9876543210',
    company: 'RK Enterprises',
    address: 'Mumbai, Maharashtra',
  },
  {
    id: 2,
    name: 'Anita Sharma',
    email: 'anita.sharma@example.com',
    phone: '9823456789',
    company: 'Anita Textiles',
    address: 'Delhi, India',
  },
  {
    id: 3,
    name: 'Mohammed Ali',
    email: 'mohammed.ali@example.com',
    phone: '9812345678',
    company: 'Ali Wholesale',
    address: 'Hyderabad, Telangana',
  },
  {
    id: 4,
    name: 'Sunita Verma',
    email: 'sunita.verma@example.com',
    phone: '9811122233',
    company: 'Anita Textiles',
    address: 'Delhi, India',
  },
  {
    id: 5,
    name: 'Karan Patel',
    email: 'karan.patel@example.com',
    phone: '9814455667',
    company: 'RK Enterprises',
    address: 'Mumbai, Maharashtra',
  },
];

// 🔹 Mocked Monthly Signup Trend
const signupsPerMonth = [
  { month: 'Jan', count: 2 },
  { month: 'Feb', count: 1 },
  { month: 'Mar', count: 3 },
  { month: 'Apr', count: 0 },
  { month: 'May', count: 2 },
  { month: 'Jun', count: 1 },
];

const VendorAnalytics = () => {
  const vendors = staticVendors;

  // 📊 Total vendors
  const totalVendors = vendors.length;

  // 📊 Vendors by city
  const cityCount = vendors.reduce((acc, vendor) => {
    const city = vendor.address?.split(',')[0].trim();
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  const cityChartData = Object.entries(cityCount).map(([city, count]) => ({
    name: city,
    value: count,
  }));

  // 📊 Vendors by company
  const companyCount = vendors.reduce((acc, vendor) => {
    acc[vendor.company] = (acc[vendor.company] || 0) + 1;
    return acc;
  }, {});
  const companyChartData = Object.entries(companyCount).map(([company, count]) => ({
    name: company,
    count,
  }));

  const exportAnalytics = () => {
    const worksheet = XLSX.utils.json_to_sheet(vendors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendors');
    XLSX.writeFile(workbook, 'VendorAnalytics.xlsx');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-700">Vendor Analytics</h2>
        <button
          onClick={exportAnalytics}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export to Excel
        </button>
      </div>

      {/* Total Count */}
      <div className="bg-white p-4 rounded shadow text-lg font-semibold text-blue-900">
        Total Vendors: {totalVendors}
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
          <h4 className="text-blue-700 font-semibold">Top City</h4>
          <p className="text-lg font-bold">{cityChartData[0]?.name || 'N/A'}</p>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
          <h4 className="text-blue-700 font-semibold">Top Company</h4>
          <p className="text-lg font-bold">{companyChartData[0]?.name || 'N/A'}</p>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
          <h4 className="text-blue-700 font-semibold">Cities Covered</h4>
          <p className="text-lg font-bold">{cityChartData.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart by City */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-blue-700 font-semibold mb-2">Vendors by City</h3>
          <PieChart width={300} height={250}>
            <Pie
              data={cityChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {cityChartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Bar Chart by Company */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-blue-700 font-semibold mb-2">Vendors by Company</h3>
          <BarChart width={400} height={250} data={companyChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </div>
      </div>

      {/* Line Chart for Signups */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-blue-700 font-semibold mb-2">Monthly Signups</h3>
        <LineChart width={600} height={250} data={signupsPerMonth}>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#1e40af" strokeWidth={2} />
        </LineChart>
      </div>

      {/* Recent Vendors */}
      <div className="bg-white p-4 rounded shadow mt-6">
        <h3 className="text-blue-700 font-semibold mb-2">Recent Vendors</h3>
        <ul className="text-sm text-gray-700 divide-y">
          {vendors.slice(-5).reverse().map((vendor, i) => (
            <li key={i} className="py-2">
              <span className="font-medium text-blue-700">{vendor.name}</span>
              <span className="ml-2 text-gray-500">({vendor.company})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VendorAnalytics;

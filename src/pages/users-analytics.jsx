import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Download, RefreshCw, Users, UserCheck, UserPlus, TrendingUp,
  Calendar, ChevronDown, Smartphone, Laptop, Monitor, Server,
  MapPin, Filter, Search
} from 'lucide-react';

const UserAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  // Mock data for analytics
  const analyticsData = {
    totalUsers: 12785,
    activeUsers: 8426,
    newUsers: 436,
    churnedUsers: 128,
    totalUsersGrowth: 12.4,
    retentionRate: 94.2,
    deviceDistribution: [
      { name: 'Mobile', value: 68 },
      { name: 'Desktop', value: 27 },
      { name: 'Tablet', value: 5 }
    ],
    userActivity: [
      { day: 'Mon', users: 4200 },
      { day: 'Tue', users: 4300 },
      { day: 'Wed', users: 4800 },
      { day: 'Thu', users: 4600 },
      { day: 'Fri', users: 5100 },
      { day: 'Sat', users: 5400 },
      { day: 'Sun', users: 4900 }
    ],
    growthByMonth: [
      { month: 'Jan', users: 8500, newUsers: 950 },
      { month: 'Feb', users: 9200, newUsers: 890 },
      { month: 'Mar', users: 9800, newUsers: 760 },
      { month: 'Apr', users: 10300, newUsers: 810 },
      { month: 'May', users: 11100, newUsers: 920 },
      { month: 'Jun', users: 11800, newUsers: 850 },
      { month: 'Jul', users: 12300, newUsers: 780 },
      { month: 'Aug', users: 12785, newUsers: 436 }
    ],
    retentionData: [
      { week: 'W1', rate: 100 },
      { week: 'W2', rate: 86 },
      { week: 'W3', rate: 78 },
      { week: 'W4', rate: 72 },
      { week: 'W5', rate: 68 },
      { week: 'W6', rate: 65 },
      { week: 'W7', rate: 62 },
      { week: 'W8', rate: 60 }
    ],
    topLocations: [
      { country: 'Panipat', users: 3850 },
      { country: 'Delhi', users: 3735 },
      { country: 'Gurugram', users: 2624 },
      { country: 'Noida', users: 1985 },
      { country: 'Hisar', users: 1742 },
      { country: 'Jaipur', users: 1450 },
      { country: 'Dehradun', users: 1120 },
      { country: 'Bhopal', users: 920 },
      { country: 'Ludhiana', users: 792 }
    ]
  };

  // Colors for charts
  const COLORS = ['#4f46e5', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6'];
  const DEVICE_COLORS = ['#4f46e5', '#60a5fa', '#93c5fd'];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  const handleDownload = (format) => {
    // Placeholder for download functionality
    console.log(`Downloading report in ${format} format`);
  };

  const formatNumber = (num) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
  };

  useEffect(() => {
    // Simulate initial data loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor user growth, engagement, and trends</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Calendar className="h-4 w-4" />
                {timeRange === '7d' ? 'Last 7 days' : 
                 timeRange === '30d' ? 'Last 30 days' : 
                 timeRange === '90d' ? 'Last 90 days' : 'Custom range'}
                <ChevronDown className="h-4 w-4" />
              </button>
              {showTimeDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 py-1">
                  <button 
                    onClick={() => { setTimeRange('7d'); setShowTimeDropdown(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Last 7 days
                  </button>
                  <button 
                    onClick={() => { setTimeRange('30d'); setShowTimeDropdown(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Last 30 days
                  </button>
                  <button 
                    onClick={() => { setTimeRange('90d'); setShowTimeDropdown(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Last 90 days
                  </button>
                </div>
              )}
            </div>
            <div className="relative group">
              <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Download className="h-4 w-4" />
                Download
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 py-1 hidden group-hover:block">
                <button 
                  onClick={() => handleDownload('pdf')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  PDF Report
                </button>
                <button 
                  onClick={() => handleDownload('xlsx')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Excel Report
                </button>
                <button 
                  onClick={() => handleDownload('csv')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  CSV Export
                </button>
              </div>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Key metrics section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{analyticsData.totalUsers.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <TrendingUp className="h-4 w-4" />
              <span>+{analyticsData.totalUsersGrowth}%</span>
            </div>
            <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">from last month</p>
          </div>
        </div>
        
        {/* Active Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{analyticsData.activeUsers.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">{Math.round((analyticsData.activeUsers / analyticsData.totalUsers) * 100)}%</span> of total users
            </p>
          </div>
        </div>
        
        {/* New Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New Users</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{analyticsData.newUsers.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">This month</p>
          </div>
        </div>
        
        {/* Retention Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Retention Rate</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{analyticsData.retentionRate}%</h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsData.growthByMonth}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={formatNumber} />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), '']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '0.5rem', borderColor: '#e5e7eb' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Total Users"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.2}
                  activeDot={{ r: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="newUsers"
                  name="New Users"
                  stroke="#60a5fa"
                  fill="#60a5fa"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Active Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Active Users</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.userActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={formatNumber} />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), 'Users']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '0.5rem', borderColor: '#e5e7eb' }}
                />
                <Bar 
                  dataKey="users" 
                  name="Active Users" 
                  fill="#4f46e5" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Retention */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Retention</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.retentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Retention Rate']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '0.5rem', borderColor: '#e5e7eb' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  name="Retention Rate" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#4f46e5' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.deviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.deviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '0.5rem', borderColor: '#e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Mobile</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Desktop</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-200 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Tablet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Locations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Top User Locations in India</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Our platform has strong penetration in Northern India, with Panipat, Delhi, and Gurugram leading in user counts. We're seeing steady growth in cities like Hisar, Jaipur, and Dehradun, while Bhopal provides a strong presence in Central India.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {analyticsData.topLocations.map((location, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{location.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {location.users.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${(location.users / analyticsData.topLocations[0].users) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics; 
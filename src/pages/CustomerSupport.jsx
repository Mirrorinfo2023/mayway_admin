import React from "react";
import { MessageSquare, Users, RefreshCw, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/animations.css";

const CustomerSupport = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Support</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage customer inquiries and support tickets</p>
          </div>
          <Link to="/live-chat" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <MessageCircle className="h-4 w-4" />
            Live Chat
          </Link>
        </div>

        {/* Support Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
            <div className="text-sm text-blue-600 dark:text-blue-400">Open Tickets</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-500 mt-1">24</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg">
            <div className="text-sm text-amber-600 dark:text-amber-400">Pending Response</div>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-500 mt-1">8</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <div className="text-sm text-green-600 dark:text-green-400">Resolved This Week</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-500 mt-1">42</div>
          </div>
        </div>
        
        {/* Live Chat Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold mb-2">Live Chat Support Now Available!</h2>
              <p className="text-blue-100 max-w-md">
                Connect with your customers in real-time with our new WhatsApp-like chat interface.
                Respond to queries instantly and improve customer satisfaction.
              </p>
            </div>
            <Link 
              to="/live-chat" 
              className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Try Live Chat
            </Link>
          </div>
        </div>
        
        {/* Recent Tickets */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Support Tickets</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    #TKT-5432
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    John Doe
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Order delivery delayed
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    2 hours ago
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <Link to="/live-chat" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm">
                      Chat Now
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    #TKT-5431
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Sarah Johnson
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Product defective on arrival
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
                      Urgent
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    3 hours ago
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <Link to="/live-chat" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm">
                      Chat Now
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    #TKT-5430
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Robert Williams
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Refund request for order #5582
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                      Resolved
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Yesterday
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <Link to="/live-chat" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm">
                      Chat Now
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              View All Tickets
            </button>
            <Link 
              to="/live-chat" 
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Go to Live Chat
            </Link>
          </div>
        </div>
      </div>

      {/* Features Coming Soon Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">More Features Coming Soon</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <RefreshCw className="h-6 w-6 text-purple-500 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Ticket Lifecycle Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track tickets from creation to resolution with automated workflows.</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Users className="h-6 w-6 text-green-500 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Customer Feedback Tools</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Collect and analyze customer satisfaction and feedback.</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <MessageSquare className="h-6 w-6 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Knowledge Base Integration</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Connect support with your knowledge base for faster resolution.</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Live Chat is already available! Try it now to communicate with your customers in real-time.</p>
          <Link 
            to="/live-chat" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Access Live Chat
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport; 
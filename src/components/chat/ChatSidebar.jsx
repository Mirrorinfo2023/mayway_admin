import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  MessagesSquare,
  ArrowDownUp,
  Users
} from 'lucide-react';
import { format } from 'date-fns';

const ChatSidebar = ({ users, selectedUser, onSelectUser, unreadCounts = {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.lastMessage && user.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Update filtered users when the users prop changes
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const getRelativeTime = (timeString) => {
    if (!timeString) return '';
    
    // If it's an ISO date string
    if (timeString.includes('T') || timeString.includes('-')) {
      try {
        const date = new Date(timeString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        if (diffInHours < 48) return 'yesterday';
        
        return format(date, 'MMM d');
      } catch (e) {
        return timeString;
      }
    }
    
    // If it's already a formatted string like "5m ago"
    return timeString;
  };

  // Truncate text to a certain length with ellipsis
  const truncateText = (text, maxLength = 35) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="w-full md:w-80 border-r dark:border-gray-700 flex flex-col h-[calc(100vh-9rem)] bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg text-gray-800 dark:text-white">Chats</h2>
          <div className="flex space-x-1">
            <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <Users size={18} />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <MessagesSquare size={18} />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="pl-3 pr-2">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              className="py-2 w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="p-1.5 mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={18} />
            </button>
          </div>
          
          {/* Filter dropdown */}
          {filterOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10 border dark:border-gray-700">
              <div className="p-2">
                <div className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">Sort by</div>
                <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <ArrowDownUp size={16} />
                  Newest first
                </button>
                <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <ArrowDownUp size={16} />
                  Oldest first
                </button>
                <div className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white mt-1">Filter by</div>
                <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Users size={16} />
                  Unread only
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No conversations found
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center px-3 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b dark:border-gray-700 ${
                selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="relative">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                    <span className="text-blue-600 dark:text-blue-300 font-medium text-lg">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                )}
                {user.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">{user.name}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-1">
                    {user.lastMessage ? getRelativeTime(user.lastMessage.time) : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-[160px]">
                    {truncateText(user.lastMessage ? user.lastMessage.text : 'No messages yet')}
                  </p>
                  {unreadCounts[user.id] ? (
                    <span className="bg-blue-500 text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1 ml-1">
                      {unreadCounts[user.id]}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Active conversations counter */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <span className="mr-1">Active conversations:</span>
          <span className="font-medium text-gray-900 dark:text-white">{users.filter(u => u.online).length}</span>
          <span className="mx-1">of</span>
          <span className="font-medium text-gray-900 dark:text-white">{users.length}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar; 
// import React, { useState, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { MessageSquare, RefreshCw, Search, Plus, User, Users, Settings } from "lucide-react";
// import ChatSidebar from "../components/chat/ChatSidebar";
// import ChatWindow from "../components/chat/ChatWindow";
// import socketService from "../services/socketService";
// import { selectCurrentUser } from "../redux/slices/authSlice";
// import "../styles/animations.css";

// const LiveChat = () => {
//   const dispatch = useDispatch();
//   const currentUser = useSelector(selectCurrentUser);
  
//   const [socket, setSocket] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const [activeTab, setActiveTab] = useState("all"); // all, unread, resolved
//   const [chatFilter, setChatFilter] = useState("");

//   // Initialize socket and load users
//   useEffect(() => {
//     setIsLoading(true);
    
//     // Initialize socket connection
//     const socket = socketService.initializeSocket();
//     setSocket(socket);
    
//     // Load initial chat data
//     loadChatData();
    
//     // Clean up socket on unmount
//     return () => {
//       socketService.disconnectSocket();
//     };
//   }, []);

//   // Load mock chat data
//   const loadChatData = useCallback(() => {
//     // Simulate API call to get user list
//     setTimeout(() => {
//       const mockUsers = [
//         {
//           id: 1,
//           name: "John Doe",
//           online: true,
//           avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//           lastMessage: {
//             text: "I don't received my order...",
//             time: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
//           },
//         },
//         {
//           id: 2,
//           name: "Sarah Johnson",
//           online: true,
//           avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//           lastMessage: {
//             text: "When will my order be delivered?",
//             time: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
//           },
//         },
//         {
//           id: 3,
//           name: "Robert Williams",
//           online: false,
//           avatar: "https://randomuser.me/api/portraits/men/46.jpg",
//           lastMessage: {
//             text: "Thanks for your help with my return request.",
//             time: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
//           },
//         },
//         {
//           id: 4,
//           name: "Amy Garcia",
//           online: true,
//           avatar: "https://randomuser.me/api/portraits/women/65.jpg",
//           lastMessage: {
//             text: "I'd like to change my delivery address for order #ORD-98765",
//             time: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
//           },
//         },
//         {
//           id: 5,
//           name: "Michael Brown",
//           online: false,
//           avatar: "https://randomuser.me/api/portraits/men/81.jpg",
//           lastMessage: {
//             text: "Is the blue variant of Product XYZ in stock?",
//             time: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
//           },
//         },
//       ];
      
//       setUsers(mockUsers);
      
//       // Set some unread counts for demo
//       setUnreadCounts({
//         1: 3,
//         2: 1,
//       });
      
//       setIsLoading(false);
//     }, 1000);
//   }, []);

//   // Handle selecting a user to chat with
//   const handleSelectUser = (user) => {
//     setSelectedUser(user);
    
//     // Join chat room for the selected user
//     if (socket) {
//       socketService.joinChatRoom(`chat_${user.id}`);
//     }
    
//     // Clear unread count for the selected user
//     if (unreadCounts[user.id]) {
//       handleMarkAsRead(user.id);
//     }
//   };

//   // Handle sending a message
//   const handleSendMessage = (message, userId) => {
//     // Update the last message for the user
//     setUsers(prevUsers => 
//       prevUsers.map(user => 
//         user.id === userId 
//           ? {
//               ...user,
//               lastMessage: {
//                 text: message.text,
//                 time: message.timestamp
//               }
//             }
//           : user
//       )
//     );
    
//     // In a real app, we would send this to the server
//     if (socket) {
//       socketService.sendMessage(message, `chat_${userId}`);
//     }
//   };

//   // Handle marking messages as read
//   const handleMarkAsRead = (userId) => {
//     setUnreadCounts(prev => {
//       const updated = { ...prev };
//       delete updated[userId];
//       return updated;
//     });
//   };

//   // Handle user typing indication
//   const handleUserTyping = (userId) => {
//     if (socket) {
//       socketService.sendTypingIndicator(`chat_${userId}`);
//     }
//   };

//   // Filter users based on active tab
//   const filteredUsers = users.filter(user => {
//     if (activeTab === "unread") {
//       return unreadCounts[user.id];
//     } else if (activeTab === "resolved") {
//       // In a real app, this would filter by resolved status
//       return false;
//     }
//     return true;
//   });

//   return (
//     <div className="animate-fadeIn">
//       {/* Header Section */}
//       <div className="mb-4">
//         <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Chat</h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-1">Connect with your customers in real-time</p>
//           </div>
          
//           <div className="flex gap-3">
//             <button 
//               className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//               onClick={loadChatData}
//             >
//               <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
//               {isLoading ? 'Refreshing...' : 'Refresh'}
//             </button>
            
//             <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//               <Plus className="h-4 w-4" />
//               New Chat
//             </button>
//           </div>
//         </div>
        
//         {/* Tabs for filtering chats */}
//         <div className="flex border-b dark:border-gray-700 mb-4">
//           <button
//             className={`px-4 py-2 font-medium text-sm ${
//               activeTab === "all"
//                 ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
//                 : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
//             }`}
//             onClick={() => setActiveTab("all")}
//           >
//             All Chats
//           </button>
//           <button
//             className={`px-4 py-2 font-medium text-sm ${
//               activeTab === "unread"
//                 ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
//                 : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
//             }`}
//             onClick={() => setActiveTab("unread")}
//           >
//             Unread
//             {Object.keys(unreadCounts).length > 0 && (
//               <span className="ml-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 text-xs rounded-full px-2 py-0.5">
//                 {Object.keys(unreadCounts).length}
//               </span>
//             )}
//           </button>
//           <button
//             className={`px-4 py-2 font-medium text-sm ${
//               activeTab === "resolved"
//                 ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
//                 : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
//             }`}
//             onClick={() => setActiveTab("resolved")}
//           >
//             Resolved
//           </button>
//         </div>
//       </div>

//       {/* Main Chat Interface */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col md:flex-row h-[calc(100vh-15rem)]">
//         {isLoading ? (
//           <div className="w-full flex items-center justify-center p-8">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//               <p className="text-gray-600 dark:text-gray-400">Loading chat data...</p>
//             </div>
//           </div>
//         ) : (
//           <>
//             <ChatSidebar
//               users={filteredUsers}
//               selectedUser={selectedUser}
//               onSelectUser={handleSelectUser}
//               unreadCounts={unreadCounts}
//             />
//             {selectedUser ? (
//               <div className="flex-1">
//                 <ChatWindow 
//                   selectedUser={selectedUser} 
//                   socket={socket}
//                   onSendMessage={handleSendMessage}
//                   onMarkAsRead={handleMarkAsRead}
//                   onUserTyping={handleUserTyping}
//                 />
//               </div>
//             ) : (
//               <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
//                 <div className="text-center p-8">
//                   <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
//                   <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Select a conversation</h3>
//                   <p className="max-w-md">
//                     Choose a chat from the sidebar to start messaging
//                   </p>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Stats Cards */}
//       {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
//         <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
//           <div className="p-4 text-center">
//             <div className="flex items-center justify-center mb-1">
//               <span className="text-gray-500 dark:text-gray-400 text-sm mr-2">Active Conversations</span>
//               <Users className="h-5 w-5 text-blue-500" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
//             <p className="text-xs text-gray-600 dark:text-gray-400">Out of 5 total</p>
//           </div>
          
//           <div className="p-4 text-center">
//             <div className="flex items-center justify-center mb-1">
//               <span className="text-gray-500 dark:text-gray-400 text-sm mr-2">Response Time</span>
//               <MessageSquare className="h-5 w-5 text-green-500" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900 dark:text-white">5.2 min</p>
//             <p className="text-xs text-gray-600 dark:text-gray-400">Average first response</p>
//           </div>
          
//           <div className="p-4 text-center">
//             <div className="flex items-center justify-center mb-1">
//               <span className="text-gray-500 dark:text-gray-400 text-sm mr-2">Resolution Rate</span>
//               <Settings className="h-5 w-5 text-purple-500" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900 dark:text-white">92%</p>
//             <p className="text-xs text-gray-600 dark:text-gray-400">Issues resolved successfully</p>
//           </div>
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default LiveChat; 
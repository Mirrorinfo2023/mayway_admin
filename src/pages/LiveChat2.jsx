// import React, { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import { FaPaperPlane, FaSmile, FaPaperclip, FaUserCircle } from "react-icons/fa";
// import { FiTrash2, FiLogOut } from "react-icons/fi";

// const socket = io("https://ecom-backend.plusdistribution.in/");

// const ChatApp = () => {
//   const messagesEndRef = useRef(null);
//   const [name, setName] = useState(() => localStorage.getItem("chatUserName") || "");
//   const [joined, setJoined] = useState(() => {
//     const savedJoinState = localStorage.getItem("chatJoined");
//     return savedJoinState ? JSON.parse(savedJoinState) : false;
//   });
//   const [messages, setMessages] = useState(() => {
//     try {
//       const savedMessages = localStorage.getItem("chatMessages");
//       if (savedMessages) {
//         // Filter out invalid messages
//         const parsedMessages = JSON.parse(savedMessages);
//         return parsedMessages.filter(msg => msg && msg.text && msg.sender);
//       }
//     } catch (error) {
//       console.error("Error loading messages:", error);
//     }
//     return [];
//   });
//   const [message, setMessage] = useState("");
//   const [typing, setTyping] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   let typingTimeout = null;

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, typing]);

//   // Clear any existing messages that might be causing issues
//   useEffect(() => {
//     // Filter out invalid messages from current state
//     const validMessages = messages.filter(msg => msg && msg.text && msg.sender);
    
//     if (validMessages.length !== messages.length) {
//       setMessages(validMessages);
//       localStorage.setItem("chatMessages", JSON.stringify(validMessages));
//     }
//   }, []);

//   useEffect(() => {
//     // If user was previously joined, reconnect automatically
//     if (joined && name) {
//       socket.emit("newuser", name);
//     }

//     socket.on("group", (data) => {
//       // Validate incoming message
//       if (!data || !data.text) return;
      
//       setMessages((prev) => {
//         // Ensure the message has a timestamp and required fields
//         const messageWithTimestamp = {
//           ...data,
//           text: data.text || "",
//           sender: data.sender || "unknown",
//           timestamp: data.timestamp || new Date().toISOString()
//         };
        
//         // Only add valid messages
//         if (!messageWithTimestamp.text) return prev;
        
//         const newMessages = [...prev, messageWithTimestamp];
//         localStorage.setItem("chatMessages", JSON.stringify(newMessages));
//         return newMessages;
//       });
//     });

//     socket.on("typing", (status) => {
//       setTyping(status);
//     });

//     return () => {
//       socket.off("group");
//       socket.off("typing");
//     };
//   }, [joined, name]);

//   // Save joined state when it changes
//   useEffect(() => {
//     localStorage.setItem("chatJoined", JSON.stringify(joined));
//   }, [joined]);

//   const joinChat = () => {
//     if (name.trim()) {
//       localStorage.setItem("chatUserName", name);
//       socket.emit("newuser", name);
//       setJoined(true);
//     }
//   };

//   const sendMessage = () => {
//     if (message.trim()) {
//       const msgData = { 
//         text: message.trim(), 
//         sender: name,
//         timestamp: new Date().toISOString()
//       };
//       socket.emit("message", msgData);
//       setMessage("");
//       setIsTyping(false);
//       socket.emit("typing", false);
//     }
//   };

//   // Format time from ISO string
//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) return "";
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch (e) {
//       return "";
//     }
//   };

//   const handleTyping = (e) => {
//     setMessage(e.target.value);

//     if (!isTyping) {
//       setIsTyping(true);
//       socket.emit("typing", true);
//     }

//     clearTimeout(typingTimeout);
//     typingTimeout = setTimeout(() => {
//       setIsTyping(false);
//       socket.emit("typing", false);
//     }, 2000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const handleClearChat = () => {
//     // Clear messages but stay logged in
//     setMessages([]);
//     localStorage.setItem("chatMessages", JSON.stringify([]));
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("chatUserName");
//     localStorage.removeItem("chatJoined");
//     localStorage.removeItem("chatMessages");
//     setJoined(false);
//     setName("");
//     setMessages([]);
//     socket.emit("disconnect");
//   };

//   // Filter out messages that don't have text
//   const validMessages = messages.filter(msg => msg && msg.text);

//   return (
//     <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//       {!joined ? (
//         <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
//               <FaUserCircle className="text-blue-600 text-3xl" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Live Chat</h2>
//             <p className="text-gray-600">Enter your name to start chatting</p>
//           </div>
//           <div className="space-y-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="Your Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && joinChat()}
//               />
//             </div>
//             <button
//               className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//               onClick={joinChat}
//             >
//               Join Chat
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
//           {/* Chat Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="p-1.5 bg-white bg-opacity-20 rounded-full">
//                 <FaUserCircle className="text-white text-2xl" />
//               </div>
//               <div>
//                 <h2 className="text-white font-semibold text-lg">Live Chat Support</h2>
//                 <p className="text-blue-100 text-sm flex items-center">
//                   <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
//                   Online
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <button 
//                 className="text-white bg-red-500 hover:bg-red-600 transition-colors px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm"
//                 onClick={handleClearChat}
//               >
//                 <FiTrash2 className="text-sm" />
//                 <span className="text-sm font-medium">Clear Chat</span>
//               </button>
//               <button 
//                 className="text-white bg-blue-800 hover:bg-blue-900 transition-colors px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 shadow-sm"
//                 onClick={handleLogout}
//               >
//                 <FiLogOut className="text-sm" />
//                 <span>Exit Chat</span>
//               </button>
//             </div>
//           </div>

//           {/* Chat Messages */}
//           <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
//             {validMessages.length === 0 && (
//               <div className="h-full flex flex-col items-center justify-center text-gray-400">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
//                   <FaPaperPlane className="text-gray-300 text-xl transform -rotate-45" />
//                 </div>
//                 <p>No messages yet</p>
//                 <p className="text-sm">Start a conversation!</p>
//               </div>
//             )}
//             {validMessages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${msg.sender === name ? 'justify-end' : 'justify-start'} mb-4`}
//               >
//                 <div
//                   className={`max-w-[70%] ${
//                     msg.sender === name
//                       ? 'bg-blue-600 text-white rounded-t-2xl rounded-bl-2xl shadow-sm'
//                       : 'bg-gray-100 text-gray-800 rounded-t-2xl rounded-br-2xl shadow-sm'
//                   }`}
//                 >
//                   <div className="px-4 py-2">
//                     <p className="text-[15px] leading-relaxed">{msg.text}</p>
//                   </div>
//                   <div className={`px-4 pb-1 ${msg.sender === name ? 'text-blue-100' : 'text-gray-500'}`}>
//                     <span className="text-xs">
//                       {formatTime(msg.timestamp)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {typing && (
//               <div className="flex justify-start mb-4">
//                 <div className="bg-gray-100 rounded-t-2xl rounded-br-2xl px-4 py-3 shadow-sm">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Chat Input */}
//           <div className="px-6 py-4 bg-white border-t">
//             <div className="flex items-center gap-3">
//               <button className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50">
//                 <FaSmile className="text-xl" />
//               </button>
//               <button className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50">
//                 <FaPaperclip className="text-xl" />
//               </button>
//               <input
//                 type="text"
//                 className="flex-1 py-2.5 px-4 bg-gray-100 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
//                 placeholder="Type a message..."
//                 value={message}
//                 onChange={handleTyping}
//                 onKeyPress={handleKeyPress}
//               />
//               <button
//                 className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
//                 onClick={sendMessage}
//               >
//                 <FaPaperPlane className="text-md" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatApp;
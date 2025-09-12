import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Smile, 
  X, 
  Mic, 
  CheckCheck, 
  Check,
  MoreVertical,
  PhoneCall,
  Video,
  ChevronDown
} from "lucide-react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import '../../styles/emoji-picker.css';

const ChatWindow = ({ 
  selectedUser, 
  socket, 
  onSendMessage, 
  onMarkAsRead, 
  onUserTyping 
}) => {
  const currentUser = useSelector(selectCurrentUser);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const typingIndicatorRef = useRef(null);
  const messageInputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    
    // Mark messages as read when user views them
    if (selectedUser && onMarkAsRead) {
      onMarkAsRead(selectedUser.id);
    }
  }, [chatHistory, selectedUser, onMarkAsRead]);

  // Load chat history for the selected user
  useEffect(() => {
    if (selectedUser) {
      // In a real app, fetch chat history from the backend
      // For now, let's use some dummy data
      const dummyHistory = [
        {
          id: 1,
          text: "Hello! How can I help you today?",
          sender: "admin",
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          status: "read" // read, delivered, sent
        },
        {
          id: 2,
          text: "I have a question about my recent order.",
          sender: "user",
          timestamp: new Date(Date.now() - 3540000).toISOString(), // 59 minutes ago
        },
        {
          id: 3,
          text: "Sure, I'd be happy to help. Could you please share your order number?",
          sender: "admin",
          timestamp: new Date(Date.now() - 3480000).toISOString(), // 58 minutes ago
          status: "read"
        },
        {
          id: 4,
          text: "It's ORD-12345678",
          sender: "user",
          timestamp: new Date(Date.now() - 3420000).toISOString(), // 57 minutes ago
        },
      ];
      
      setChatHistory(dummyHistory);
    }
  }, [selectedUser]);

  // Set up socket listeners
  useEffect(() => {
    if (socket) {
      const messageHandler = (data) => {
        setChatHistory(prev => [...prev, data]);
        
        // If the sender is the selected user, mark as read
        if (data.sender === "user" && onMarkAsRead && selectedUser) {
          onMarkAsRead(selectedUser.id);
        }
      };
      
      const typingHandler = (data) => {
        if (data.userId === selectedUser?.id) {
          setIsUserTyping(true);
          
          // Clear typing indicator after 3 seconds
          setTimeout(() => {
            setIsUserTyping(false);
          }, 3000);
        }
      };
      
      socket.on("message", messageHandler);
      socket.on("user-typing", typingHandler);
      
      return () => {
        socket.off("message", messageHandler);
        socket.off("user-typing", typingHandler);
      };
    }
  }, [socket, selectedUser, onMarkAsRead]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (message.trim() || attachments.length > 0) {
      const newMessage = {
        id: Date.now(),
        text: message.trim(),
        sender: "admin",
        timestamp: new Date().toISOString(),
        attachments: [...attachments],
        status: "sent"
      };
      
      setChatHistory(prev => [...prev, newMessage]);
      
      // Clear message input and attachments
      setMessage("");
      setAttachments([]);
      
      // Close emoji picker
      setIsEmojiPickerOpen(false);
      
      // Send message via socket or callback
      if (onSendMessage) {
        onSendMessage(newMessage, selectedUser.id);
      }
      
      if (socket) {
        socket.emit("send-message", {
          to: selectedUser.id,
          message: newMessage
        });
      }
      
      // Simulate message status updates (in real app this would come from server)
      setTimeout(() => {
        setChatHistory(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
          )
        );
      }, 1000);
      
      setTimeout(() => {
        setChatHistory(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: "read" } : msg
          )
        );
      }, 2000);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Emit typing event
    if (socket && onUserTyping) {
      if (typingTimeout) clearTimeout(typingTimeout);
      
      onUserTyping(selectedUser.id);
      
      const timeout = setTimeout(() => {
        // Typing stopped
      }, 3000);
      
      setTypingTimeout(timeout);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.native);
    messageInputRef.current?.focus();
  };

  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // For images, create previews
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachments(prev => [
            ...prev, 
            { 
              type: 'image', 
              url: e.target.result, 
              name: file.name,
              size: file.size
            }
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        // For other files, just store the file info
        setAttachments(prev => [
          ...prev, 
          { 
            type: 'file', 
            name: file.name, 
            size: file.size,
            extension: file.name.split('.').pop()
          }
        ]);
      }
    });
    
    // Reset the input
    e.target.value = null;
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = () => {
    setIsRecording(true);
    // In a real app, implement actual voice recording logic here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // In a real app, handle the recorded audio and send it
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      return format(new Date(timestamp), 'h:mm a');
    } catch (e) {
      return timestamp;
    }
  };

  const renderMessageStatus = (status) => {
    switch(status) {
      case 'sent':
        return <Check size={16} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={16} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const renderAttachment = (attachment, inMessage = false) => {
    if (attachment.type === 'image') {
      return (
        <div className={`relative ${inMessage ? 'mb-2' : 'mr-2 mb-2'}`}>
          <img 
            src={attachment.url} 
            alt={attachment.name}
            className={`rounded-lg cursor-pointer object-cover ${
              inMessage ? 'max-w-[200px] max-h-[200px]' : 'w-16 h-16'
            }`}
            onClick={() => setExpandedImage(attachment.url)}
          />
          {!inMessage && (
            <button 
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"
              onClick={(e) => {
                e.stopPropagation();
                removeAttachment(attachments.indexOf(attachment));
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      );
    } else if (attachment.type === 'file') {
      return (
        <div className={`flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-2 ${inMessage ? 'mb-2' : 'mr-2 mb-2'}`}>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{attachment.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(attachment.size / 1024).toFixed(1)} KB
            </p>
          </div>
          {!inMessage && (
            <button 
              className="ml-2 text-red-500"
              onClick={() => removeAttachment(attachments.indexOf(attachment))}
            >
              <X size={16} />
            </button>
          )}
        </div>
      );
    }
    
    return null;
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  // Get formatted date header
  const getDateHeader = (dateKey) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
    
    if (dateKey === today) return 'Today';
    if (dateKey === yesterday) return 'Yesterday';
    
    return format(new Date(dateKey), 'MMMM d, yyyy');
  };

  if (!selectedUser) return null;

  // Group messages for display
  const messageGroups = groupMessagesByDate(chatHistory);

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {selectedUser.avatar ? (
              <img 
                src={selectedUser.avatar} 
                alt={selectedUser.name} 
                className="h-10 w-10 rounded-full object-cover" 
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 font-medium">
                  {selectedUser.name[0]}
                </span>
              </div>
            )}
            {selectedUser.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">
              {selectedUser.name}
            </h3>
            <span className="text-xs text-green-500">
              {selectedUser.online ? 'Online' : 'Offline'}
              {isUserTyping && ' • Typing...'}
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <PhoneCall size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Video size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5] dark:bg-gray-900"
      >
        {Object.entries(messageGroups).map(([dateKey, messages]) => (
          <div key={dateKey} className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-white dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 rounded-full px-3 py-1 shadow-sm">
                {getDateHeader(dateKey)}
              </div>
            </div>
            
            {messages.map((msg, index) => {
              // Check if this message is part of a sequence from the same sender
              const prevMsg = index > 0 ? messages[index - 1] : null;
              const isFirstInSequence = !prevMsg || prevMsg.sender !== msg.sender;
              
              return (
                 <div
                   key={msg.id}
                   className={`flex ${
                     msg.sender === "admin" ? "justify-end" : "justify-start"
                   } ${!isFirstInSequence ? 'mt-1' : 'mt-4'}`}
                 >
                   <div
                     className={`max-w-[75%] p-3 ${
                       msg.sender === "admin"
                         ? "bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                         : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-tr-lg rounded-br-lg rounded-bl-lg"
                     } shadow-sm`}
                   >
                     {/* Render attachments if any */}
                     {msg.attachments && msg.attachments.length > 0 && (
                       <div className="mb-1.5">
                         {msg.attachments.map((attachment, index) => (
                           <div key={index}>
                             {renderAttachment(attachment, true)}
                           </div>
                         ))}
                       </div>
                     )}
                     
                     {/* Message text */}
                     {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}
                     
                     {/* Message footer: time and status */}
                     <div className={`flex items-center justify-end mt-0.5 text-xs ${
                       msg.sender === "admin"
                         ? "text-blue-100"
                         : "text-gray-500 dark:text-gray-400"
                     }`}>
                       <span className="opacity-75">
                         {formatTime(msg.timestamp)}
                       </span>
                       {msg.sender === "admin" && msg.status && (
                         <span className="ml-1">{renderMessageStatus(msg.status)}</span>
                       )}
                     </div>
                   </div>
                 </div>
              );
            })}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isUserTyping && (
          <div ref={typingIndicatorRef} className="flex justify-start mt-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full typing-dot mx-1"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full typing-dot"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t dark:border-gray-700 flex flex-wrap bg-white dark:bg-gray-800">
          {attachments.map((attachment, index) => (
            <div key={index}>
              {renderAttachment(attachment)}
            </div>
          ))}
        </div>
      )}

      {/* Chat Input */}
      <form onSubmit={handleSendMessage} className="px-4 py-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              >
                <Smile size={20} />
              </button>
              <input
                ref={messageInputRef}
                type="text"
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 py-2 px-2 bg-transparent focus:outline-none text-gray-800 dark:text-white text-sm"
              />
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => fileInputRef.current.click()}
              >
                <Paperclip size={20} />
              </button>
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileAttachment}
                multiple
              />
            </div>
            
            {/* Emoji picker */}
            {isEmojiPickerOpen && (
              <div className="absolute bottom-12 right-0 z-10 emoji-picker-arrow animate-slideUp">
                <Picker 
                  data={data} 
                  onEmojiSelect={handleEmojiSelect} 
                  theme="light"
                  previewPosition="none"
                  skinTonePosition="none"
                />
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
      
      {/* Image preview modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
              onClick={() => setExpandedImage(null)}
            >
              <X size={24} />
            </button>
            <img 
              src={expandedImage} 
              alt="Expanded view" 
              className="max-h-[90vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow; 
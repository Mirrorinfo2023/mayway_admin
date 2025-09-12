import React, { useState } from 'react';
import { Bell, Send } from 'lucide-react';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Order Shipped',
      message: 'Your order #12345 has been shipped.',
      time: '2 hours ago',
      isRead: false,
    },
    {
      id: 2,
      title: 'New Deal',
      message: 'Flat 30% off on electronics for today only!',
      time: '5 hours ago',
      isRead: true,
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'We’ve received your payment of ₹999.',
      time: '1 day ago',
      isRead: true,
    },
  ]);

  const [form, setForm] = useState({ title: '', message: '' });

  const handleSend = () => {
    if (form.title.trim() === '' || form.message.trim() === '') return;

    const newNotification = {
      id: Date.now(),
      title: form.title,
      message: form.message,
      time: 'Just now',
      isRead: false,
    };

    setNotifications([newNotification, ...notifications]);
    setForm({ title: '', message: '' });
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" /> Admin Notifications
        </h2>
        <button
          onClick={() => setNotifications([])}
          className="text-sm text-red-500 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Form to send notification */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded-md"
        />
        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 p-2 rounded-md"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Send size={16} /> Send Notification
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-gray-500 text-center py-12">No notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`border p-4 rounded-lg shadow-sm ${
                n.isRead ? 'bg-gray-100' : 'bg-blue-50'
              }`}
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{n.title}</h3>
                <span className="text-xs text-gray-500">{n.time}</span>
              </div>
              <p className="text-sm text-gray-700">{n.message}</p>
              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-xs text-blue-500 mt-2 hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationScreen;

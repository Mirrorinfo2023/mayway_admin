import React, { useState } from 'react';
import { Megaphone } from 'lucide-react';

const AnnouncementScreen = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'New Features Released',
      message: 'We’ve added new features to improve your experience.',
      time: 'Today at 10:00 AM',
    },
    {
      id: 2,
      title: 'Scheduled Maintenance',
      message: 'Our app will be down for maintenance on July 28th from 2AM - 4AM.',
      time: 'Yesterday at 8:45 PM',
    },
  ]);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const addAnnouncement = () => {
    if (!title.trim() || !message.trim()) return;

    const newAnnouncement = {
      id: Date.now(),
      title,
      message,
      time: new Date().toLocaleString(),
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Megaphone className="w-6 h-6" />
          Announcements
        </h2>
        <button
          onClick={() => setAnnouncements([])}
          className="text-sm text-red-500 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Form to add announcement */}
      <div className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
          rows={3}
        />
        <button
          onClick={addAnnouncement}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Announcement
        </button>
      </div>

      {/* List of announcements */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-gray-500 text-center py-12">No announcements</div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="border p-4 rounded-lg bg-yellow-50 shadow-sm">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{a.title}</h3>
                <span className="text-xs text-gray-500">{a.time}</span>
              </div>
              <p className="text-sm text-gray-700">{a.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementScreen;

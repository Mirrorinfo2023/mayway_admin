import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BannerSetupPage = () => {
  const navigate = useNavigate(); // 👈 Add this

  const [banners, setBanners] = useState([
    {
      id: 1,
      title: 'Summer Sale',
      image: 'https://via.placeholder.com/100x50',
      status: 'Active',
    },
    {
      id: 2,
      title: 'New Launch',
      image: 'https://via.placeholder.com/100x50',
      status: 'Inactive',
    },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Banner Setup</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => navigate('/promotions/add-banner')} // Updated path
        >
          <Plus size={16} /> Add Banner
        </Button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={banner.id} className="border-t">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{banner.title}</td>
                <td className="px-4 py-3">
                  <img
                    src={banner.image}
                    alt="banner"
                    className="w-28 h-auto rounded-md"
                  />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      banner.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {banner.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="outline" size="icon">
                    <Edit size={16} />
                  </Button>
                  <Button variant="destructive" size="icon">
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannerSetupPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturedDeals = () => {
  const navigate = useNavigate();

  const [deals, setDeals] = useState([
    {
      id: 1,
      title: 'Flat 50% Off',
      image: 'https://via.placeholder.com/100',
      status: 'Active',
    },
    {
      id: 2,
      title: 'Buy 1 Get 1 Free',
      image: 'https://via.placeholder.com/100',
      status: 'Inactive',
    },
  ]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Deals</h2>
        <button
          onClick={() => navigate('/promotions/add-featured-deals')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Deal
        </button>

      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4">Image</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id} className="border-b">
                <td className="py-2 px-4">
                  <img src={deal.image} alt={deal.title} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="py-2 px-4">{deal.title}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-white ${deal.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                  >
                    {deal.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <button className="text-blue-600 hover:underline mr-4">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeaturedDeals;

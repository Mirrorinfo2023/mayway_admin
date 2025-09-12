import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Coupons = () => {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([
    { id: 1, code: 'WELCOME10', discount: '10%', status: 'Active' },
    { id: 2, code: 'SUMMER25', discount: '25%', status: 'Inactive' },
  ]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Coupons</h2>
        <button
          onClick={() => navigate('/promotions/add-coupons')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Coupon
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4">Code</th>
              <th className="py-2 px-4">Discount</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b">
                <td className="py-2 px-4">{coupon.code}</td>
                <td className="py-2 px-4">{coupon.discount}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-white ${coupon.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                  >
                    {coupon.status}
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

export default Coupons;

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const sampleProducts = [
  { id: 1, name: 'Kids Denim Pants', type: 'Physical', price: '$25.00' },
  { id: 2, name: 'Long Sleeve Shirts', type: 'Physical', price: '$40.00' },
  { id: 3, name: 'Bow Jeans Pants', type: 'Physical', price: '$30.00' },
  { id: 4, name: 'Kids Leggings', type: 'Physical', price: '$20.00' },
  { id: 5, name: 'Infant Party Dress', type: 'Physical', price: '$35.00' },
  { id: 6, name: 'Pattern Summer Skirt', type: 'Physical', price: '$40.00' },
  { id: 7, name: 'Pink Blazer Set', type: 'Physical', price: '$80.00' },
  { id: 8, name: 'Romper Jumpsuit', type: 'Physical', price: '$35.00' },
  { id: 9, name: 'Fun Sunglasses', type: 'Physical', price: '$15.00' },
  { id: 10, name: 'Baby Sunglasses', type: 'Physical', price: '$15.00' },
  { id: 11, name: 'Mesh Sports Shoes', type: 'Physical', price: '$40.00' },
  { id: 12, name: 'Bow Loafers', type: 'Physical', price: '$50.00' },
  { id: 13, name: 'Kids Leather Loafer', type: 'Physical', price: '$50.00' },
  { id: 14, name: 'Sport Running Shoe', type: 'Physical', price: '$80.00' },
  { id: 15, name: 'Braided Sandals', type: 'Physical', price: '$30.00' },
  { id: 16, name: 'Girls School Shoes', type: 'Physical', price: '$30.00' },
  { id: 17, name: 'Boys School Shoes', type: 'Physical', price: '$30.00' },
  { id: 18, name: 'Que Cleansing Foam', type: 'Physical', price: '$40.00' },
  { id: 19, name: 'Skin Holy Hydration', type: 'Physical', price: '$35.00' },
  { id: 20, name: 'Japan Sakura Serum', type: 'Physical', price: '$30.00' },
  { id: 21, name: 'Aloevera Face Serum', type: 'Physical', price: '$20.00' },
  { id: 22, name: 'Exfoliating Gel', type: 'Physical', price: '$20.00' },
  { id: 23, name: 'OSIYUN Sunscreen', type: 'Physical', price: '$30.00' },
  { id: 24, name: 'Honey Peach Cream', type: 'Physical', price: '$30.00' },
  { id: 25, name: 'Peel Off Mask', type: 'Physical', price: '$25.00' },
];

export default function VendorProducts() {
  const { vendorId } = useParams();
  const [search, setSearch] = useState('');

  const filteredProducts = sampleProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Vendor {vendorId} Product List</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-2">
        <input type="text" placeholder="Search by Product Name" value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 col-span-2" />
        <select className="border p-2"><option>Brand</option></select>
        <select className="border p-2"><option>Category</option></select>
        <select className="border p-2"><option>Sub Category</option></select>
        <select className="border p-2"><option>Sub Sub Category</option></select>
      </div>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">SL</th>
            <th className="border px-4 py-2">Product Name</th>
            <th className="border px-4 py-2">Product Type</th>
            <th className="border px-4 py-2">Unit price</th>
            <th className="border px-4 py-2">Show as featured</th>
            <th className="border px-4 py-2">Active status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={product.id} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.type}</td>
              <td className="border px-4 py-2">{product.price}</td>
              <td className="border px-4 py-2">✅</td>
              <td className="border px-4 py-2">🟢</td>
              <td className="border px-4 py-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

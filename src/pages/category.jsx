// src/pages/Categories.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronRight,
  MoreVertical,
  FolderPlus
} from 'lucide-react';
import {
  createCategory,
  getAllCategories,
  deleteCategoryById,
  // getCategoryById, // you can wire this into an edit form
} from '../services/Categories';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const resp = await getAllCategories();
        if (resp?.data) setCategories(resp.data);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    })();
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3) Create
  const handleCreate = async () => {
    const name = prompt('Category name:');
    if (!name) return;
    try {
  const payload = { 
  categoryName: name, 
  categoryType: "Main", // or dynamic from form
  isActive: true, 
  icon: iconUrl, // get from form/upload
  subCategories: [
    {
      subCategoryName: subName,
      subCategoryType: "Sub", 
      isActive: true,
      icon: subIconUrl
    }
  ]
};

      const resp = await createCategory(payload);
      setCategories([resp.data, ...categories]);
    } catch (e) {
      console.error('Failed to create category', e);
      alert('Error creating category');
    }
  };

  // 4) Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategoryById(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (e) {
      console.error('Delete failed', e);
      alert('Error deleting');
    }
  };

  // 5) Stub for edit (you’d pop up your edit form here)
  const handleEdit = (cat) => {
    const name = prompt('New name', cat.name);
    if (!name || name === cat.name) return;
    // TODO: call your updateCategory API, then:
    setCategories(categories.map(c => c.id === cat.id ? { ...c, name } : c));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-600">Manage product categories and subcategories</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategories</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.map(category => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.products}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.subcategories}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {category.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-900" title="Add Subcategory">
                      <FolderPlus size={18} />
                    </button>
                    <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-900" title="Edit Category">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900" title="Delete Category">
                      <Trash2 size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600" title="More Options">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;

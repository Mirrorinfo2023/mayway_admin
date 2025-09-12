import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById, selectSelectedProduct, selectProductStatus } from '../redux/slices/productSlice';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const product = useSelector(selectSelectedProduct);
  const status = useSelector(selectProductStatus);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Product not found</p>
        <Link to="/products" className="mt-4 text-blue-600 hover:text-blue-800">
          Back to Products
        </Link>
      </div>
    );
  }

  // Format price to INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link to="/products" className="text-gray-600 hover:text-gray-900">
              <FiArrowLeft size={24} />
            </Link>
            <h1 className="ml-4 text-2xl font-bold text-gray-900">{product.name}</h1>
          </div>
          <Link
            to={`/edit-product/${product.id}`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiEdit className="mr-2" />
            Edit Product
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="aspect-w-1 aspect-h-1 w-full">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {product.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
              
              <div className="space-y-6">
                {/* Description */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Description</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(product.description) ? (
                      product.description.map((desc, index) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {desc}
                        </div>
                      ))
                    ) : (
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {product.description || 'No description available'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Composition */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Composition</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(product.composition) ? (
                      product.composition.map((comp, index) => (
                        <div key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          {comp}
                        </div>
                      ))
                    ) : (
                      <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {product.composition || 'No composition available'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pack Size */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Pack Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(product.packSize) ? (
                      product.packSize.map((size, index) => (
                        <div key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                          {size}
                        </div>
                      ))
                    ) : (
                      <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                        {product.packSize || 'No pack size available'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Storage Instructions */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Storage Instructions</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(product.storageInstructions) ? (
                      product.storageInstructions.map((instruction, index) => (
                        <div key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                          {instruction}
                        </div>
                      ))
                    ) : (
                      <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                        {product.storageInstructions || 'No storage instructions available'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Side Effects */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Side Effects</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(product.sideEffects) ? (
                      product.sideEffects.map((effect, index) => (
                        <div key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                          {effect}
                        </div>
                      ))
                    ) : (
                      product.sideEffects ? 
                        product.sideEffects.split(',').map((effect, index) => (
                          <div key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                            {effect.trim()}
                          </div>
                        )) : (
                          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                            No side effects listed
                          </div>
                        )
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">MRP</h3>
                    <p className="text-gray-900">{formatPrice(product.mrp)}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Selling Price</h3>
                    <p className="text-green-600 font-medium">{formatPrice(product.price)}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Batch Number</h3>
                    <p className="text-gray-900">{product.batchNumber || 'N/A'}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Expiry Date</h3>
                    {/* <p className="text-gray-900">{product.expiryDate ? formatDate(product.expiryDate) : 'N/A'}</p> */}
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Stock</h3>
                    <p className="text-gray-900">{product.stock}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">SKU</h3>
                    <p className="text-gray-900">{product.sku}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                    <p className="text-gray-900">{product.category}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Manufacturer</h3>
                    <p className="text-gray-900">{product.manufacturer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 
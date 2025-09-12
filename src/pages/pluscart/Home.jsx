import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchHomeData,
  selectFlashSale,
  selectCategories,
  selectHealthPromotions,
  selectHealthTips,
  selectFeaturedProducts,
  selectPlusCartStatus
} from '../../redux/slices/plusCartSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const flashSale = useSelector(selectFlashSale);
  const categories = useSelector(selectCategories);
  const healthPromotions = useSelector(selectHealthPromotions);
  const healthTips = useSelector(selectHealthTips);
  const featuredProducts = useSelector(selectFeaturedProducts);
  const status = useSelector(selectPlusCartStatus);

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endTime = new Date(flashSale.endsIn).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [flashSale.endsIn]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="bg-blue-600 rounded-lg p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for medicines..."
            className="w-full px-4 py-2 rounded-lg pl-10 focus:outline-none"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Flash Sale */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Flash Sale</h2>
            <div className="ml-4 flex space-x-2">
              <div className="bg-red-100 text-red-800 px-2 py-1 rounded">
                {String(timeLeft.hours).padStart(2, '0')}h
              </div>
              <div className="bg-red-100 text-red-800 px-2 py-1 rounded">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </div>
              <div className="bg-red-100 text-red-800 px-2 py-1 rounded">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flashSale.products.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
              <h3 className="font-medium text-sm mb-1">{product.name}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-red-600 font-bold">₹{product.salePrice}</span>
                  <span className="text-gray-400 text-sm line-through ml-2">₹{product.originalPrice}</span>
                </div>
                <span className="text-red-600 text-sm">{product.discount}% off</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{product.stockLeft} left</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-4 gap-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/category/${category.slug}`)}
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm text-center">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Promotions */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Health Promotions</h2>
          <button className="text-blue-600 text-sm">View All &gt;</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthPromotions.map(promotion => (
            <div key={promotion.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold mb-1">{promotion.title}</h3>
                  <p className="text-sm text-gray-600">{promotion.description}</p>
                  <div className="mt-2">
                    <span className="text-green-600 font-medium">{promotion.discount}% OFF</span>
                    {promotion.tag && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {promotion.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Tips */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Health Tips</h2>
        <div className="grid grid-cols-2 gap-4">
          {healthTips.map(tip => (
            <div key={tip.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{tip.icon}</span>
                <div>
                  <h3 className="font-medium">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured Products</h2>
          <button className="text-blue-600 text-sm">View All &gt;</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
              <h3 className="font-medium text-sm mb-1">{product.name}</h3>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm ml-1">{product.rating}</span>
                  <span className="text-gray-400 text-xs ml-1">({product.ratingCount})</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {product.salePrice ? (
                  <>
                    <div>
                      <span className="text-red-600 font-bold">₹{product.salePrice}</span>
                      <span className="text-gray-400 text-sm line-through ml-2">₹{product.originalPrice}</span>
                    </div>
                    <span className="text-red-600 text-sm">{product.discount}% off</span>
                  </>
                ) : (
                  <span className="font-bold">₹{product.price}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 
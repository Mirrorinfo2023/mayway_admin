import Image from 'next/image';

export default function ProductCard({ product }) {
  if (!product) return null; // safeguard for SSR/static build

  const {
    name = '',
    description = '',
    price = 0,
    originalPrice = null,
    image = '',
  } = product;

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
          {discount}% OFF
        </div>
      )}

      {/* Product image */}
      <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={name || 'Product'}
            fill
            className="object-cover rounded-md"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        )}
      </div>

      {/* Product Name */}
      <h3 className="text-base font-semibold text-gray-800 mb-1 truncate">{name}</h3>

      {/* Product Description */}
      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{description}</p>

      {/* Price Section */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-blue-600 font-bold text-base mr-2">₹{price}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
          )}
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 text-sm rounded-md transition"
          aria-label={`Add ${name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

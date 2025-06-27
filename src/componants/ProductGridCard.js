import Image from 'next/image';

export default function ProductGridCard({ product }) {
  if (!product) return null; // safeguard against undefined product

  const {
    image,
    name,
    price,
    originalPrice,
    moreCount,
    freeDelivery,
    rating,
    reviews,
    trusted,
  } = product;

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border hover:shadow-md transition cursor-pointer">
      <div className="relative w-full h-48 rounded-md overflow-hidden">
        <Image
          src={image}
          alt={name || 'Product Image'}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />

        {moreCount > 0 && (
          <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded-full">
            +{moreCount} More
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium mt-2 line-clamp-2">{name}</h3>

      <div className="flex items-center text-sm mt-1 space-x-2">
        {originalPrice && originalPrice > price && (
          <span className="text-gray-400 line-through text-xs">
            ₹{originalPrice}
          </span>
        )}
        <span className="text-blue-600 font-semibold text-base">₹{price}</span>
        {freeDelivery && (
          <span className="text-green-600 text-xs font-medium ml-2">
            | Free Delivery
          </span>
        )}
      </div>

      <div className="flex items-center text-xs text-gray-600 mt-1">
        {rating && (
          <span className="bg-green-500 text-white px-2 py-0.5 rounded mr-2 text-xs">
            {rating}
          </span>
        )}
        {reviews && <span className="mr-2">{reviews} Reviews</span>}
        {trusted && (
          <span className="text-pink-600 font-semibold ml-auto">❤️ Trusted</span>
        )}
      </div>
    </div>
  );
}

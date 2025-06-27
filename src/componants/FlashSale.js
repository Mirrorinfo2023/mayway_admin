// components/FlashSale.js
import ProductCard from './ProductCard';

export default function FlashSale({ products }) {
  return (
    <section className="my-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Flash Sale - Limited Time!</h2>
        <span className="bg-green-100 text-green-600 text-sm px-2 py-1 rounded">Ends in: 11:59:45</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </section>
  );
}
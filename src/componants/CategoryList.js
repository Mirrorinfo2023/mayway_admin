// components/CategoryList.js
export default function CategoryList({ categories }) {
  return (
    <section className="my-10">
      <h2 className="text-xl font-semibold mb-4">Shop by Category</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {categories.map((cat, index) => (
          <div key={index} className="bg-white p-4 rounded shadow text-center hover:shadow-md">
            <div className="text-3xl mb-2">{cat.icon}</div>
            <p>{cat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
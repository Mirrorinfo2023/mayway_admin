import { useState } from "react";
import { Download } from "lucide-react";

const reviews = [
  {
    id: 23,
    product: "Product not found",
    customer: "Devid Jack",
    rating: 4,
    review: "Nice human.",
    date: "20 Nov 2022",
    images: [],
  },
  {
    id: 22,
    product: "Product not found",
    customer: "Robert Downey",
    rating: 5,
    review: "Delivery service was good.",
    date: "20 Nov 2022",
    images: [],
  },
  // Add more...
];

export default function CustomerReviews() {
  const [search, setSearch] = useState("");

  const exportCSV = () => {
    const csv = [
      ["Review ID", "Product", "Customer", "Rating", "Review", "Date"],
      ...reviews.map(r => [r.id, r.product, r.customer, r.rating, r.review, r.date])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "customer_reviews.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = reviews.filter(r =>
    r.customer.toLowerCase().includes(search.toLowerCase()) ||
    r.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">Customer Reviews ({reviews.length})</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select className="border p-2 rounded w-40">
          <option>-- Select Product --</option>
          {/* Add dynamic product options */}
        </select>

        <select className="border p-2 rounded w-40">
          <option>-- Select Customer --</option>
        </select>

        <select className="border p-2 rounded w-40">
          <option>-- Select Status --</option>
        </select>

        <input type="date" className="border p-2 rounded" />

        <input
          type="text"
          className="border p-2 rounded flex-1"
          placeholder="Search by Product or Customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={exportCSV}
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">SL</th>
              <th className="p-2 border">Review ID</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Review</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr key={r.id}>
                <td className="p-2 border">{idx + 1}</td>
                <td className="p-2 border">{r.id}</td>
                <td className="p-2 border">{r.product}</td>
                <td className="p-2 border">{r.customer}</td>
                <td className="p-2 border">{r.rating}</td>
                <td className="p-2 border">{r.review}</td>
                <td className="p-2 border">{r.date}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 hover:underline">Reply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
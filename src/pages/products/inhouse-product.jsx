import React, { useEffect, useState } from "react";
import { addInHouseProduct, getInHouseProducts } from "@/services/productApi";

const defaultFormState = {
  name: "",
  type: "Physical",
  brand: "",
  category: "",
  subcategory: "",
  subsubcategory: "",
  price: "",
  discount: "",
  quantity: "",
  sku: "",
  description: "",
  image: "",
  featured: false,
  status: "Active",
};

const InHouseProduct = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(defaultFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getInHouseProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        const imageURL = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, image: imageURL }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddProduct = async () => {
    const { name, price, sku, quantity } = formData;
    if (!name || !price || !sku || !quantity) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount || 0),
      quantity: parseInt(formData.quantity, 10),
    };

    try {
      const response = await addInHouseProduct(payload);
      if (response?.status) {
        alert("Product added successfully");
        setFormData(defaultFormState);
        fetchProducts();
      } else {
        alert(response?.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Add product error:", error);
      alert("An error occurred while adding product.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">In-House Product</h2>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mb-10">
        <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input name="name" placeholder="Product Name *" value={formData.name} onChange={handleChange} />
          <Select name="type" value={formData.type} onChange={handleChange} options={["Physical", "Digital"]} />
          <Input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
          <Input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
          <Input name="subcategory" placeholder="Sub Category" value={formData.subcategory} onChange={handleChange} />
          <Input name="subsubcategory" placeholder="Sub Sub Category" value={formData.subsubcategory} onChange={handleChange} />
          <Input type="number" name="price" placeholder="Unit Price *" value={formData.price} onChange={handleChange} />
          <Input type="number" name="discount" placeholder="Discount Price" value={formData.discount} onChange={handleChange} />
          <Input type="number" name="quantity" placeholder="Quantity *" value={formData.quantity} onChange={handleChange} />
          <Input name="sku" placeholder="SKU / Product Code *" value={formData.sku} onChange={handleChange} />
          <input type="file" accept="image/*" onChange={handleChange} className={inputClass} />
          <Select name="status" value={formData.status} onChange={handleChange} options={["Active", "Inactive"]} />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="col-span-2 p-2 border rounded-md"
          />

          <label className="flex items-center gap-2 col-span-2">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
            Show as Featured Product
          </label>
        </div>

        <button
          onClick={handleAddProduct}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">In-House Product List</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                {["#", "Name", "Type", "Brand", "Category", "Price", "Discount", "Qty", "Featured", "Status"].map((h, idx) => (
                  <th key={idx} className="px-3 py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id || i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2">{p.type}</td>
                  <td className="px-3 py-2">{p.brand}</td>
                  <td className="px-3 py-2">{p.category}</td>
                  <td className="px-3 py-2">₹{p.price}</td>
                  <td className="px-3 py-2">₹{p.discount}</td>
                  <td className="px-3 py-2">{p.quantity}</td>
                  <td className="px-3 py-2">{p.featured ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const Input = ({ type = "text", ...props }) => <input type={type} {...props} className={inputClass} />;

const Select = ({ name, value, onChange, options }) => (
  <select name={name} value={value} onChange={onChange} className={inputClass}>
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

const inputClass = "w-full px-4 py-2 border rounded-md";

export default InHouseProduct;

// pages/api/products/in-house.js
let products = [
  {
    id: 1,
    name: "Sample Product",
    type: "Physical",
    brand: "BrandX",
    category: "Electronics",
    subcategory: "Mobiles",
    subsubcategory: "Smartphones",
    price: 499,
    discount: 50,
    quantity: 10,
    sku: "SKU123",
    description: "This is a sample product",
    image: "",
    featured: true,
    status: "Active",
  },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      data: products,
    });
  }

  if (req.method === "POST") {
    const body = req.body;
    const newProduct = { ...body, id: Date.now() };
    products.push(newProduct);
    return res.status(200).json({
      status: true,
      message: "Product added successfully",
      data: newProduct,
    });
  }

  res.status(405).json({ status: false, message: "Method not allowed" });
}

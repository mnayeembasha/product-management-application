import React, { useEffect, useState } from "react";
import "./Products.css";

type ProductType = {
  _id?: string;
  name: string;
  price: string;
  description: string;
  category: string;
  slug?: string;
  image?: string;
};

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8080" : "";
export const Product: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [formData, setFormData] = useState<ProductType>({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
      } else {
        setError(data.message || "Failed to fetch products");
      }
    } catch (error) {
        console.log(error);
      setError("Server error while fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${BASE_URL}/api/products/${editingId}` : `${BASE_URL}/api/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        fetchProducts();
        setFormData({ name: "", price: "", description: "", category: "" });
        setEditingId(null);
      } else {
        setError(data.message || "Failed to save product");
      }
    } catch (error) {
        console.log(error);
      setError("Server error while saving product");
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        setError(data.message || "Failed to delete product");
      }
    } catch (error) {
        console.log(error);
        setError("Server error while deleting product");
    }
  };

  // Edit product
  const handleEdit = (product: ProductType) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
    });
    setEditingId(product._id || null);
  };

  return (
    <div className="product-container">
      <h1 className="title">Product Management</h1>

      {/* Form */}
      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-primary">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      {/* Product List */}
      <div className="product-grid">
        {products.length === 0 && !loading ? (
          <p>No products available</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <h3>{product.name}</h3>
              <p className="price">₹{product.price}</p>
              <p>{product.description}</p>
              <p className="category">Category: {product.category}</p>
              <div className="actions">
                <button onClick={() => handleEdit(product)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id!)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


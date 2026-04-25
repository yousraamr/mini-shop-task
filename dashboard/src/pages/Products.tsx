import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

type Product = {
  id: string;
  name: string;
  price: number;
};

type Category = {
  id: string;
  name: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");

  async function load() {
    const p = await api.get("/products");
    const c = await api.get("/categories");

    setProducts(p.data.products);
    setCategories(c.data.categories);

    if (c.data.categories.length && !categoryId) {
      setCategoryId(c.data.categories[0].id);
    }
  }

  async function createProduct(e: React.FormEvent) {
  e.preventDefault();

  try {
    await api.post("/products", {
      name,
      price: Number(price),
      image_url:
        image.trim() ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      category_id: categoryId,
      description: "New product",
    });

    setName("");
    setPrice("");
    setImage("");

    load();
  } catch (error: any) {
    alert(error.response?.data?.message || "Create product failed");
  }
}

  async function removeProduct(id: string) {
  try {
    await api.patch(`/products/${id}`, {
      is_active: false,
    });

    load();
  } catch (error: any) {
    alert(error.response?.data?.message || error.message || "Delete product failed");
  }
}

  useEffect(() => {
  void load();
}, []);

  return (
    <div style={{ padding: 30 }}>
      <Link to="/dashboard">← Back</Link>
      <h1>Products</h1>

      <form onSubmit={createProduct} style={form}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={input}
        />

        <input
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={input}
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={input}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button style={btn}>Create Product</button>
      </form>

      <div style={{ marginTop: 30 }}>
        {products.map((item) => (
          <div key={item.id} style={card}>
            <div>
              <strong>{item.name}</strong>
              <p>EGP {item.price}</p>
            </div>

            <button onClick={() => removeProduct(item.id)} style={btnRed}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const form = {
  display: "grid",
  gap: 12,
  maxWidth: 400,
};

const input = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
};

const btn = {
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: 700,
};

const btnRed = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "#ef4444",
  color: "white",
};

const card = {
  background: "white",
  padding: 16,
  borderRadius: 14,
  border: "1px solid #ddd",
  marginBottom: 12,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
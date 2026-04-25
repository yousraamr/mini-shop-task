import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  is_active: boolean;
  category_id: string;
  categories?: { name: string };
};

type Category = {
  id: string;
  name: string;
};

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");

  async function load() {
    const p = await api.get("/products?includeInactive=true");
    const c = await api.get("/categories");

    setProducts(p.data.products);
    setCategories(c.data.categories);

    if (c.data.categories.length && !categoryId) {
      setCategoryId(c.data.categories[0].id);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setPrice("");
    setImage("");
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setImage(product.image_url || "");
    setCategoryId(product.category_id);
  }

  async function submitProduct(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name,
      price: Number(price),
      image_url:
        image.trim() ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      category_id: categoryId,
      description: "Product managed from dashboard",
    };

    try {
      if (editingId) {
        await api.patch(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      resetForm();
      await load();
    } catch (error: any) {
      alert(error.response?.data?.message || "Product action failed");
    }
  }

  async function toggleActive(product: Product) {
    try {
      await api.patch(`/products/${product.id}`, {
        is_active: !product.is_active,
      });

      await load();
    } catch (error: any) {
      alert(error.response?.data?.message || "Toggle failed");
    }
  }

  return (
    <div className="page">
      <aside className="sidebar">
        <h2>Mini Shop</h2>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/orders")}>Orders</button>
        <button onClick={() => navigate("/products")}>Products</button>
      </aside>

      <main className="content">
        <div className="header">
          <h1>Products</h1>
          <p>Create, edit, and toggle product availability.</p>
        </div>

        <form className="form-card" onSubmit={submitProduct}>
          <div className="form-grid">
            <input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <button className="primary-btn">
              {editingId ? "Update Product" : "Create Product"}
            </button>
            {editingId && (
              <button type="button" className="danger-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Toggle</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>{item.categories?.name}</td>
                  <td>EGP {item.price}</td>
                  <td>
                    <span className={`badge ${item.is_active ? "badge-completed" : "badge-cancelled"}`}>
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button className="primary-btn" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                  </td>
                  <td>
                    <button className="danger-btn" onClick={() => toggleActive(item)}>
                      {item.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
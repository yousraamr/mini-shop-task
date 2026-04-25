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
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="hidden md:flex w-64 bg-slate-900 text-white p-6 flex-col gap-3">
        <h2 className="text-2xl font-bold mb-4">Mini Shop</h2>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl px-4 py-3 text-left"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/orders")}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl px-4 py-3 text-left"
        >
          Orders
        </button>

        <button
          onClick={() => navigate("/products")}
          className="bg-slate-700 rounded-xl px-4 py-3 text-left"
        >
          Products
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 mt-2">
            Create, edit, and control product availability.
          </p>
        </div>

        <form
          onSubmit={submitProduct}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl">
              {editingId ? "Update Product" : "Create Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-3 rounded-xl"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left text-slate-500 font-semibold text-sm p-4">
                  Product
                </th>
                <th className="text-left text-slate-500 font-semibold text-sm p-4">
                  Category
                </th>
                <th className="text-left text-slate-500 font-semibold text-sm p-4">
                  Price
                </th>
                <th className="text-left text-slate-500 font-semibold text-sm p-4">
                  Status
                </th>
                <th className="text-left text-slate-500 font-semibold text-sm p-4">
                  Edit
                </th>
                <th className="text-left text-slate-500 font-semibold text-sm p-4">
                  Toggle
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="p-4 font-semibold text-slate-900">
                    {item.name}
                  </td>

                  <td className="p-4 text-slate-600">
                    {item.categories?.name || "—"}
                  </td>

                  <td className="p-4 text-slate-700">EGP {item.price}</td>

                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                        item.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => startEdit(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Edit
                    </button>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(item)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
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
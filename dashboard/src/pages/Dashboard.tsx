import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    ordersToday: 0,
    revenue: 0,
    activeProducts: 0,
  });

  async function loadStats() {
    const ordersRes = await api.get("/orders");
    const productsRes = await api.get("/products?includeInactive=true");

    const orders = ordersRes.data.orders;
    const products = productsRes.data.products;

    const today = new Date().toDateString();

    const todayOrders = orders.filter(
      (o: any) => new Date(o.created_at).toDateString() === today
    );

    setStats({
      ordersToday: todayOrders.length,
      revenue: todayOrders.reduce(
        (sum: number, o: any) => sum + Number(o.total_amount),
        0
      ),
      activeProducts: products.filter((p: any) => p.is_active).length,
    });
  }

  useEffect(() => {
    void loadStats();
  }, []);

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col gap-3">
        <h2 className="text-2xl font-bold mb-4">Mini Shop</h2>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-slate-800 rounded-xl px-4 py-3 text-left hover:bg-slate-700"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/orders")}
          className="bg-slate-800 rounded-xl px-4 py-3 text-left hover:bg-slate-700"
        >
          Orders
        </button>

        <button
          onClick={() => navigate("/products")}
          className="bg-slate-800 rounded-xl px-4 py-3 text-left hover:bg-slate-700"
        >
          Products
        </button>

        <button
          onClick={logout}
          className="mt-auto bg-red-500 rounded-xl px-4 py-3 hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">
          Overview of your store performance.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          <Card title="Orders Today" value={stats.ordersToday} />
          <Card title="Revenue Today" value={`EGP ${stats.revenue}`} />
          <Card title="Active Products" value={stats.activeProducts} />
        </div>
      </main>
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <p className="text-slate-500">{title}</p>
      <h2 className="text-3xl font-bold mt-3">{value}</h2>
    </div>
  );
}
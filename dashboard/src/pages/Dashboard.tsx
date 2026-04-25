import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

type Order = {
  id: string;
  total_amount: number;
  created_at: string;
};

type Product = {
  id: string;
  is_active: boolean;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [ordersToday, setOrdersToday] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);

  async function loadStats() {
    const ordersRes = await api.get("/orders");
    const productsRes = await api.get("/products?includeInactive=true");

    const orders: Order[] = ordersRes.data.orders;
    const products: Product[] = productsRes.data.products;

    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      (order) => new Date(order.created_at).toDateString() === today
    );

    setOrdersToday(todayOrders.length);
    setRevenue(todayOrders.reduce((sum, order) => sum + Number(order.total_amount), 0));
    setActiveProducts(products.filter((p) => p.is_active).length);
  }

  useEffect(() => {
    void loadStats();
  }, []);

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/");
  }

  return (
    <div className="page">
      <aside className="sidebar">
        <h2>Mini Shop</h2>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/orders")}>Orders</button>
        <button onClick={() => navigate("/products")}>Products</button>
        <button className="logout" onClick={logout}>Logout</button>
      </aside>

      <main className="content">
        <div className="header">
          <h1>Dashboard</h1>
          <p>Overview of your shop performance and activity.</p>
        </div>

        <div className="grid">
          <Stat title="Orders Today" value={ordersToday.toString()} />
          <Stat title="Revenue Today" value={`EGP ${revenue}`} />
          <Stat title="Active Products" value={activeProducts.toString()} />
        </div>
      </main>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="card">
      <p className="card-title">{title}</p>
      <div className="card-value">{value}</div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

type Order = {
  id: string;
  total_amount: number;
  status: string;
  profiles?: { name: string; email: string };
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function loadOrders() {
    const res = await api.get("/orders");
    setOrders(res.data.orders);
  }

  async function updateStatus(id: string, status: string) {
  try {
    await api.patch(`/orders/${id}/status`, { status });
    loadOrders();
  } catch (error: any) {
    alert(error.response?.data?.message || "Update status failed");
  }
}

  useEffect(() => {
  void loadOrders();
    }, []);

  return (
    <div style={{ padding: 30 }}>
      <Link to="/dashboard">← Back</Link>
      <h1>Orders</h1>

      {orders.map((order) => (
        <div key={order.id} style={card}>
          <h3>Order #{order.id.slice(0, 8)}</h3>
          <p>{order.profiles?.name}</p>
          <p>{order.profiles?.email}</p>
          <p>Total: EGP {order.total_amount}</p>
          <p>Status: {order.status}</p>

          <select
            value={order.status}
            onChange={(e) => updateStatus(order.id, e.target.value)}
          >
            <option>Pending</option>
            <option>Processing</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "white",
  padding: 20,
  borderRadius: 14,
  border: "1px solid #ddd",
  marginBottom: 14,
};
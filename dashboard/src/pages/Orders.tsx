import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

type Order = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  profiles?: { name: string; email: string };
  order_items?: {
    id: string;
    quantity: number;
    unit_price: number;
    products?: { name: string };
  }[];
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  async function loadOrders() {
    const res = await api.get("/orders");
    setOrders(res.data.orders);
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      await loadOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || "Update status failed");
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

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
          <h1>Orders</h1>
          <p>Track customer orders and update their status.</p>
        </div>

        <div className="form-card">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}</td>
                  <td>
                    <strong>{order.profiles?.name}</strong>
                    <br />
                    <span>{order.profiles?.email}</span>
                  </td>
                  <td>EGP {order.total_amount}</td>
                  <td>
                    <span className={`badge badge-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button className="primary-btn" onClick={() => setSelectedOrder(order)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <div className="form-card" style={{ marginTop: 24 }}>
            <h2>Order Details #{selectedOrder.id.slice(0, 8)}</h2>
            <p>
              <strong>Customer:</strong> {selectedOrder.profiles?.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.profiles?.email}
            </p>
            <p>
              <strong>Total:</strong> EGP {selectedOrder.total_amount}
            </p>

            <h3>Items</h3>
            {selectedOrder.order_items?.map((item) => (
              <p key={item.id}>
                • {item.products?.name} × {item.quantity} — EGP {item.unit_price}
              </p>
            ))}

            <button className="danger-btn" onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
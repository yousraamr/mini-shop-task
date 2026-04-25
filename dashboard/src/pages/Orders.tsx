import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data.orders);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success("Order status updated");
      await loadOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update status failed");
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  function badgeClass(status: string) {
    if (status === "Pending") return "bg-yellow-100 text-yellow-800";
    if (status === "Processing") return "bg-blue-100 text-blue-700";
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
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
          className="bg-slate-700 rounded-xl px-4 py-3 text-left"
        >
          Orders
        </button>

        <button
          onClick={() => navigate("/products")}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl px-4 py-3 text-left"
        >
          Products
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500 mt-2">
            Track customer orders, filter by status, and update order progress.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
          <label className="block text-sm font-semibold text-slate-600 mb-2">
            Filter by status
          </label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 min-w-52"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 bg-slate-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left text-slate-500 font-semibold text-sm p-4">
                    Order
                  </th>
                  <th className="text-left text-slate-500 font-semibold text-sm p-4">
                    Customer
                  </th>
                  <th className="text-left text-slate-500 font-semibold text-sm p-4">
                    Total
                  </th>
                  <th className="text-left text-slate-500 font-semibold text-sm p-4">
                    Status
                  </th>
                  <th className="text-left text-slate-500 font-semibold text-sm p-4">
                    Update
                  </th>
                  <th className="text-left text-slate-500 font-semibold text-sm p-4">
                    Details
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-slate-200">
                    <td className="p-4 font-semibold text-slate-900">
                      #{order.id.slice(0, 8)}
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-900">
                        {order.profiles?.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {order.profiles?.email}
                      </p>
                    </td>

                    <td className="p-4 text-slate-700">
                      EGP {order.total_amount}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${badgeClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value)
                        }
                        className="border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No orders found for this status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedOrder && (
          <div className="mt-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Order Details #{selectedOrder.id.slice(0, 8)}
                </h2>
                <p className="text-slate-500 mt-1">
                  Full order information and purchased items.
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Customer</p>
                <p className="font-bold text-slate-900">
                  {selectedOrder.profiles?.name}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-bold text-slate-900">
                  {selectedOrder.profiles?.email}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Total</p>
                <p className="font-bold text-slate-900">
                  EGP {selectedOrder.total_amount}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">
              Items
            </h3>

            <div className="space-y-3">
              {selectedOrder.order_items?.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 rounded-xl p-4 flex justify-between"
                >
                  <span className="font-semibold text-slate-800">
                    {item.products?.name}
                  </span>
                  <span className="text-slate-600">
                    Qty {item.quantity} · EGP {item.unit_price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
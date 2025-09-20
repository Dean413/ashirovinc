"use client";

import FullPageLoader from "@/app/component/page-reloader";
import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  order_id: string;
  product_name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  name: string;
  total_amount: number;
  status: string;
  reference: string;
  delivery_method: string;
  address: string;
  delivery_status: string;
  created_at: string;
  user_id: string;
  items?: OrderItem[];
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "delivered">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fetch-orders");
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
      else throw new Error(data.error || "Failed to fetch orders");
    } catch (err: any) {
      console.log("Fetch orders error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Delete this order?")) return;
    try {
      const res = await fetch(`/api/delete-order?id=${orderId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) fetchOrders();
      else throw new Error(data.error || "Failed to delete order");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleDeliveryStatus = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "delivered" : "pending";
    try {
      const res = await fetch("/api/update-delivery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) fetchOrders();
      else throw new Error(data.error || "Failed to update delivery status");
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <FullPageLoader text="fetching orders..." />
  if (orders.length === 0)
    return <p className="p-6 text-gray-500">No orders found.</p>;

  // Apply filters: delivery_status + search
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" ? true : order.delivery_status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div>
          <label className="mr-2 font-semibold">Filter by Delivery Status:</label>
          <select
            className="border px-2 py-1 rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Search by Order ID or Reference:</label>
          <input
            type="text"
            className="border px-2 py-1 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g. ORD123, REF456"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Order ID</th>
              <th className="border px-2 py-1">Customer</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Payment_status</th>
              <th className="border px-2 py-1">Address</th>
              <th className="border px-2 py-1">Delivery Method</th>
              <th className="border px-2 py-1">Delivery Status</th>
              <th className="border px-2 py-1">Reference</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{order.id}</td>
                <td className="border px-2 py-1">{order.name}</td>
                <td className="border px-2 py-1">₦{order.total_amount?.toLocaleString() || 0}</td>
                <td className="border px-2 py-1">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.status === "pending"
                        ? "bg-yellow-500"
                        : order.status === "completed"
                        ? "bg-green-600"
                        : "bg-gray-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="border px-2 py-1">{order.address}</td>
                <td className="border px-2 py-1">{order.delivery_method}</td>
                <td className="border px-2 py-1">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.delivery_status === "pending"
                        ? "bg-yellow-500"
                        : order.delivery_status === "delivered"
                        ? "bg-green-600"
                        : "bg-gray-400"
                    }`}
                  >
                    {order.delivery_status}
                  </span>
                </td>
                <td className="border px-2 py-1">{order.reference}</td>
                <td className="border px-2 py-1">{new Date(order.created_at).toLocaleString()}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button
                    className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() =>
                      setExpandedOrder(expandedOrder === order.id ? null : order.id)
                    }
                  >
                    {expandedOrder === order.id ? "Hide Items" : "View Items"}
                  </button>

                  <button
                    className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                    onClick={() =>
                      toggleDeliveryStatus(order.id, order.delivery_status)
                    }
                  >
                    {order.delivery_status === "pending" ? "Mark Delivered" : "Mark Pending"}
                  </button>

                  <button
                    className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    onClick={() => deleteOrder(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Collapsible Items */}
        {filteredOrders.map(
          (order) =>
            expandedOrder === order.id && (
              <div
                key={order.id + "-items"}
                className="mt-2 mb-4 border rounded bg-gray-50 p-4"
              >
                <h3 className="font-semibold mb-2">Order Items</h3>
                {order.items?.length ? (
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Product</th>
                        <th className="border px-2 py-1">Price</th>
                        <th className="border px-2 py-1">Quantity</th>
                        <th className="border px-2 py-1">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="border px-2 py-1">{item.product_name}</td>
                          <td className="border px-2 py-1">₦{item.price.toLocaleString()}</td>
                          <td className="border px-2 py-1">{item.quantity}</td>
                          <td className="border px-2 py-1">₦{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No items found for this order.</p>
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
}

"use client";

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
  total_amount: number;
  status: string;
  delivery_status: string;
  created_at: string;
  user_id: string;
  items?: OrderItem[];
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/fetch-orders");
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
      else throw new Error(data.error || "Failed to fetch orders");
    } catch (err: any) {
      console.error("Fetch orders error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  if (orders.length === 0)
    return <p className="p-6 text-gray-500">No orders found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Order ID</th>
              <th className="border px-2 py-1">Customer</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Delivery</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{order.id}</td>
                <td className="border px-2 py-1">{order.user_id}</td>
                <td className="border px-2 py-1">
                  ₦{order.total_amount?.toLocaleString() || 0}
                </td>
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
                <td className="border px-2 py-1">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="border px-2 py-1">
                  <button
                    className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.id ? null : order.id
                      )
                    }
                  >
                    {expandedOrder === order.id ? "Hide Items" : "View Items"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Collapsible Items */}
        {orders.map(
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
                          <td className="border px-2 py-1">
                            ₦{item.price.toLocaleString()}
                          </td>
                          <td className="border px-2 py-1">{item.quantity}</td>
                          <td className="border px-2 py-1">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </td>
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

"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
      } else {
        setError(data.error || "Order not found.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Track Your Order
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Order ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Search size={18} />
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {/* Result */}
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {order && (
          <div className="mt-6 border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Order Details
            </h2>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Payment Status:</strong> {order.payment_status}</p>
            <p><strong>Delivery Status:</strong> {order.status}</p>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Total:</strong> ₦{order.total?.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

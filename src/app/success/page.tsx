"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // ✅ Retrieve order from localStorage (saved after checkout)
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">No order found</h1>
        <Link href="/products" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you <span className="font-semibold">{order.details.name}</span> for your order.
        </p>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          <ul className="space-y-2 text-left">
            {order.items.map((item: any) => (
              <li key={item.id} className="flex justify-between border-b pb-1">
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-bold">
            Total: ₦{order.total.toLocaleString()}
          </p>
        </div>

        {/* Customer Details */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h2 className="text-lg font-semibold mb-3">Customer Details</h2>
          <p><strong>Email:</strong> {order.details.email}</p>
          <p><strong>Phone:</strong> {order.details.phone}</p>
          <p><strong>Address:</strong> {order.details.address}</p>
        </div>

        <Link
          href="/products"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useCart, CartItem } from "@/context/cartcontext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, removeFromCart, getTotalItems } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {cartItems.map((item: CartItem) => (
            <div
              key={item.id}
              className="flex items-center bg-white p-4 rounded-lg shadow"
            >
              {/* Image */}
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              {/* Product Details */}
              <div className="ml-4 flex-1">
                <h2 className="font-semibold text-gray-800">{item.name}</h2>
                {item.brand && (
                  <p className="text-sm text-gray-500">Brand: {item.brand}</p>
                )}
                <p className="text-blue-600 font-bold mt-1">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Quantity: {item.quantity}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Total and Checkout */}
          <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center mt-6">
            <p className="text-lg font-semibold text-gray-800">
              Total ({getTotalItems()} items): ₦{totalPrice.toLocaleString()}
            </p>
            <Link
              href="/checkout"
              className="mt-3 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

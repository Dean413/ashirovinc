"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cartcontext";
import { FaTrash } from "react-icons/fa";

export default function CartPage() {
  const { cartItems, removeFromCart, getTotalItems } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                {/* Left: image */}
                <div className="flex items-center gap-4">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded"
                    />
                  )}
                  {/* Product info */}
                  <div>
                    <p className="font-bold">{item.name}</p>
                    {item.brand && (
                      <p className="text-gray-500 text-sm">{item.brand}</p>
                    )}
                    <p className="font-medium">Qty: {item.price}</p>
                    <p className="text-gray-700 text-sm">Qty: {item.quantity}</p>
                  </div>

                  
                </div>


                {/* Right: price & remove */}
                <div className="flex items-center gap-4">
                  <p className="font-semibold">₦{item.price * item.quantity}</p>
                  <button onClick={() => removeFromCart(item.id)}>
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

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
        </>
      )}
    </div>
  );
}

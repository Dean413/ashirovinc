"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, CartItem } from "@/context/cartcontext";
import { FaTrash } from "react-icons/fa";
import { supabase } from "@/lib/supabaseclient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart, getTotalItems, updateQuantity } = useCart();
  const [loadingIds, setLoadingIds] = useState<(string | number)[]>([]);
  const router = useRouter();

  // --- Final safety check before checkout ---
  const validateCart = async () => {
    for (const item of cartItems) {
      const { data: product, error } = await supabase
        .from("products")
        .select("stock, name")
        .eq("id", item.id)
        .single();

      if (error) {
        alert("Error checking stock. Please try again.");
        return false;
      }

      if (!product || product.stock < item.quantity) {
        alert(
          `"${item.name}" exceeds available stock. Only ${product?.stock ?? 0} left.`
        );
        // clamp cart quantity if stock dropped
        updateQuantity(item.id, product?.stock ?? 0);
        return false;
      }
    }
    return true;
  };

  const handleCheckout = async () => {
  // Check if any item has quantity 0
  const hasZeroQty = cartItems.some((c) => c.quantity === 0);
  if (hasZeroQty) {
    alert("Each item must have quantity greater than 0");
    return;
  }

  const isValid = await validateCart();
  if (isValid) router.push("/checkout");
};

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // quick UX check when increasing
  const handleIncrease = async (item: CartItem) => {
  // Always fetch the latest stock
  setLoadingIds((prev) => [...prev, item.id]);
  const { data: product, error } = await supabase
    .from("products")
    .select("stock")
    .eq("id", item.id)
    .single();
  
    setLoadingIds((prev) => prev.filter((id) => id !== item.id)); // clear loading


  if (error) {
    console.error("Error fetching stock:", error);
    alert("Unable to check stock right now.");
    return;
  }

  if (!product || item.quantity >= product.stock) {
    alert(`Only ${product?.stock ?? 0} in stock right now.`);
    return;
  }

  updateQuantity(item.id, item.quantity + 1);
};


  const handleDecrease = (item: CartItem) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

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
                  <div>
                    {item.brand && (
                      <p className="text-gray-500 text-sm">{item.brand}</p>
                    )}
                    <p className="font-bold">{item.name}</p>
                    <p className="font-medium">Price: ₦{item.price}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600 flex items-center justify-center w-8 h-8"
                        onClick={() => handleDecrease(item)}
                      >
                        –
                      </button>
                      <span>{item.quantity}</span>
                     <button
  onClick={() => handleIncrease(item)}
  disabled={loadingIds.includes(item.id) || item.quantity >= item.maxStock}
  className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center w-8 h-8"
>
  {loadingIds.includes(item.id) ? (
    // Tiny spinner (Tailwind + animate-spin)
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
      />
    </svg>
  ) : (
    "+"
  )}
</button>

                    </div>

                    <p className="font-semibold mt-1">
                      Total: ₦{item.price * item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={() => removeFromCart(item.id)}>
                    <span className="flex gap-2 items-center text-red-500">
                      Remove <FaTrash className="text-red-500" />
                    </span>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center mt-6">
            <p className="text-lg font-semibold text-gray-800">
              SubTotal ({getTotalItems()} items): ₦
              {totalPrice.toLocaleString()}
            </p>
            <button
              onClick={handleCheckout}
              className="mt-3 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

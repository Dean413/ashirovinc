"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, CartItem } from "@/context/cartcontext";
import { FaTrash } from "react-icons/fa";
import { supabase } from "@/lib/supabaseclient";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, removeFromCart, getTotalItems, updateQuantity } = useCart();
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
    const isValid = await validateCart();
    if (isValid) router.push("/checkout");
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // quick UX check when increasing
  const handleIncrease = (item: CartItem) => {
    if (item.quantity >= item.maxStock) return; // already at limit
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
                        className="px-2 py-1 bg-blue-300 rounded hover:bg-blue-400"
                        onClick={() => handleDecrease(item)}
                      >
                        –
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="px-2 py-1 bg-blue-300 rounded hover:bg-blue-400 disabled:opacity-50"
                        onClick={() => handleIncrease(item)}
                        disabled={item.quantity >= item.maxStock}
                      >
                        +
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

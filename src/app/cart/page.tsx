"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, CartItem } from "@/context/cartcontext";
import { FaTrash } from "react-icons/fa";
import { supabase } from "@/lib/supabaseclient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FullPageLoader from "../component/page-reloader";
import SpinnerButton from "../component/spinner";

export default function CartPage() {
  const { cartItems, removeFromCart, getTotalItems, updateQuantity } = useCart();
  const [loadingIds, setLoadingIds] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => setLoading(false), []);

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
        alert(`"${item.name}" exceeds available stock. Only ${product?.stock ?? 0} left.`);
        updateQuantity(item.id, product?.stock ?? 0); // clamp cart quantity
        return false;
      }
    }
    return true;
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      if (cartItems.some((c) => c.quantity === 0)) {
        alert("Each item must have quantity greater than 0");
        setLoading(false);
        return;
      }

      const isValid = await validateCart();
      if (isValid) router.push("/checkout");
      else setLoading(false);
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleIncrease = async (item: CartItem) => {
    setLoadingIds((prev) => [...prev, item.id]);

    const { data: product, error } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.id)
      .single();

    setLoadingIds((prev) => prev.filter((id) => id !== item.id));

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
    if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
    else removeFromCart(item.id);
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center border p-2 rounded">
                <div className="flex items-center gap-4">
                  {item.image && <Image src={item.image} alt={item.name} width={80} height={80} className="rounded" />}
                  <div>
                    {item.brand && <p className="text-gray-500 text-sm">{item.brand}</p>}
                    <p className="font-bold">{item.name}</p>
                    <p className="font-medium">Price: ₦{item.price}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600 flex items-center justify-center w-8 h-8"
                        onClick={() => handleDecrease(item)}
                      >
                        –
                      </button>
                      <span>{item.quantity}</span>
                      <SpinnerButton
                        onClick={() => handleIncrease(item)}
                        loading={loadingIds.includes(item.id)}
                        disabled={item.quantity >= item.maxStock}
                      >
                        +
                      </SpinnerButton>
                    </div>

                    <p className="font-semibold mt-1">Total: ₦{item.price * item.quantity}</p>
                  </div>
                </div>

                <button onClick={() => removeFromCart(item.id)} className="flex gap-2 items-center text-red-500">
                  Remove <FaTrash />
                </button>
              </li>
            ))}
          </ul>

          <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center mt-6">
            <p className="text-lg font-semibold text-gray-800">
              SubTotal ({getTotalItems()} items): ₦{totalPrice.toLocaleString()}
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

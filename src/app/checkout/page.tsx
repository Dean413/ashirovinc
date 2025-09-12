"use client";

import { useState } from "react";
import { useCart } from "@/context/cartcontext";
import Image from "next/image";
import Script from "next/script";
import countries from "world-countries";
import { getAllStates } from "nigeria-states";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getTotalItems, clearCart } = useCart();
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const supabase = createClientComponentClient();

  const nigeriaStates = getAllStates();
  const sortedCountries = countries.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

  

  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    deliveryMethod: "",
  });
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  const handleChange = (e: any) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  // 🔹 Paystack function lives outside so it’s reusable
  const handlePaystackPayment = (reference: string) => {
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      email: details.email,
      amount: totalPrice * 100,
      currency: "NGN",
      firstname: details.name,
      phone: details.phone,
      ref: reference,
      callback: async function (response: any) {
        alert("Payment successful! Reference: " + response.reference);
        clearCart();
        router.push("/success");
      },
      onClose: function () {
        alert("Payment was cancelled.");
      },
    });

    handler.openIframe();
  };

  const handlePayNow = async () => {
    if (!details.email || !details.name || !details.phone || !details.address) {
      alert("Please fill all required details.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. Create order (pending)
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems,
        total: totalPrice,
        details,
        status: "pending",
        userId: user?.id || null,
      }),
    });

    const order = await res.json();

    if (!order?.reference) {
      alert("Failed to create order. Please try again.");
      return;
    }

    // Save locally (optional)
    localStorage.setItem("lastOrder", JSON.stringify(order));

    // 2. Proceed to Paystack
    handlePaystackPayment(order.reference);
  };

  if (cartItems.length === 0) return <p className="p-6">Your cart is empty.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-8">
      {/* ... cart items + details form here ... */}

      <div className="bg-white shadow rounded p-6 flex justify-between items-center">
        <p className="font-semibold text-lg">
          SubTotal ({getTotalItems()} items): ₦{totalPrice.toLocaleString()}
        </p>
        <button
          onClick={handlePayNow}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Pay Now
        </button>
      </div>

      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
        onLoad={() => setPaystackLoaded(true)}
      />
    </div>
  );
}

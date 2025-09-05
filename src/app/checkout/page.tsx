"use client";

import { useState } from "react";
import { useCart } from "@/context/cartcontext";
import Image from "next/image";
import Script from "next/script";

export default function CheckoutPage() {
  const { cartItems, getTotalItems } = useCart();
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [paystackLoaded, setPaystackLoaded] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handlePaystackPayment = () => {
    if (!details.email || !details.name || !details.phone || !details.address) {
      alert("Please fill in all required details.");
      return;
    }

    if (!(window as any).PaystackPop) {
      alert("Paystack script not loaded yet. Please try again.");
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      email: details.email,
      amount: totalPrice * 100, // Paystack expects kobo
      currency: "NGN",
      firstname: details.name,
      phone: details.phone,
      callback: function (response: any) {
        alert("Payment successful. Reference: " + response.reference);
        // clear cart or redirect
      },
      onClose: function () {
        alert("Payment was cancelled.");
      },
    });
    handler.openIframe();
  };

  if (cartItems.length === 0) return <p className="p-6">Your cart is empty.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Cart Items */}
      <div className="bg-white shadow rounded p-4 flex flex-col gap-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 items-center border-b pb-4">
            {item.image && (
              <Image src={item.image} alt={item.name} width={80} height={80} className="rounded" />
            )}
            <div className="flex-1">
              {item.brand && <p className="text-gray-500 text-sm">{item.brand}</p>}
              <p className="font-bold">{item.name}</p>
              <p>₦{item.price.toLocaleString()}</p>
              <p>Qty: {item.quantity}</p>
              <p>Total: ₦{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User Details */}
      <div className="bg-white shadow rounded p-4 flex flex-col gap-4">
        <h2 className="font-semibold text-lg">Your Details</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={details.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={details.email}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={details.phone}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <textarea
          name="address"
          placeholder="Address"
          value={details.address}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Subtotal & Pay */}
      <div className="bg-white shadow rounded p-4 flex justify-between items-center">
        <p className="font-semibold">
          SubTotal ({getTotalItems()} items): ₦{totalPrice.toLocaleString()}
        </p>
        <button
          onClick={handlePaystackPayment}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Pay Now
        </button>
      </div>

      {/* Paystack Script */}
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
        onLoad={() => setPaystackLoaded(true)}
      />
    </div>
  );
}

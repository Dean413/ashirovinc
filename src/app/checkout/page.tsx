"use client";

import { useState } from "react";
import { useCart } from "@/context/cartcontext";
import Image from "next/image";
import Script from "next/script";
import countries from "world-countries"
import {getAllStates} from "nigeria-states"
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import FullPageLoader from "../component/page-reloader";


export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, getTotalItems, clearCart } = useCart();
  const totalPrice = cartItems.reduce( (sum, item) => sum + item.price * item.quantity, 0);
  const [selectedOption, setSelectedOption] = useState("")
  const supabase = createClientComponentClient();
  const nigeriaStates = getAllStates()
  const [loading, setLoading] = useState(false)

  
  const sortedCountries = countries.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

  

  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    delivery: ["ship", "pickup"],
    country: "",
    state: ""
  });

  const [paystackLoaded, setPaystackLoaded] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      callback: function (response: any) {(async () => {
        setLoading(true)
      alert("Payment successful. Reference: " + response.reference);

            const {
        data: { user },
      } = await supabase.auth.getUser();

    

    const orderData = {
      items: cartItems,
      total: totalPrice,
      details,
      reference: response.reference,
    };

    localStorage.setItem("lastOrder", JSON.stringify(orderData));

    // Update stock in DB
    await fetch("/api/create-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    cartItems,
    total: totalPrice,
    details,
    reference: response.reference,
    userId: user?.id || null // if logged in
  }),
});

    router.push("/success");
    clearCart();
    
  })();
},


      onClose: function () {
        alert("Payment was cancelled.");
      },
    });
    handler.openIframe();
  };

  if (loading) return <FullPageLoader />

  if (cartItems.length === 0) return <p className="p-6">Your cart is empty.</p>;

  return (
  <div className="max-w-4xl mx-auto p-4 flex flex-col gap-8">
    <h1 className="text-3xl font-bold">Checkout</h1>

    {/* Cart Items */}
    <div className="bg-white shadow rounded p-4 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item.id} className="flex gap-4 items-center border-b pb-4">
          {item.image && (
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              className="rounded"
            />
          )}
          <div className="flex-1">
            {item.brand && (
              <p className="text-gray-500 text-sm">{item.brand}</p>
            )}
            <p className="font-bold">{item.name}</p>
            <p>₦{item.price.toLocaleString()}</p>
            <p>Qty: {item.quantity}</p>
            <p>Total: ₦{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>

    {/* User Details */}
    <div className="bg-white shadow rounded p-6 flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Your Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={details.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <select
            name="country"
            value={details.country}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option value="">-- Select your country --</option>
            {sortedCountries.map((country: any) => (
              <option key={country.cca2} value={country.cca2}>
                {country.name.common}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={details.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Enter your email"
          />
        </div>

        

        

        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <select
            name="state"
            value={details.state}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option value="">-- Select your state --</option>
            {nigeriaStates.map((state: any) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={details.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <textarea
          name="address"
          value={details.address}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          placeholder="Enter your full delivery address"
        />
      </div>

      {/* Delivery Method */}
      <div>
        <p className="text-sm font-medium mb-2">Delivery Method</p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryMethod"
              value={details.delivery[1]}
              checked={selectedOption === details.delivery[1]}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                setDetails((prev) => ({
                  ...prev,
                  deliveryMethod: e.target.value,
                }));
              }}
            />
            <span>Pickup</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryMethod"
              value={details.delivery[0]}
              checked={selectedOption === details.delivery[0]}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                setDetails((prev) => ({
                  ...prev,
                  deliveryMethod: e.target.value,
                }));
              }}
            />
            <span>Shipping</span>
          </label>
        </div>
      </div>
    </div>

    {/* Payment Section */}
<div className="bg-white shadow rounded p-6 flex flex-col gap-4">
  <h2 className="text-xl font-semibold">Payment</h2>
  <h3 className="text-gray-500">Paystack</h3>
  <p className="text-sm text-gray-500 flex items-center gap-1">
    <span className="text-green-600">🔒</span> All transactions are secure and encrypted.
  </p>

  <div className="flex items-center flex-wrap gap-3 mt-2">
    
    <div className="border rounded-md px-3 py-2 flex items-center gap-2 shadow-sm">
      <Image src="/visa-logo.jpg" alt="Visa" width={30} height={30} />
     
    </div>
    <div className="border rounded-md px-3 py-2 flex items-center gap-2 shadow-sm">
      <Image src="/master-card-logo.jpg" alt="Mastercard" width={30} height={30} />
     
    </div>
    <div className="border rounded-md px-3 py-2 flex items-center gap-2 shadow-sm">
      <Image src="/mtn-logo.jpg" alt="MTN" width={30} height={30} />
     
    </div>
    <div className="border rounded-md px-3 py-2 flex items-center gap-2 shadow-sm">
      <Image src="/airtel-logo.jpg" alt="Airtel Tigo" width={30} height={30} />
      
    </div>
    {/* + More */}
    <div className="text-sm text-gray-400">+3 more</div>
  </div>

  <p className="text-sm text-gray-600 mt-4">
    After clicking <strong>“Pay Now”</strong>, you will be redirected to Paystack to complete your purchase securely.
  </p>
</div>


    {/* Subtotal & Pay */}
    <div className="bg-white shadow rounded p-6 flex justify-between items-center">
      <p className="font-semibold text-lg">
        SubTotal ({getTotalItems()} items): ₦{totalPrice.toLocaleString()}
      </p>
      <button
        onClick={handlePaystackPayment}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Pay Now
      </button>
    </div>
    

    {/* Paystack Script */}
    <form>
      <Script
      src="https://js.paystack.co/v1/inline.js"
      strategy="afterInteractive"
      onLoad={() => setPaystackLoaded(true)}
    />
    </form>
    
  </div>
);

}

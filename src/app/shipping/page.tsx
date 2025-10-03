"use client";
import React from "react";
import { Truck, Clock, DollarSign, MapPin, Eye } from "lucide-react";

export default function Shipping() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
        🚚 Shipping Information
      </h1>

      <div className="space-y-8 bg-white shadow-xl rounded-2xl p-8">

        {/* Intro */}
        <section>
          <p className="text-gray-600 leading-relaxed">
            We deliver nationwide across Nigeria, ensuring your laptops and accessories reach you safely and promptly.
          </p>
        </section>

        {/* Processing Time */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <Clock className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">⏱️ Processing Time</h2>
            <p className="text-gray-600">Orders are processed within <span className="font-medium">24–48 hours</span> after payment confirmation.</p>
          </div>
        </section>

        {/* Delivery Time */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <Truck className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">🚛 Delivery Time</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Lagos: <span className="font-medium">2–5 working days</span>.</li>
              <li>Outside Lagos: <span className="font-medium">3–7 working days</span>.</li>
            </ul>
          </div>
        </section>

        {/* Shipping Fees */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <DollarSign className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">💰 Shipping Fees</h2>
            <p className="text-gray-600">Shipping costs are calculated at checkout based on your location.</p>
          </div>
        </section>

        {/* Tracking */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <Eye className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">🔍 Tracking</h2>
            <p className="text-gray-600">You will receive tracking details via email or WhatsApp once your order is shipped.</p>
          </div>
        </section>

        {/* Important Note */}
        <section className="flex items-start space-x-4 p-5 bg-blue-50 rounded-xl shadow-inner">
          <MapPin className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <p className="text-gray-700 leading-relaxed">
              📌 Please ensure your delivery details (address & phone number) are accurate to avoid delays.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

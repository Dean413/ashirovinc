"use client";
import React from "react";
import { UserCheck, Laptop, CreditCard, Tag, Shield, Gavel, RefreshCcw } from "lucide-react";

export default function Terms() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
        📜 Terms & Conditions
      </h1>

      <div className="space-y-8 bg-white shadow-xl rounded-2xl p-8">

        {/* Introduction */}
        <section>
          <p className="text-gray-600 leading-relaxed">
            Welcome to <span className="font-semibold text-blue-600">Ashirovinc</span>. By visiting or purchasing from our website (<span className="font-medium text-gray-800">ashirovinc.com</span>), you agree to the following terms and conditions.
          </p>
        </section>

        {/* Eligibility */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <UserCheck className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">1️⃣ Eligibility</h2>
            <p className="text-gray-600">You must be at least 18 years old to place an order on our website.</p>
          </div>
        </section>

        {/* Products */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <Laptop className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">2️⃣ Products</h2>
            <p className="text-gray-600">We sell UK/US fairly used laptops and computers. Each product listing includes detailed specifications and condition information.</p>
          </div>
        </section>

        {/* Orders & Payment */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <CreditCard className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">3️⃣ Orders & Payment</h2>
            <p className="text-gray-600">Orders are confirmed once payment is received. We accept secure payments via <span className="font-medium">Paystack</span>, <span className="font-medium">Flutterwave</span>, and bank transfers.</p>
          </div>
        </section>

        {/* Pricing */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <Tag className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">4️⃣ Pricing</h2>
            <p className="text-gray-600">All prices are displayed in Nigerian Naira (₦). Prices may change without prior notice.</p>
          </div>
        </section>

        {/* Warranty & Liability */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <Shield className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">5️⃣ Warranty & Liability</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Some laptops may include a limited warranty (details provided per product).</li>
              <li>Ashirovinc is not responsible for misuse, software-related issues, or damages caused after delivery.</li>
            </ul>
          </div>
        </section>

        {/* Disputes */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <Gavel className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">6️⃣ Disputes</h2>
            <p className="text-gray-600">Any disputes arising from purchases will be resolved under Nigerian law.</p>
          </div>
        </section>

        {/* Updates */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <RefreshCcw className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">7️⃣ Updates</h2>
            <p className="text-gray-600">Ashirovinc reserves the right to update or modify these Terms & Conditions at any time without prior notice. Please check this page regularly.</p>
          </div>
        </section>

      </div>
    </div>
  );
}

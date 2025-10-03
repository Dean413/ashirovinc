"use client";
import React from "react";
import { User, Lock, CreditCard, Cookie, Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600  bg-clip-text">
        🔒 Privacy Policy
      </h1>

      <div className="space-y-8 bg-white shadow-xl rounded-2xl p-8">

        {/* Introduction */}
        <section>
          <p className="text-gray-600 leading-relaxed">
            At <span className="font-semibold text-blue-600">Ashirovinc</span>, we value your privacy and are committed to protecting your personal information.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <User className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">📝 Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Name, email, phone number, and address.</li>
              <li>Payment details during checkout.</li>
            </ul>
          </div>
        </section>

        {/* How We Use */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <CreditCard className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">⚡ How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>To process and deliver your orders.</li>
              <li>To improve customer support and services.</li>
            </ul>
          </div>
        </section>

        {/* Data Sharing */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <Lock className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">🔐 Data Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell or rent your personal data. Payments are securely handled by trusted gateways like Paystack and Flutterwave.
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <Cookie className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">🍪 Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website may use cookies to enhance your browsing experience and provide personalized content.
            </p>
          </div>
        </section>

        {/* Security */}
        <section className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
          <Shield className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">🛡️ Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard measures to protect your data. However, no internet system can be 100% secure, so please be mindful when sharing sensitive information online.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="p-6 bg-blue-50 rounded-xl shadow-inner">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📩 Questions?</h2>
          <p className="text-gray-600">
            If you have any privacy concerns, contact us at{" "}
            <a
              href="mailto:support@ashirovinc.com"
              className="text-blue-600 underline font-medium"
            >
              support@ashirovinc.com
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}

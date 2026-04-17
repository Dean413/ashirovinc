"use client";
import React from "react";

export default function ReturnPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 bg-gray-50 mt-25">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        🛒 Return & Refund Policy
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-8 space-y-8">
        {/* Intro */}
        <section>
          <p className="text-gray-600 leading-relaxed">
            At <span className="font-semibold text-blue-600">Ashirovinc</span>, we want you 
            to be completely satisfied with your purchase. If you are not happy 
            with your laptop or accessory, our return process is designed to be 
            simple and hassle-free.
          </p>
        </section>

        {/* Eligibility */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">✅ Eligibility</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Returns accepted within <span className="font-medium"> warranty period (30 days</span> of delivery).</li>
            <li>Item must be in its original condition with all accessories.</li>
            <li>Packaging should be intact (including manuals, chargers, etc.).</li>
          </ul>
        </section>

        {/* Non-returnable */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚫 Non-Returnable Items</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Software issues (e.g. OS corruption due to user error).</li>
            <li>Physical damage caused by misuse or accidents.</li>
            <li>Accessories (batteries, chargers, etc.) unless faulty on delivery.</li>
            <li>Items that have been tampered with or repaired by a third party.</li>
            <li>Items that have exceeded the warranty period (1 month)</li>
          </ul>
        </section>

        {/* Refund Process */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">💵 Refund Process</h2>
          <p className="text-gray-600 leading-relaxed">
            To request a refund, send an email to{" "}
            <a
              href="mailto:support@ashirovinc.com"
              className="text-blue-600 font-medium underline"
            >
              support@ashirovinc.com
            </a>{" "}
            with your order number and reason for return. Once your item is inspected 
            and approved, refunds will be processed within{" "}
            <span className="font-medium">5–10 business days</span> to your original 
            payment method.
          </p>

          <p><strong>Note:</strong> A 15% fee will be charged for refunds.</p>
        </section>

        {/* Exchanges */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔄 Exchanges</h2>
          <p className="text-gray-600 leading-relaxed">
            If you’d like to exchange your laptop for another model, please contact 
            our support team. Exchange requests are subject to product availability.
          </p>
        </section>

        {/* Return Instructions */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📦 How to Return</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Contact our support team via email or phone.</li>
            <li>Package the item securely with all original accessories.</li>
            <li>Ship the item to our designated return address (provided by support).</li>
            <li>Keep your return tracking number for reference.</li>
          </ol>
        </section>

        {/* Contact */}
        <section className="bg-blue-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📞 Need Help?</h2>
          <p className="text-gray-600">
            Our customer support team is always here for you.  
            Email us at{" "}
            <a
              href="mailto:support@ashirovinc.com"
              className="text-blue-600 underline font-medium"
            >
              support@ashirovinc.com
            </a>{" "}
            or call <span className="font-medium">+234 815 695 9605</span>.
          </p>
        </section>
      </div>
    </div>
  );
}

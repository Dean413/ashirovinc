"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "Are your laptops brand new?",
      answer:
        "No, we specialize in UK/US fairly used laptops and computers. Each device is tested and verified before sale to ensure quality and performance.",
    },
    {
      question: "Do your laptops come with warranty?",
      answer:
        "Yes, some laptops come with limited warranty (varies per product). Warranty details are stated in the product description.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery within Lagos takes 2–5 working days, while outside Lagos takes 3–7 working days.",
    },
    {
      question: "Do you deliver nationwide?",
      answer:
        "Yes, we deliver to all states in Nigeria using trusted logistics partners.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept Paystack, Flutterwave, and bank transfers for safe and secure transactions.",
    },
    {
      question: "Can I return a laptop if it’s faulty?",
      answer:
        "Yes, you can return within 7 days if the laptop is faulty or not as described. Please check our Return Policy for details.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
        Frequently Asked Questions
      </h1>

      <div className="space-y-5">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-md border border-gray-200 overflow-hidden"
          >
            {/* Question */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all"
            >
              <span className="font-semibold text-gray-800 text-lg">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-6 h-6 text-indigo-600 transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Answer */}
            {openIndex === index && (
              <div className="px-6 py-4 bg-white text-gray-700 border-t border-gray-100 animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

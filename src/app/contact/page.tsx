"use client";
import React, { useState } from "react";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("❌ Failed to send. Try again later.");
      }
    } catch (error) {
      setStatus("❌ Error sending message.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-4 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
        Contact Us
      </h1>
      <p className="text-center mb-10 text-gray-600 text-lg">
        We'd love to hear from you! Reach out via our form or find us below.
      </p>

      {/* Map + Details */}
      <div className="mb-14 grid md:grid-cols-2 gap-10">
        {/* Google Map */}
        <div className="rounded-2xl overflow-hidden shadow-xl h-[400px] md:h-[500px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.2954145779067!2d7.481053475066002!3d9.036793791024873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0bad2ccd69f5%3A0x15ba286caeeaaca7!2sASHirov%20Technology!5e0!3m2!1sen!2sng!4v1759378572098!5m2!1sen!2sng"
            width="100%"
            height="100%"
            className="border-0 w-full h-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Contact Info */}
        <div className="grid gap-6">
          <div className="flex items-start p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
            <MapPin className="w-6 h-6 text-blue-600 mt-1 mr-4" />
            <p className="text-gray-700">
              <strong>Address:</strong> Lozumba Commercial Complex, Suit 120
              Orago Commercial Complex, Kam Salem Street, Area 10 Garki Abuja,
              FCT Suit 120, Orago, 6 Awka St, Garki, Abuja 900246, Federal
              Capital Territory
            </p>
          </div>
          <div className="flex items-center p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
            <Phone className="w-6 h-6 text-blue-600 mr-4" />
            <p className="text-gray-700">
              <strong>Phone/WhatsApp:</strong> +234 [Insert Phone Number]
            </p>
          </div>
          <div className="flex items-center p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
            <Mail className="w-6 h-6 text-blue-600 mr-4" />
            <p className="text-gray-700">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:support@ashirovinc.com"
                className="text-blue-600 hover:underline"
              >
                support@ashirovinc.com
              </a>
            </p>
          </div>
          <div className="flex items-center p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
            <Globe className="w-6 h-6 text-blue-600 mr-4" />
            <p className="text-gray-700">
              <strong>Website:</strong>{" "}
              <a
                href="https://www.ashirovinc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                www.ashirovinc.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 space-y-5 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Send Us a Message
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
        />

        <textarea
          name="message"
          placeholder="Your Message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          🚀 Send Message
        </button>

        {status && (
          <p className="text-sm mt-3 text-center text-gray-600">{status}</p>
        )}
      </form>
    </div>
  );
}

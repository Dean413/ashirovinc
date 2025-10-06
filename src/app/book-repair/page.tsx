"use client";
import React, { useState } from "react";
import {toast} from "react-toastify"
import { Wrench, UploadCloud } from "lucide-react";

interface RepairForm {
  name: string;
  email: string;
  phone: string;
  bookTitle: string;
  description: string;
  preferredDate: string;
  images?: File[];
}

export default function BookRepair() {
  const [form, setForm] = useState<RepairForm>({
    name: "",
    email: "",
    phone: "",
    bookTitle: "",
    description: "",
    preferredDate: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("bookTitle", form.bookTitle);
      formData.append("description", form.description);
      formData.append("preferredDate", form.preferredDate);
      form.images?.forEach((file) => {
        formData.append(`images`, file);
      });

      const res = await fetch("/api/book-repair", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("📬 Repair booking submitted successfully!");
        setForm({
          name: "",
          email: "",
          phone: "",
          bookTitle: "",
          description: "",
          preferredDate: "",
          images: [],
        });
      } else {
        const err = await res.json();
        toast.error("Failed: " + (err.error || "Something went wrong."));
      }
    } catch (err) {
      toast.error("Error submitting booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
            <Wrench size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            Book a Repair
          </h1>
          <p className="text-gray-500 mt-2">
            Fill out the form below and we’ll get back to you shortly.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
            />
            <input
              type="text"
              name="bookTitle"
              placeholder="Device / Item"
              value={form.bookTitle}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
            />
          </div>

          <textarea
            name="description"
            placeholder="Describe the issue / repair needed"
            rows={5}
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                name="preferredDate"
                value={form.preferredDate}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Upload Photos (optional)
              </label>
              <div className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl px-4 py-6 bg-gray-50 hover:border-blue-400 transition">
                <UploadCloud className="text-blue-500" size={24} />
                <input
                  type="file"
                  name="images"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="text-sm text-gray-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-semibold px-6 py-4 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "🚀 Submit Repair Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

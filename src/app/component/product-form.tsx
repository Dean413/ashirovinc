"use client";

import { useState } from "react";

interface Product {
  id?: number;
  name: string;
  brand: string;
  price?: number;
  stock?: number;
  image_url?: string[];
  description?: string;
  display?: string;
  ram?: string;
  storage?: string;
}

interface ProductFormProps {
  fetchProducts: () => Promise<void>;
  editProduct?: Product;
}

export default function ProductForm({ fetchProducts, editProduct }: ProductFormProps) {
  const [form, setForm] = useState<Product>({
    name: editProduct?.name || "",
    brand: editProduct?.brand || "",
    price: editProduct?.price,
    stock: editProduct?.stock,
    image_url: editProduct?.image_url || [],
    description: editProduct?.description || "",
    display: editProduct?.display || "",
    ram: editProduct?.ram || "",
    storage: editProduct?.storage || "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Upload image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files?.length) return;
  setUploading(true);

  const formData = new FormData();
  Array.from(e.target.files).forEach(file => formData.append("files", file));

  try {
    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    setForm(prev => ({
      ...prev,
      image_url: [...(prev.image_url || []), ...data.publicUrls],
    }));
  } catch (err: any) {
    alert("Image upload failed: " + err.message);
  }

  setUploading(false);
};


  // Submit product
  const handleSubmit = async () => {
    if (!form.name || !form.price) return alert("Name and price are required.");
    setLoading(true);

    try {
      const res = await fetch("/api/add-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Response not JSON:", text);
        throw new Error("Server did not return valid JSON");
      }

      if (!res.ok) throw new Error(data.error || "Failed to add product");

      await fetchProducts();

      setForm({
        name: "",
        brand: "",
        price: undefined,
        stock: undefined,
        image_url: [],
        description: "",
        display: "",
        ram: "",
        storage: "",
      });
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col gap-2">
      <input
        type="text"
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border px-2 py-1 rounded"
      />
      <input
        type="text"
        placeholder="Brand"
        value={form.brand}
        onChange={(e) => setForm({ ...form, brand: e.target.value })}
        className="border px-2 py-1 rounded"
      />
      <input
        type="number"
        placeholder="Price"
        value={form.price ?? ""}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        className="border px-2 py-1 rounded"
      />
      <input
        type="number"
        placeholder="Stock"
        value={form.stock ?? ""}
        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        className="border px-2 py-1 rounded"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="border px-2 py-1 rounded"
      />
      <input
        type="text"
        placeholder="Display"
        value={form.display}
        onChange={(e) => setForm({ ...form, display: e.target.value })}
        className="border px-2 py-1 rounded"
      />
      <input
        type="text"
        placeholder="RAM"
        value={form.ram}
        onChange={(e) => setForm({ ...form, ram: e.target.value })}
        className="border px-2 py-1 rounded"
      />
      <input
        type="text"
        placeholder="Storage"
        value={form.storage}
        onChange={(e) => setForm({ ...form, storage: e.target.value })}
        className="border px-2 py-1 rounded"
      />

      <input type="file" multiple onChange={handleImageUpload} className="border px-2 py-1 rounded" />
      {uploading && <p>Uploading image...</p>}

      <button
        onClick={handleSubmit}
        disabled={loading || uploading}
        className={`mt-2 px-4 py-2 rounded text-white ${
          loading || uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : editProduct ? "Update Product" : "Add Product"}
      </button>
    </div>
  );
}

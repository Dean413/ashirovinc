"use client"
import { useEffect, useState } from "react";
import ProductForm from "@/app/component/product-form";
import { supabase } from "@/lib/supabaseclient";

interface Product {
  id: number;
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

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").order("id");
    if (error) console.error(error);
    else setProducts(data as Product[]);
    setLoading(false);
  };

  // Call fetchProducts when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: number) => {
  if (!confirm("Delete this product?")) return;

  try {
    const res = await fetch("/api/delete-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    await fetchProducts();
  } catch (err: any) {
    alert(err.message);
  }
};


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <ProductForm
        fetchProducts={fetchProducts}
        editProduct={editingProduct || undefined}
      />

      <table className="w-full bg-white shadow rounded mt-6">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Brand</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Stock</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.brand}</td>
              <td className="p-2">₦{p.price?.toLocaleString()}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>

                <button
                  onClick={() => { setEditingProduct(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  
                  className="px-2 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

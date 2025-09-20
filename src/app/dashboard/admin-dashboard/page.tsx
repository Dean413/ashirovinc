"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FullPageLoader from "@/app/component/page-reloader";
import { supabase } from "@/lib/supabaseclient";

import AdminProducts from "./products/page";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
  slug: string;
  image_url: string[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== "admin") {
        router.replace("/sign-in");
      } else {
        await fetchProducts();
      }
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.error(error);
    else setProducts(data as Product[]);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    setActionLoading(true);
    const res = await fetch(`/api/products/delete`, {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    const result = await res.json();
    if (!result.error) setProducts(products.filter((p) => p.id !== id));
    else alert(result.error);
    setActionLoading(false);
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      

      <h2 className="text-xl font-semibold mt-6 mb-2">Products</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Brand</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.brand}</td>
              <td className="p-2">₦{p.price.toLocaleString()}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => deleteProduct(p.id)}
                  disabled={actionLoading}
                  className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
                {/* Edit button can open ProductForm with prefilled data */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

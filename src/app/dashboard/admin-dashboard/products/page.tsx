"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseclient";
import FullPageLoader from "@/app/component/page-reloader";
import ProductForm from "@/app/component/product-form";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
  image_url: string[];
  slug: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").order("id");
    if (error) console.error(error);
    else setProducts(data as Product[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <FullPageLoader />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <ProductForm fetchProducts={fetchProducts} />

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
              <td className="p-2">₦{p.price.toLocaleString()}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2">
                <button
                  onClick={async () => {
                    if (!confirm("Delete this product?")) return;
                    const { error } = await supabase.from("products").delete().eq("id", p.id);
                    if (error) alert(error.message);
                    else fetchProducts();
                  }}
                  className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client"
import { useEffect, useState } from "react";
import ProductForm from "@/app/component/product-form";
import { supabase } from "@/lib/supabaseclient";
import SearchBar from "@/app/component/search-bar";
import FullPageLoader from "@/app/component/page-reloader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface Product {
  id: number;
  name: string;
  brand: string;
  price?: number;
  stock?: number;
  image_url?: string[];
  description?: string[];
  display?: string;
  ram?: string;
  storage?: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);


  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const filteredProducts = selectedBrand && selectedBrand !== "All" ? products.filter((p) => p.brand === selectedBrand) : products;

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
  const result = await Swal.fire({
    title: "Delete this product?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626", // red
    cancelButtonColor: "#6b7280",  // gray
    confirmButtonText: "Yes, delete it",
  });

  // If user cancels, do nothing
  if (!result.isConfirmed) return;
  setDeletingId(id)

  try {
    const res = await fetch("/api/delete-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || "Failed to delete product");

    toast.success("Product deleted successfully");
    await fetchProducts(); // refresh the list
  } catch (err: any) {
    toast.error(err.message || "Something went wrong");
  } finally {
    setDeletingId(null)
  }
};

  if (loading) return <FullPageLoader text="Loading..." />

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <ProductForm
        fetchProducts={fetchProducts}
        editProduct={editingProduct || undefined}
      />

      <SearchBar  />
       {/* Brand Filter */}
      <section className="px-6 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          <button className={`px-4 py-2 rounded-lg font-medium transition ${!selectedBrand || selectedBrand === "All" ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setSelectedBrand("All")}> All
          </button>

          {brands.map((brand) => (
            <button key={brand} className={`px-4 py-2 rounded-lg font-medium transition ${selectedBrand === brand ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setSelectedBrand(brand)}>{brand}
            </button>
          ))}
        </div>
      </section>

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
          {filteredProducts.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.brand}</td>
              <td className="p-2">₦{p.price?.toLocaleString()}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2 flex gap-2">
                <button
      onClick={() => deleteProduct(p.id)}
      disabled={deletingId === p.id}
      className="bg-red-600 text-white px-3 py-1 rounded"
    >
      {deletingId === p.id ? (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        `${deletingId ? "Deleting..." : "Delete"}`
      )}
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

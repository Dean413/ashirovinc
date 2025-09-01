"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseclient";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description?: string;
  image_url: string[];
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
}

interface PageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: PageProps) {
  const { slug } = params;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .single();

      if (error) console.error(error);
      else setProduct(data);
    };
    fetchProduct();
  }, [slug]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="text-blue-600 font-bold mb-6">₦{product.price.toLocaleString()}</p>

      {/* Example: Image carousel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {product.image_url.map((url, idx) => (
          <img key={idx} src={url} alt={product.name} className="w-full h-48 object-cover rounded" />
        ))}
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-4 mb-4">
        <span>Quantity:</span>
        <input type="number" defaultValue={1} min={1} className="w-16 border rounded px-2" />
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add to Cart
      </button>
    </div>
  );
}

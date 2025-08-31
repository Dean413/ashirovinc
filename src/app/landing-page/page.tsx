"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Carousel from "../component/carousel";
import { supabase } from "@/lib/supabaseclient";
import { FaMicrochip, FaMemory, FaHdd, FaDesktop } from "react-icons/fa";

interface Product {
  id: number;
  brand: string;
  name: string;
  image_url: string;
  description?: string;
  price: number;
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("Fetching products...");
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("❌ Error fetching products:", error);
      } else {
        console.log("✅ Products fetched:", data);
        setProducts(data as Product[]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Carousel />

      {/* Featured Products */}
      <section className="py-16 px-6">
  <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
    Featured Products
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {products.map((product) => (
      <div
        key={product.id}
        className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col"
      >
        {/* Make image taller */}
        <div className="w-full relative h-64 md:h-72 lg:h-80">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            className="w-full h-full"
          />
        </div>

        <div className="p-4 flex flex-col flex-1">
          {/* Brand */}
          <small className="text-gray-500">{product.brand}</small>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-800 mt-1">
            {product.name}
          </h3>

          {/* Price */}
          <p className="text-blue-600 font-bold mt-2">
            ₦{product.price?.toLocaleString()}
          </p>

          {/* Product Details */}
          <div className="flex flex-wrap gap-6 mt-3 text-gray-600 text-sm">
            {product.display && (
              <div className="flex flex-col items-center gap-1">
                <FaDesktop className="text-xl" />
                <span className="text-black font-semibold">{product.display}</span>
                <span className="text-xs text-gray-500">Display</span>
              </div>
            )}
            {product.ram && (
              <div className="flex flex-col items-center gap-1">
                <FaMemory className="text-xl" />
                <span className="text-black font-semibold">{product.ram}</span>
                <span className="text-xs text-gray-500">RAM</span>
              </div>
            )}
            {product.storage && (
              <div className="flex flex-col items-center gap-1">
                <FaHdd className="text-xl" />
                <span className="text-black font-semibold">{product.storage}</span>
                <span className="text-xs text-gray-500">Storage</span>
              </div>
            )}
            {product.processor && (
              <div className="flex flex-col items-center gap-1">
                <FaMicrochip className="text-xl" />
                <span className="text-black font-semibold">{product.processor}</span>
                <span className="text-xs text-gray-500">Processor</span>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    ))}
  </div>
</section>

    </div>
  );
}

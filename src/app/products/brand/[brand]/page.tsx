"use client";

import { supabase } from "@/lib/supabaseclient";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMicrochip, FaMemory, FaHdd, FaDesktop, FaExclamationTriangle } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  slug: string;
  image_url: string[];
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  stock: number;
}

export default function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentImages, setCurrentImages] = useState<{ [id: number]: number }>({});

  // Auto-loop images every 7s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImages((prev) => {
        const updated: { [id: number]: number } = {};
        products.forEach((product) => {
          const total = product.image_url?.length || 1;
          updated[product.id] = ((prev[product.id] || 0) + 1) % total;
        });
        return updated;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("brand", brand);

      if (error) console.error("Error:", error);
      else setProducts(data as Product[]);
    };

    fetchProducts();
  }, [brand]);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-10 text-center">{brand} Laptops</h1>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center">No products found for {brand}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product) => {
            const currentIndex = currentImages[product.id] || 0;

            return (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col"
              >
                {/* Product Image */}
                <div className="relative w-full h-64 md:h-72 lg:h-80">
                  <Link href={`/products/${product.slug}`}>
                    {product.image_url?.length > 0 ? (
                      <Image
                        src={product.image_url[currentIndex]}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        No Image
                      </div>
                    )}
                  </Link>
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-1">
                  <small className="text-gray-500">{product.brand}</small>
                  <h3 className="text-lg font-semibold text-gray-800 mt-1">{product.name}</h3>
                  <p className="text-blue-600 font-bold mt-2">₦{product.price?.toLocaleString()}</p>
                  <div>
                    {
                      product.stock > 20 ? 
                      (
                        <p className="text-gray-500">In Stock</p>
                      )
                      : 
                      product.stock >=11 ? 
                      (
                        <p className="text-red-500">few units left</p>
                      ) 
                      :                    
                      (
                        <div className="flex items-center gap-2">
                          <FaExclamationTriangle className="text-red-400" />
                            <p className="text-red-500">{product.stock} units left</p>
                        </div>
                      ) 
                    }
                  </div>

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

                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

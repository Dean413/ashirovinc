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
  image_url: string[]; // now an array of image URLs
  description?: string;
  price: number;
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
}


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentImages, setCurrentImages] = useState<{ [id: number]: number }>({});

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
  }, 2000); // every 2 seconds

  return () => clearInterval(interval);
}, [products]);


  

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

  const nextImage = (productId: number, total: number) => {
    setCurrentImages((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % total,
    }));
  };

  const prevImage = (productId: number, total: number) => {
    setCurrentImages((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + total) % total,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Carousel />

      {/* Featured Products */}
      <section className="py-16 px-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product) => {
            const currentIndex = currentImages[product.id] || 0;
            const totalImages = product.image_url?.length || 1;


            return (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col"
              >
                {/* Carousel */}
                <div className="w-full relative h-64 md:h-72 lg:h-80">
                  {product.image_url && product.image_url.length > 0 ? (
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

                  {/* Carousel arrows */}
                  {totalImages > 1 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white px-2 py-1 rounded"
                        onClick={() => prevImage(product.id, totalImages)}
                      >
                        ‹
                      </button>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white px-2 py-1 rounded"
                        onClick={() => nextImage(product.id, totalImages)}
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <small className="text-gray-500">{product.brand}</small>
                  <h3 className="text-lg font-semibold text-gray-800 mt-1">{product.name}</h3>
                  <p className="text-blue-600 font-bold mt-2">₦{product.price?.toLocaleString()}</p>

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
      </section>
    </div>
  );
}

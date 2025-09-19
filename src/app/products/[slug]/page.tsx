"use client";

import { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { supabase } from "@/lib/supabaseclient";
import { useCart } from "@/context/cartcontext";

interface Product {
  id: number;
  brand: string;
  name: string;
  image_url: string[];
  description?: string;
  price: number;
  slug: string;
  stock: number;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { cartItems, addToCart } = useCart();
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data as Product);
      }
    };

    fetchProduct();
  }, [slug]);

  if (!product) return <div className="p-10 text-center"></div>;

  const currentQuantity = cartItems.find((item) => item.id === product.id)?.quantity ?? 0;
  const maxStock = product.stock;

  const NextArrow = ({ onClick }: any) => (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 bg-black/30 text-white text-3xl rounded-full hover:bg-black/50"
    >
      ❯
    </button>
  );

  const PrevArrow = ({ onClick }: any) => (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 bg-black/30 text-white text-3xl rounded-full hover:bg-black/50"
    >
      ❮
    </button>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    adaptiveHeight: true,
  };

  const isOutOfStock = currentQuantity >= maxStock;

  return (
    <div className="flex justify-center p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
        <div className="mb-4">
          Brand:{" "}
          <Link
            href={`/products/brand/${encodeURIComponent(product.brand)}`}
            className="text-blue-600 hover:underline"
          >
            {product.brand}
          </Link>
        </div>

        {product.image_url.length > 0 && (
          <>
            <Slider {...sliderSettings} ref={sliderRef}>
              {product.image_url.map((img, idx) => (
                <div key={idx} className="relative h-96 md:h-[28rem] lg:h-[32rem] mb-6">
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover rounded-lg bg-gray-100"
                  />
                </div>
              ))}
            </Slider>

            <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-11 gap-2 mt-8">
              {product.image_url.map((thumb, idx) => (
                <div
                  key={idx}
                  className="cursor-pointer overflow-hidden hover:ring-2 hover:ring-blue-500"
                  onClick={() => sliderRef.current?.slickGoTo(idx)}
                >
                  <Image
                    src={thumb}
                    alt={`Thumbnail ${idx + 1}`}
                    width={60}
                    height={60}
                    className="object-cover w-14 h-14"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <p className="text-lg text-gray-700 mb-4">{product.description}</p>
        <p className="text-xl font-semibold text-blue-600 mb-6">
          ₦{product.price.toLocaleString()}
        </p>

        <button
          onClick={() => {
            if (isOutOfStock) return;

            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.image_url[0],
              brand: product.brand,
              maxStock: product.stock,
            });
          }}
          disabled={isOutOfStock}
          className={`w-full mt-4 px-4 py-3 rounded-lg text-white transition ${
            isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

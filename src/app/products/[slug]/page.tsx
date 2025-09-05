"use client";

import { supabase } from "@/lib/supabaseclient";
import Image from "next/image";
import { use, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

interface Product {
  id: number;
  brand: string;
  name: string;
  image_url: string[];
  description?: string;
  price: number;
  slug: string;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);

  // ✅ useRef for slider control
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

  if (!product) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 
                 bg-black/30 hidden w-10 h-10 md:flex items-center justify-center 
                 text-white text-3xl rounded-full hover:bg-black570"
    >
      ❯
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className=" hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 
                 bg-black/30 w-10 h-10 md:flex items-center justify-center 
                 text-white text-3xl rounded-full hover:bg-black/50"
    >
      ❮
    </button>
  );
}


  // ✅ Slider settings
  const settings = {
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

  

  return (
    <div className="relative w-full flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
       <Link
    href={`/products/brand/${product.brand}`}
    className="text-blue-600 hover:underline"
  >
    {product.brand}
  </Link>

        {/* ✅ Main Slider */}
        {product.image_url?.length > 0 && (
          <div className="relative">
            <Slider {...settings} ref={sliderRef}>
              {product.image_url.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-96 md:h-[28rem] lg:h-[32rem] mb-6"
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover rounded-lg bg-gray-100"
                  />
                </div>
              ))}
            </Slider>

            {/* ✅ Thumbnail cards */}
            <div className="grid grid-cols-11 gap-2 mt-8">
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
          </div>
        )}

        <p className="text-lg text-gray-700 mb-4">{product.description}</p>
        <p className="text-xl font-semibold text-blue-600 mb-6">
          ₦{product.price?.toLocaleString()}
        </p>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

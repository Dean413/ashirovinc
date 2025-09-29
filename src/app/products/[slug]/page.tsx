"use client";

import { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { supabase } from "@/lib/supabaseclient";
import { useCart } from "@/context/cartcontext";
import FullPageLoader from "@/app/component/page-reloader";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


interface Product {
  id: number;
  brand: string;
  name: string;
  image_url: string[];
  description: string[];
  price: number;
  slug: string;
  stock: number;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [loading, setLoading] = useState(true)
  const { cartItems, addToCart } = useCart();
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const sliderRef = useRef<Slider | null>(null);
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0);

  
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();
      if (!error) setProduct(data as Product);
      setLoading(false)
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <FullPageLoader text="Loading..." />
  if (!product) return <div className="p-10 text-center">no products found</div>;

  const currentQuantity = cartItems.find((item) => item.id === product.id)?.quantity ?? 0;
  const maxStock = product.stock;
  const isOutOfStock = currentQuantity >= maxStock;

  const NextArrow = ({ onClick }: any) => (
    <button onClick={onClick} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 bg-black/30
       text-white text-3xl rounded-full hover:bg-black/50 transition">
      ❯
    </button>
  );
 
  const PrevArrow = ({ onClick }: any) => (
    <button onClick={onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 bg-black/30 text-white text-3xl rounded-full hover:bg-black/50 transition">
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

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="mx-auto max-w-6xl bg-white shadow-xl rounded-2xl p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div>
            {product.image_url.length > 0 && (
              <>
                <Slider {...sliderSettings} ref={sliderRef} className="rounded-xl overflow-hidden">
                  {product.image_url.map((img, idx) => (
                    <div key={idx} className="relative h-80 md:h-[28rem] lg:h-[30rem]">
                      <Image
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        className="object-cover bg-gray-100"
                        onClick={() => {setOpen(true); setCurrentIndex(idx)}}
                      />
                    </div>
                  ))}
                </Slider>
                 <Lightbox
                    open={open}
                    close={() => setOpen(false)}
                    index={currentIndex}
                    slides={product.image_url.map((url) => ({ src: url }))}
                  />

                {/* Thumbnails */}
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2 mt-6">
                  {product.image_url.map((thumb, idx) => (
                    <div key={idx} onClick={() => sliderRef.current?.slickGoTo(idx)} className="cursor-pointer border border-gray-200 rounded-lg overflow-hiddenhover:ring-2 
                      hover:ring-blue-500 transition">
                      <Image
                        src={thumb}
                        alt={`Thumbnail ${idx + 1}`}
                        width={70}
                        height={70}
                        className="object-cover w-full h-16"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
              <p className="mb-4 text-gray-600">
                Brand:{" "}
                <Link
                  href={`/products/brand/${encodeURIComponent(product.brand)}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {product.brand}
                </Link>
              </p>

              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-base md:text-lg">
                {product.description.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <p className="text-3xl font-bold text-blue-700 mb-4">
                ₦{product.price.toLocaleString()}
              </p>
              <button
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.image_url[0],
                    brand: product.brand,
                    maxStock: product.stock,
                  })
                }
                disabled={isOutOfStock}
                className={`w-full py-4 rounded-lg text-lg font-semibold shadow-md transition
                  ${
                    isOutOfStock
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

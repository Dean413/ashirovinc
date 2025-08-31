"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const slides = [
  {
    id: 1,
    type: "cta",
    title: "Affordable Laptops & Gadgets",
    description:
      "Shop top-quality used laptops and electronics at unbeatable prices. Trusted by thousands across Nigeria.",
    buttonText: "Shop Now",
    buttonLink: "/products",
    bgColor: "bg-blue-800",
     image:
      "",
    
  },
  {
    id: 2,
    type: "image",
    image: "https://th.bing.com/th/id/OIP.ed-29-ckMum--DpdlJRKHgHaFW?w=233&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    caption: "🔥 Up to 30% Off on MacBooks!",
    buttonLink: "/products",
  },
  {
    id: 3,
    type: "image",
    image: "https://th.bing.com/th/id/OIP.ed-29-ckMum--DpdlJRKHgHaFW?w=233&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    caption: "💻 Best deals on Dell & HP laptops",
    buttonLink: "/products",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

 

 useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, 5000)

  return () => clearInterval(interval) // cleanup to avoid leaks
}, [])


  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      <AnimatePresence mode="wait">
  <motion.div
    key={slides[current].id} // key changes each time
    className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.7 }}
  >
    {slides[current].type === "cta" ? (
      <div
        className={`w-full h-full flex flex-col justify-center items-center text-white px-6 ${slides[current].bgColor}`}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          {slides[current].title}
        </h1>
        <p className="mt-4 text-lg max-w-2xl text-center">
          {slides[current].description}
        </p>
        <Link
          href={slides[current].buttonLink}
          className="mt-6 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          {slides[current].buttonText}
        </Link>
      </div>
    ) : (
      <div className="w-full h-full relative">
        <Image
          src={slides[current].image}
          alt={slides[current].caption || "Slide"}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-6 py-3 rounded-lg">
          {slides[current].caption}
        </div>
      </div>
    )}
  </motion.div>
</AnimatePresence>


      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${
              current === i ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

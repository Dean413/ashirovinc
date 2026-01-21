"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseclient";
import Image from "next/image";
import { ifError } from "assert";

type Product = {
  id: string;
  name: string;
  slug: string;
  image_url: string[];
  brand?: { name: string } | null;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [currentImages, setCurrentImages] = useState<{ [id: number]: number }>({});
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  

  // Fetch from Supabase
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);

      let { data, error } = await supabase.from("products").select("id, name, slug, brand, image_url") .or(`name.ilike.%${query}%,brand.ilike.%${query}%`);

      if (error) {
        console.error("Search error:", error);
      } else {
        setResults(data || []);
      }

      setLoading(false);
    };

    fetchResults();
  }, [query]);


  return (
    <div className="relative w-full md:w-64 flex">
      
      <div className="flex items-center border border-blue-300 rounded-lg px-2 py-1 bg-white">
        {focused && (
          <button onClick={() => {
              setFocused(false);
              setQuery("");
            }}>
            <ArrowLeft size={20} className="text-blue-600" />
          </button>
        )}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          className="flex-1 outline-none px-2 text-gray-700"
        />
        <Search size={15} className="text-blue-600" />
      </div>

      {/* Dropdown results */}
      {focused && query && (
        <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {loading ?
            (
              <p className="px-4 py-2 text-gray-500">Searching...</p>
            ) 
            : 
            results.length > 0 ? 
            (
            results.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                onClick={() => {
                  setFocused(false);
                  setQuery("");
                }}
                className="flex items-center px-4 py-2 hover:bg-blue-100 text-gray-700">
                {item.image_url?.[0] && (
                  <Image 
                    src={item.image_url[0]} 
                    alt={item.name} 
                    width={40} 
                    height={40} 
                    className="mr-2 object-cover rounded"
                  />
                )}
                <span>{item.name}{item.brand ? ` (${item.brand})` : ""}</span>
              </Link>

            ))
            ) 
            : 
            (
            <p className="px-4 py-2 text-gray-500">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}

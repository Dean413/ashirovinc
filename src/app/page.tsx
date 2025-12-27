"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMicrochip, FaMemory, FaHdd, FaDesktop, FaExclamationTriangle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";   // ✅ NEW
import 'react-toastify/dist/ReactToastify.css'; 
import Carousel from "./component/carousel";
import FullPageLoader from "./component/page-reloader";
import { supabase } from "@/lib/supabaseclient";
import { User } from "@supabase/supabase-js";
import { useCart } from "@/context/cartcontext";
import { useRouter } from "next/navigation";

interface ProductUnit {
  id: number;
  product_id: number;
  serial_number: string;
  status: "available" | "sold";
}

interface Product {
  id: number;
  brand: string;
  name: string;
  image_url: string[];
  description?: string;
  price: number;
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  slug: string;
  stock: number;
  category: string;
  condition: string;
  product_units: ProductUnit[]
}




export default function HomePage() {
  const { addToCart, cartItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentImages, setCurrentImages] = useState<{ [id: number]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [user, setUser] = useState<User | null>(null)

  const router = useRouter();


// Get user on mount
useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user);
  });
}, []);

  // Rotate product images
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

 

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select('*')
        .order("created_at", { ascending: false }).neq("type", "SRCAP");

      if (data && !error) setProducts(data as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  

  if (loading || navigating) return <FullPageLoader text="loading..." />;

  // Get unique brands and categories
  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products by selected brand AND category
  const filteredProducts = products.filter((p) => {
    const brandMatch = !selectedBrand || selectedBrand === "All" || p.brand === selectedBrand;
    const categoryMatch = !selectedCategory || selectedCategory === "All" || p.category === selectedCategory;
    return brandMatch && categoryMatch;
  });


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Carousel />
      <section className="px-6 py-8">
  <div className="flex flex-col items-center gap-6">
    {/* All button */}
    <button
      className={`px-4 py-2 rounded-lg font-medium transition ${
        (!selectedBrand && !selectedCategory) || (selectedBrand === "All" && selectedCategory === "All")
          ? "bg-blue-900 text-white"
          : "bg-gray-200 text-gray-700"
      }`}
      onClick={() => {
        setSelectedBrand("All");
        setSelectedCategory("All");
      }}
    >
      All
    </button>

    {/* Dropdowns */}
    <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center">
      

      {/* Category Dropdown */}
      <div className="flex flex-col items-center">
        <label className="font-semibold mb-2" htmlFor="category-select">
          Category
        </label>
        <select
          id="category-select"
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">select</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Dropdown */}
      <div className="flex flex-col items-center">
        <label className="font-semibold mb-2" htmlFor="brand-select">
          Brand
        </label>
        <select
          id="brand-select"
          value={selectedBrand || ""}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">select</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
</section>


        {/*intro*/}
        <section className="py-16 px-6 text-center bg-gradient-to-r from-blue-50 to-blue-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Welcome to Ashirovinc
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Your one-stop shop for affordable, high-quality used laptops and computers
            in Nigeria. Browse our carefully curated selection and find your next device today.
          </p>
        </section>


      {/* Featured Products */}
      <section className="py-10 px-6">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">Products</h2>

        {filteredProducts.length === 0 ? (<p className="text-center text-gray-500">No products found.</p>) : 
          (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredProducts.map((product) => {
              const currentIndex = currentImages[product.id] || 0;
              const currentQuantity = cartItems.find((item) => item.id === product.id)?.quantity ?? 0;

              return (
                <div key={product.id} className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col">
                  {/* Product Image & Link */}
                  <div className="w-full relative h-64 md:h-72 lg:h-96 cursor-pointer" onClick={() => setNavigating(true)}>
                    <Link href={`/products/${product.slug}`}>
                      {product.image_url?.length ? 
                        (
                          <Image
                            src={product.image_url[currentIndex]}
                            alt={product.name}
                            fill sizes="100vw"
                            style={{ objectFit: "cover" }}
                            className="w-full h-full"
                          />
                        ) 
                        : 
                        (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
                        )
                      }
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/products/brand/${encodeURIComponent(product.brand)}` } className="text-gray-500">{product.brand}</Link>
                    <Link href={`/products/${product.slug}`} onClick={() => setNavigating(true)}>
                     
                      <h3 className="text-lg font-semibold text-gray-800 mt-1">{product.name}</h3>
                       <h3 className="text-gray-500 mt-1">{product.condition}</h3>
                      <p className="text-blue-600 font-bold mt-2">₦{product.price?.toLocaleString()}</p>

                      {/* Stock Status */}
                      <div className="mt-1">
                        {product.stock > 20 ? 
                          (
                            <p className="text-gray-500">In Stock</p>
                          ) 
                          : product.stock >= 11 ? 
                          (
                            <p className="text-red-500">Few units left</p>
                          ) : product.stock === 0 ? (
                            <p className="text-red-500">Out of stock</p>
                          ) : (
                            <div className="flex items-center gap-2">
                              <FaExclamationTriangle className="text-red-400" />
                              <p className="text-red-500">{product.stock} units left</p>
                            </div>
                          )
                        }
                      </div>

                      {/* Product Specs */}
                      <div className="flex flex-wrap gap-6 mt-3 text-gray-600 text-sm">
                        {product.processor && (
                          <div className="flex flex-col items-center gap-1">
                            <FaMicrochip className="text-xl" />
                            <span className="text-black font-semibold">{product.processor}</span>
                            <span className="text-xs text-gray-500">Processor</span>
                          </div>
                        )}

                        {product.storage && (
                          <div className="flex flex-col items-center gap-1">
                            <FaHdd className="text-xl" />
                            <span className="text-black font-semibold">{product.storage}</span>
                            <span className="text-xs text-gray-500">Storage</span>
                          </div>
                        )}

                        {product.ram && (
                          <div className="flex flex-col items-center gap-1">
                            <FaMemory className="text-xl" />
                            <span className="text-black font-semibold">{product.ram}</span>
                            <span className="text-xs text-gray-500">RAM</span>
                          </div>
                        )}

                        {product.display && (
                          <div className="flex flex-col items-center gap-1">
                            <FaDesktop className="text-xl" />
                            <span className="text-black font-semibold">{product.display}</span>
                            <span className="text-xs text-gray-500">Display</span>
                          </div>
                        )}
                        
                        
                        
                      </div>
                    </Link>

                    {/* Add to Cart Button */}
                    <button
                  onClick={ async() => {
                    const { data } = await supabase.auth.getUser();
                    const user = data.user;

                    if (!user) {
                      toast.info("Please sign in to add items to your cart.");
                      router.push("/sign-in"); // or /auth/signin
                      return;
                    }

                   

                    
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      quantity: 1,
                      image: product.image_url[0],
                      brand: product.brand,
                      processor: product.processor,
                      ram: product.ram,
                      storage: product.storage,
                      display: product.display,
                      maxStock: product.stock,

                      
                    });

                    

                  
                   

                    // ✅ Show toast
                    toast.success(`${product.name} added to cart!`);
                  }}
                  disabled={currentQuantity >= product.stock}
                  className={`mt-4 px-4 py-2 rounded-lg transition w-full ${
                    currentQuantity >= product.stock
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Add to Cart
                </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  )
}

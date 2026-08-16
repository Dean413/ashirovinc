

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaDesktop,
  FaExclamationTriangle,
  FaFilter,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FullPageLoader from "./component/page-reloader";
import { supabase } from "@/lib/supabaseclient";
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
  authenticity?: string;
  stock: number;
  category: string;
  condition: string;
  product_units: ProductUnit[];
}

const ITEMS_PER_PAGE = 8;

const uniq = (arr: (string | undefined | null)[]) =>
  Array.from(new Set(arr.filter((v): v is string => !!v && v.trim() !== "")));

const CATEGORY_PRIORITY = ["LAPTOPS", "LAPTOP COMPONENTS", "LAPTOP-BAG"];

const getCategoryPriority = (category: string): number => {
  const index = CATEGORY_PRIORITY.indexOf(category.toUpperCase().trim());
  return index === -1 ? CATEGORY_PRIORITY.length : index;
};

const extractStorageType = (storage?: string): string | null => {
  if (!storage) return null;
  if (/ssd/i.test(storage)) return "SSD";
  if (/hdd/i.test(storage)) return "HDD";
  return null;
};

const extractStorageSize = (storage?: string): string | null => {
  if (!storage) return null;
  const match = storage.match(/(\d+(\.\d+)?\s?(GB|TB))/i);
  return match ? match[1].toUpperCase().replace(/\s/g, "") : null;
};

const sizeToGB = (size: string) => {
  const num = parseFloat(size);
  return /TB/i.test(size) ? num * 1024 : num;
};

const conditionBadgeClass = (condition: string) => {
  const c = (condition || "").toLowerCase();
  if (c.includes("brand")) return "bg-emerald-100 text-emerald-700";
  if (c.includes("uk")) return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-700";
};

const cleanProductName = (name: string | undefined) => {
  return name
    ?.replace(/UK-USED|NIGERIAN-USED|BRAND-NEW/gi, "")
    .replace(/\s+-\s+$/, "")
    .trim();
};

function buildPageNumbers(current: number, total: number): (number | string)[] {
  const delta = 1;
  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push("...");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("...");
  if (total > 1) range.push(total);
  return range;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        aria-label="Previous page"
      >
        <FaChevronLeft size={12} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 sm:px-2 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition ${p === currentPage
              ? "bg-blue-900 text-white shadow-sm"
              : "border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        aria-label="Next page"
      >
        <FaChevronRight size={12} />
      </button>
    </div>
  );
}

function ProductCard({
  product,
  imageIndex,
  quantity,
  onNavigate,
  onAddToCart,
}: {
  product: Product;
  imageIndex: number;
  quantity: number;
  onNavigate: () => void;
  onAddToCart: () => void;
}) {
  return (
    <div className="w-full bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="w-full relative h-40 sm:h-56 md:h-64 lg:h-72 cursor-pointer bg-gray-100" onClick={onNavigate}>
        <Link href={`/products/${product.slug}`}>
          {product.image_url?.length ? (
            <Image
              src={product.image_url[imageIndex]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-400">
              No Image
            </div>
          )}
        </Link>

        {product.condition && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${conditionBadgeClass(
              product.condition
            )}`}
          >
            {product.condition}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <Link
          href={`/products/brand/${encodeURIComponent(product.brand)}`}
          className="text-gray-400 text-[11px] uppercase tracking-wide font-medium"
        >
          {product.brand}
        </Link>

        <Link href={`/products/${product.slug}`} onClick={onNavigate}>
          <h3 className="text-sm font-semibold text-gray-800 mt-1 leading-tight min-h-[2.5em]">
            {cleanProductName(product.name)}
          </h3>
          {product.authenticity && (
            <p className="text-gray-500 mt-0.5 text-xs">({product.authenticity})</p>
          )}

          <p className="text-blue-700 font-bold text-base sm:text-lg mt-2">
            ₦{product.price?.toLocaleString()}
          </p>

          <div className="mt-1">
            {product.stock > 20 ? (
              <p className="text-xs text-emerald-600 font-medium">In Stock</p>
            ) : product.stock >= 11 ? (
              <p className="text-xs text-amber-600 font-medium">Few units left</p>
            ) : (
              <div className="flex items-center gap-1">
                <FaExclamationTriangle className="text-red-400" size={11} />
                <p className="text-xs text-red-500 font-medium">{product.stock} units left</p>
              </div>
            )}
          </div>

          <div className="flex mt-3 text-gray-600 text-xs overflow-x-auto no-scrollbar w-full whitespace-nowrap">
            {product.processor && (
              <div className="flex flex-col items-center gap-1 shrink-0 min-w-[68px] sm:min-w-[80px]">
                <FaMicrochip className="text-lg text-gray-400" />
                <span className="text-black font-semibold text-xs whitespace-nowrap">
                  {product.processor.toLowerCase()}
                </span>
                <span className="text-[10px] text-gray-400">Processor</span>
              </div>
            )}
            {product.storage && (
              <div className="flex flex-col items-center gap-1 shrink-0 min-w-[68px] sm:min-w-[80px]">
                <FaHdd className="text-lg text-gray-400" />
                <span className="text-black font-semibold whitespace-nowrap">{product.storage}</span>
                <span className="text-[10px] text-gray-400">Storage</span>
              </div>
            )}
            {product.ram && (
              <div className="flex flex-col items-center gap-1 shrink-0 min-w-[68px] sm:min-w-[80px]">
                <FaMemory className="text-lg text-gray-400" />
                <span className="text-black font-semibold whitespace-nowrap">{product.ram}</span>
                <span className="text-[10px] text-gray-400">RAM</span>
              </div>
            )}
            {product.display && (
              <div className="flex flex-col items-center gap-1 shrink-0 min-w-[68px] sm:min-w-[80px]">
                <FaDesktop className="text-lg text-gray-400" />
                <span className="text-black font-semibold whitespace-nowrap">{product.display}</span>
                <span className="text-[10px] text-gray-400">Display</span>
              </div>
            )}
          </div>
        </Link>

        <button
          onClick={onAddToCart}
          disabled={quantity >= product.stock}
          className={`mt-4 px-3 sm:px-4 py-2 rounded-lg transition w-full text-sm font-medium ${quantity >= product.stock
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-700 text-white hover:bg-blue-800"
            }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

const defaultFilters = {
  category: "All",
  brand: "All",
  ram: "All",
  storageType: "All",
  storageSize: "All",
  condition: "All",
  minPrice: "",
  maxPrice: "",
};

export default function HomePage() {
  const { addToCart, cartItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentImages, setCurrentImages] = useState<{ [id: number]: number }>({});
  const [filters, setFilters] = useState(defaultFilters);
  const [pages, setPages] = useState<{ [category: string]: number }>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();

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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("type", "SERVICEABLE")
        .order("created_at", { ascending: false });

      if (data && !error) setProducts(data as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Reset pagination whenever filters change
  useEffect(() => {
    setPages({});
  }, [filters]);

  const inStockProducts = useMemo(() => products.filter((p) => p.stock > 0), [products]);

  const categories = useMemo(
    () =>
      uniq(inStockProducts.map((p) => p.category)).sort((a, b) => {
        const priorityDiff = getCategoryPriority(a) - getCategoryPriority(b);
        return priorityDiff !== 0 ? priorityDiff : a.localeCompare(b);
      }),
    [inStockProducts]
  );

  const brands = useMemo(() => uniq(inStockProducts.map((p) => p.brand)).sort(), [inStockProducts]);
  const rams = useMemo(() => uniq(inStockProducts.map((p) => p.ram)).sort(), [inStockProducts]);
  const conditions = useMemo(() => uniq(inStockProducts.map((p) => p.condition)).sort(), [inStockProducts]);
  const storageTypes = useMemo(
    () => uniq(inStockProducts.map((p) => extractStorageType(p.storage))),
    [inStockProducts]
  );
  const storageSizes = useMemo(
    () =>
      uniq(inStockProducts.map((p) => extractStorageSize(p.storage))).sort(
        (a, b) => sizeToGB(a) - sizeToGB(b)
      ),
    [inStockProducts]
  );

  const filteredProducts = useMemo(() => {
    return inStockProducts.filter((p) => {
      if (filters.category !== "All" && p.category !== filters.category) return false;
      if (filters.brand !== "All" && p.brand !== filters.brand) return false;
      if (filters.ram !== "All" && p.ram !== filters.ram) return false;
      if (filters.condition !== "All" && p.condition !== filters.condition) return false;
      if (filters.storageType !== "All" && extractStorageType(p.storage) !== filters.storageType) return false;
      if (filters.storageSize !== "All" && extractStorageSize(p.storage) !== filters.storageSize) return false;
      if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
      return true;
    });
  }, [inStockProducts, filters]);

  const groupedProducts = useMemo(() => {
    return categories
      .filter((cat) => filters.category === "All" || cat === filters.category)
      .map((cat) => ({
        category: cat,
        items: filteredProducts.filter((p) => p.category === cat),
      }))
      .filter((g) => g.items.length > 0);
  }, [categories, filteredProducts, filters.category]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters(defaultFilters);

  const activeFilterEntries = Object.entries(filters).filter(
    ([, v]) => v !== "All" && v !== ""
  );

  const handlePageChange = (category: string, page: number) => {
    setPages((prev) => ({ ...prev, [category]: page }));
    document.getElementById(`category-${category}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAddToCart = async (product: Product) => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      toast.info("Please sign in to add items to your cart.");
      router.push("/sign-in");
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

    toast.success(`${product.name} added to cart!`);
  };

  if (loading || navigating) return <FullPageLoader text="loading..." />;

  const selectClass =
    "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToastContainer />

      {/* Hero */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 text-center bg-gradient-to-r from-blue-50 to-blue-100 mt-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to Ashirovinc
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg">
          We sell affordable,
          high-quality laptops and computers in Nigeria. You can sign in with Google
          to manage accounts and orders securely.
        </p>
        <p className="font-bold uppercase mt-2 text-gray-800">We offer free delivery within Abuja</p>
      </section>

      {/* Filters */}
      <section className="px-4 sm:px-6 py-6 sticky top-0 z-20 bg-gray-50/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between sm:hidden mb-3">
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 text-white text-sm font-medium"
            >
              <FaFilter size={12} />
              Filters {activeFilterEntries.length > 0 && `(${activeFilterEntries.length})`}
            </button>
            {activeFilterEntries.length > 0 && (
              <button onClick={clearFilters} className="text-sm text-blue-700 font-medium">
                Clear all
              </button>
            )}
          </div>

          <div className={`${filtersOpen ? "grid" : "hidden"} sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3`}>
            <div>
              <label className="text-xs font-semibold text-gray-500">Category</label>
              <select className={selectClass} value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)}>
                <option value="All">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Brand</label>
              <select className={selectClass} value={filters.brand} onChange={(e) => handleFilterChange("brand", e.target.value)}>
                <option value="All">All</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">RAM</label>
              <select className={selectClass} value={filters.ram} onChange={(e) => handleFilterChange("ram", e.target.value)}>
                <option value="All">All</option>
                {rams.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Storage Type</label>
              <select className={selectClass} value={filters.storageType} onChange={(e) => handleFilterChange("storageType", e.target.value)}>
                <option value="All">All</option>
                {storageTypes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Storage Size</label>
              <select className={selectClass} value={filters.storageSize} onChange={(e) => handleFilterChange("storageSize", e.target.value)}>
                <option value="All">All</option>
                {storageSizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Condition</label>
              <select className={selectClass} value={filters.condition} onChange={(e) => handleFilterChange("condition", e.target.value)}>
                <option value="All">All</option>
                {conditions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Price Range (₦)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className={selectClass}
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className={selectClass}
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                />
              </div>
            </div>
          </div>

          {activeFilterEntries.length > 0 && (
            <div className="hidden sm:flex flex-wrap items-center gap-2 mt-4">
              {activeFilterEntries.map(([key, value]) => (
                <span
                  key={key}
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
                >
                  {value}
                  <FaTimes
                    className="cursor-pointer"
                    size={10}
                    onClick={() => handleFilterChange(key as keyof typeof filters, key === "minPrice" || key === "maxPrice" ? "" : "All")}
                  />
                </span>
              ))}
              <button onClick={clearFilters} className="text-xs text-blue-700 font-semibold underline ml-1">
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Product Sections */}
      <section className="py-10 px-4 sm:px-6 max-w-[1400px] mx-auto w-full">
        {groupedProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No products found.</p>
        ) : (
          groupedProducts.map((group) => {
            const page = pages[group.category] || 1;
            const totalPages = Math.ceil(group.items.length / ITEMS_PER_PAGE);
            const pageItems = group.items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

            return (
              <div key={group.category} id={`category-${group.category}`} className="mb-14 scroll-mt-40">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{group.category}</h2>
                  <span className="text-xs sm:text-sm font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                    {group.items.length} {group.items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {pageItems.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      imageIndex={currentImages[product.id] || 0}
                      quantity={cartItems.find((item) => item.id === product.id)?.quantity ?? 0}
                      onNavigate={() => setNavigating(true)}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => handlePageChange(group.category, p)}
                />
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
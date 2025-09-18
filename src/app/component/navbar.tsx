"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaUser,
  FaUserCheck,
} from "react-icons/fa";
import SearchBar from "./search-bar";
import { useCart } from "@/context/cartcontext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";

const getInitials = (user: any) => {
  const fullName = user.user_metadata?.full_name;

  if (fullName) {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return user.email ? user.email.slice(0, 2).toUpperCase() : "?";
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { getTotalItems } = useCart();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const handleSignOut = async () =>{
        clearCart()
        await supabase.auth.signOut()
        router.push("/sign-in")
        
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const isDashboard = pathname?.startsWith("/dashboard/client-dashboard");

  return (
    <>
      {/* Top Header */}
      <header className="bg-blue-950 text-white py-2 px-4 sticky top-0 z-50">
  <div className="relative max-w-7xl mx-auto flex items-center justify-end gap-4 text-xs md:text-sm">
    {/* Centered text */}
    <span className="absolute left-[30%] md:left-1/2 transform -translate-x-1/2 font-semibold">
      WELCOME TO ASHIROV TECHNOLOGY
    </span>

    {/* Right side */}
    <div className="flex items-center gap-3">
      <FaFacebook className="hover:text-gray-300 transition" />
      <FaTwitter className="hover:text-gray-300 transition" />
      <FaInstagram className="hover:text-gray-300 transition" />
      <FaWhatsapp className="hover:text-gray-300 transition" />
    </div>
  </div>
</header>



      {/* Main Navbar */}
      <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-7.5 z-50">
        <div className="container mx-auto flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-1 justify-center md:justify-start">
            <Image src="/company-logo.jpg" alt="logo" width={50} height={50} />
          </Link>

          {/* Dashboard Menu */}
          {isDashboard && user ? (
            <ul className="hidden md:flex items-center justify-center flex-1 space-x-6 text-gray-700 font-medium">
              <li>
                <Link href="/dashboard/client-dashboard/orders" className="hover:text-blue-700 transition">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/dashboard/client-dashboard/settings" className="hover:text-blue-700 transition">
                  Settings
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-blue-700 transition">
                  Shop
                </Link>
              </li>
              <li>
                <button
                  onClick={async () => {
                    clearCart()
                    await supabase.auth.signOut();
                    router.push("/sign-in");
                  }}
                  className="text-red-600 hover:text-red-400 transition"
                >
                  Sign Out
                </button>
              </li>
              {user && (
                <li>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold cursor-pointer shadow-md">
                    {getInitials(user)}
                  </div>
                </li>
              )}
            </ul>
          ) : (
            // Normal Menu
           <ul className="hidden md:flex items-center space-x-6 text-gray-700 font-medium absolute left-1/2 transform -translate-x-1/2">
  <li>
    <Link href="/products" className="hover:text-blue-700 transition">Home</Link>
  </li>
  <li>
    <Link href="/about" className="hover:text-blue-700 transition">About</Link>
  </li>
  <li>
    <Link href="/contact" className="hover:text-blue-700 transition">Contact</Link>
  </li>

   <li>
    <Link href="/products" className="hover:text-blue-700 transition">Shop</Link>
  </li>
</ul>

          )}

          {/* User icon for non-dashboard */}
          {!isDashboard && (
            <Link
              href={user ? "/dashboard/client-dashboard" : "/sign-in"}
              className="hidden md:flex items-center space-x-2 ml-4"
            >
              {user ? (
                <FaUserCheck size={24} className="text-blue-900" />
              ) : (
                <FaUser size={24} className="text-blue-900" />
              )}
              <SearchBar />
            </Link>
          )}

          {/* Cart Icon */}
          {!isDashboard && (
            <Link href="/cart" className="relative ml-4">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-900 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-72 bg-blue-900 p-6 text-white z-50 shadow-lg flex flex-col space-y-6"
            >
              <button
                onClick={() => setOpen(false)}
                className="self-end text-white focus:outline-none"
              >
                <X size={28} />
              </button>

              <div className="flex items-center rounded-lg mb-6">
                <SearchBar />
              </div>

              <ul className="space-y-4 text-lg font-medium">
                {isDashboard && user ? (
                  <>
                    <li>
                      <Link
                        href="/dashboard/client-dashboard/orders"
                        onClick={() => setOpen(false)}
                        className="hover:text-gray-300 transition"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/client-dashboard/settings"
                        onClick={() => setOpen(false)}
                        className="hover:text-gray-300 transition"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link href="/products" onClick={() => setOpen(false)} className="hover:text-gray-300 transition">
                        Shop
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          clearCart()
                          router.push("/sign-in");
                          setOpen(false);
                        }}
                        className="rounded-full bg-white text-red-400 p-2 w-[80%] mx-auto text-center transition"
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/" onClick={() => setOpen(false)} className="hover:text-gray-300 transition">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop" onClick={() => setOpen(false)} className="hover:text-gray-300 transition">
                        Shop
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" onClick={() => setOpen(false)} className="hover:text-gray-300 transition">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" onClick={() => setOpen(false)} className="hover:text-gray-300 transition">
                        Contact
                      </Link>
                    </li>
                    <div className="rounded-full bg-white text-blue-900 p-2 w-[80%] mx-auto text-center font-bold">
    <Link href={user ? "/dashboard/client-dashboard" : "/sign-in"}>
      {user ? "Account" : "Sign In"}
    </Link>
  </div>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

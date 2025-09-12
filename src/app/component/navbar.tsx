"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaUser, FaUserCheck } from "react-icons/fa";
import SearchBar from "./search-bar";
import { useCart } from "@/context/cartcontext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";

const getInitials = (user: any) => {
  const fullName = user.user_metadata?.full_name;
  if (fullName) {
    const parts = fullName.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
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

  const isDashboard = pathname?.startsWith("/dashboard/client-dashboard");

  // Fetch user & listen to auth changes
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  return (
    <>
      {/* Top header */}
      <header className="bg-blue-950 text-white py-2 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs md:text-sm">
          <span className="absolute left-1/2 transform -translate-x-1/2 font-semibold">WELCOME TO ASHIROV TECHNOLOGY</span>
          <div className="ml-auto hidden md:flex gap-3 items-center">
            <a href="tel:+2347039752831">+2347039752831</a>
            <FaFacebook />
            <FaTwitter />
            <FaInstagram />
            <FaWhatsapp />
          </div>
        </div>
      </header>

      {/* Main Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center w-full max-w-7xl mx-auto justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden focus:outline-none"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/company-logo.jpg" alt="Logo" width={50} height={50} />
            <span className="font-bold text-lg text-blue-900">Ashirov</span>
          </Link>

          {/* Links */}
          <ul className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
            {isDashboard && user ? (
              <>
                <li><Link href="/dashboard/client-dashboard/orders">Orders</Link></li>
                <li><Link href="/dashboard/client-dashboard/settings">Settings</Link></li>
                <li><Link href="/shop">Shop</Link></li>
              </>
            ) : (
              <>
                <li><Link href="/products">Home</Link></li>
                <li><Link href="/shop">Shop</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </>
            )}
          </ul>

          {/* Right actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            {!isDashboard && <SearchBar />}

            {/* Cart */}
            {!isDashboard && (
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-900 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            )}

            {/* User Avatar / Login */}
            {user ? (
              <div
                onClick={() => router.push("/dashboard/client-dashboard")}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold cursor-pointer"
              >
                {getInitials(user)}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
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

              <SearchBar />

              <ul className="space-y-4 text-lg font-medium">
                {isDashboard && user ? (
                  <>
                    <li><Link href="/dashboard/client-dashboard/orders" onClick={() => setOpen(false)}>Orders</Link></li>
                    <li><Link href="/dashboard/client-dashboard/settings" onClick={() => setOpen(false)}>Settings</Link></li>
                    <li><Link href="/shop" onClick={() => setOpen(false)}>Shop</Link></li>
                    <li>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          router.push("/sign-in");
                          setOpen(false);
                        }}
                        className="text-red-400"
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><Link href="/" onClick={() => setOpen(false)}>Home</Link></li>
                    <li><Link href="/shop" onClick={() => setOpen(false)}>Shop</Link></li>
                    <li><Link href="/about" onClick={() => setOpen(false)}>About</Link></li>
                    <li><Link href="/contact" onClick={() => setOpen(false)}>Contact</Link></li>
                    <li className="mt-6 bg-white text-blue-900 rounded-full p-2 text-center font-bold">
                      <Link href={user ? "/dashboard/client-dashboard" : "/sign-in"}>
                        {user ? "Account" : "Sign In"}
                      </Link>
                    </li>
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

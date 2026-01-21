"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaUser, FaUserCheck, FaTiktok } from "react-icons/fa";
import SearchBar from "./search-bar";
import { useCart } from "@/context/cartcontext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";
import {Typewriter} from "react-simple-typewriter"
import { supabase } from "@/lib/supabaseclient";

const getInitials = (user: any) => {
  const fullName = user.user_metadata?.full_name;
  if (fullName) {
    const parts = fullName.trim().split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return user.email ? user.email.slice(0, 2).toUpperCase() : "?";
};

const getAvatarOrInitials = (user: any) => user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { getTotalItems, clearCart } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const isDashboard = pathname?.startsWith("/dashboard/client-dashboard");

  // ✅ Detect click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [open]);


  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null)
    );

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    clearCart();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      {/* Top Header */}
      <header className="bg-blue-950 text-white py-2 px-4 sticky top-0 z-50">
        <div className="relative max-w-7xl mx-auto flex items-center justify-end gap-4 text-xs md:text-sm">
          <span className="absolute left-[30%] md:left-1/2 transform -translate-x-1/2 font-semibold">
         <Typewriter
          words={[
            'Welcome to Ashirov Inc',
            'Affordable Quality Laptops in Nigeria',
            'Your Trusted Source for UK-Used Computers',
            'Get the Best Deals on Reliable Tech',
            'Shop Smart, Work Faster with Ashirov Inc',
          ]}
          loop={false}
          cursor
          cursorStyle="|"
          typeSpeed={50}
          deleteSpeed={50}
          delaySpeed={2000}
        />

       

          </span>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/share/17XYXACYee/" target="_blank" className="hover:text-blue-400"><FaFacebook /></a>          
            <a href="https://www.tiktok.com/@ashirov_inc_" target="_blank"  className="hover:text-black"><FaTiktok /></a>
            <a href="https://x.com/ASHirov_inc_?t=zgCQtUsVgTbFi-FcQZ99AA&s=09" target="_blank" className="hover:text-blue-600"><FaTwitter /></a>          
            <a href="https://www.instagram.com/ashirov_inc_?igsh=MTUxN2lzcmp3a2hu" target="_blank" className="hover:text-red-500"><FaInstagram /></a>         
            <a href="https://wa.me/2348156959605?text=Hello%2C%20I%20saw%20your%20website%20and%20wanted%20to%20chat!" target="_blank" className="hover:text-green-500"><FaWhatsapp /></a>                   
          </div>
        </div>
      </header>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md px-6 flex items-center justify-between sticky top-7 z-50">
        <div className="container mx-auto flex items-center justify-between">
          {/* Mobile Menu Button */}
          { <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none">{open ? <X size={28} /> : <Menu size={28} />}</button> }

          {/* Logo */}
          <Link href="/" className="flex flex-1 justify-center md:justify-start">
            <Image src="/company-logo.png" alt="logo" width={150} height={100} style={{ width: "200px", height: "auto" }} />
          </Link>

          {/* Menu */}
          {isDashboard && user ? (
            <ul className="hidden md:flex items-center justify-center flex-1 space-x-6 text-gray-700 font-medium">
              <li>
                <Link href="/dashboard/client-dashboard" className="hover:text-blue-700 transition">Orders</Link>
              </li>
              <li>
                <Link href="/dashboard/client-dashboard/settings" className="hover:text-blue-700 transition">Settings</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-blue-700 transition">Shop</Link>
              </li>
              <li>
                <button onClick={signOut} className="text-red-600 hover:text-red-400 transition cursor-pointer">Sign Out</button>
              </li>

              {/* Admin Dashboard Link */}
              {user?.user_metadata?.role === "admin" && (
                <Link href="/dashboard/admin" className="font-semibold">Admin Dashboard</Link>
              )}

              <li>
                <Link href="/dashboard/client-dashboard/settings">
                  {getAvatarOrInitials(user) ? 
                  (
                    <Image
                      src={getAvatarOrInitials(user)}
                      alt="Profile picture"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover shadow-md"
                    />
                  ) 
                  
                  : 
                  
                  (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold cursor-pointer shadow-md">
                      {getInitials(user)}
                    </div>
                  )}
                </Link>
              </li>
            </ul>
          ) 
          
          : 
          
          (
            <ul className="hidden md:flex items-center space-x-6 text-gray-700 font-medium absolute left-1/2 transform -translate-x-1/2">
              <li>
                <Link href="/" className="hover:text-blue-700 transition">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-700 transition">About</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-700 transition">Contact</Link>
              </li>
              <li>
                <Link href="/book-repair" className="hover:text-blue-700 transition">Book a Repair</Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-blue-700 transition"></Link>
              </li> 
            </ul>
          )}

          {/* User icon for non-dashboard */}
           {!isDashboard && (
            <>
            <Link href={user ? "/dashboard/client-dashboard" : "/sign-in"} className="hidden md:flex items-center space-x-4 ml-4">
              {user ? 
              <FaUserCheck size={24} className="text-blue-900 mr-2" /> 
              : 
              <FaUser size={24} className="text-blue-900 mr-2" />}
            </Link>
            <div className="hidden md:flex">
              <SearchBar />
            </div>
            {/* <SearchBar /> */}
            </>
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
              ref={sidebarRef}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-72 bg-blue-900 p-6 text-white z-50 shadow-lg flex flex-col space-y-6"
            >
              { <button onClick={() => setOpen(false)} className="self-end text-white focus:outline-none">
                <X size={28} />
              </button>}

             
               <SearchBar />
              

              {<ul className="space-y-4 text-lg font-medium">
                {isDashboard && user ? (
                  <>
                    <li>
                      <Link href="/dashboard/client-dashboard/orders" onClick={() => setOpen(false)} className="hover:text-gray-300 transition">Orders</Link>
                    </li>
                    <li>
                      <Link href="/dashboard/client-dashboard/settings" onClick={() => setOpen(false)} className="hover:text-gray-300 transition">Settings</Link>
                    </li>
                    <li>
                      <Link href="/" onClick={() => setOpen(false)} className="hover:text-gray-300 transition"> Shop</Link>
                     
                    </li>
                    <li>
                      <button onClick={signOut} className="rounded-full bg-white text-red-400 p-2 w-[80%] mx-auto text-center transition">Sign Out</button>
                    </li>
                  </>
                ) 
                
                : 
                
                (
                  <>
                  
                    <li>
                      <Link href="/" onClick={() => setOpen(false)} className="hover:text-gray-300 transition"> Home</Link>
                    </li>
                  
                    <li>
                      <Link href="/about" onClick={() => setOpen(false)} className="hover:text-gray-300 transition">About</Link>
                    </li>
                    <li>
                      <Link href="/contact" onClick={() => setOpen(false)} className="hover:text-gray-300 transition">Contact</Link>
                       
                    </li>
                     <li>
                      <Link href="/book-repair" onClick={() => setOpen(false)} className="hover:text-gray-300 transition">Book a Repair</Link>
                    </li>
                    <div className="rounded-full bg-white text-blue-900 p-2 w-[80%] mx-auto text-center font-bold">
                      <Link href={user ? "/dashboard/client-dashboard" : "/sign-in"}>
                        {user ? "Account" : "Sign In"}
                      </Link>
                    </div>
                  </>
                )}
              </ul>}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingCart, X, Search, SearchIcon, Contact, Contact2Icon, ContactIcon, ContactRound, UserCheck } from "lucide-react"; // icons
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaUserCheck, FaUser, FaUserAlt } from "react-icons/fa";
import SearchBar from "./search-bar";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
   <header className="bg-blue-950 text-white py-2 px-4">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    
    {/* Centered title */}
    <h1 className="text-sm text-center flex-1">
      WELCOME TO ASHIROV TECHNOLOGY
    </h1>

    {/* Contact & socials */}
    <div className="hidden md:flex gap-3 w-24 text-sm items-center">
      <a href="tel:+2347039752831">+2347039752831</a>
      <a href="#" className="hover:text-gray-300"><FaFacebook /></a>
      <a href="#" className="hover:text-gray-300"><FaTwitter /></a>
      <a href="#" className="hover:text-gray-300"><FaInstagram /></a>
      <a href="#" className="hover:text-gray-300"><FaWhatsapp /></a>
    </div>
  </div>
</header>


    
    <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <div className="container mx-auto flex items-center justify-between p-4">
         {/*menu icon*/}
         <button onClick={() => setOpen(!open)} className="md:hidden focus:outline-none">{open ? <X size={28} /> : <Menu size={28} />}</button>

        {/* Logo */}
        <Link href="/" className="flex flex-1 justify-center md:justify-start">
          <Image
            src="/company-logo.jpg"
            alt="company-logo"
            width={50}
            height={50}
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex justify-center flex-3 space-x-6 text-gray-700 font-medium">
          <li><Link href="/products">Home</Link></li>
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>

        

        {/* Search Bar (visible only on md and up) */}
        
        <div className="hidden md:flex items-center space-x-2 mr-4">
          <FaUserAlt size={24} className="text-blue-900"/>
          <SearchBar />

          
          
        </div>

        {/* Cart */}
        
        <Link href="/cart" className="relative ml-">
            
          <ShoppingCart className="h-6 w-6 text-blue-600" />
          <span className="absolute -top-2 -right-2 bg-blue-900 text-white text-xs px-1.5 py-0.5 rounded-full">
            0
          </span>
             
        </Link>

        

        {/* Mobile Menu Button */}
       
      </div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-full w-72 bg-blue-900 p-6 text-white z-50 shadow-lg flex flex-col space-y-6"
          >
            {/* Close Button inside Sidebar */}
            <button
              onClick={() => setOpen(false)}
              className="self-end text-white focus:outline-none"
            >
              <X size={28} />
            </button>

            {/* Search Bar (for mobile) */}
            <div className="flex items-center rounded-lg">
              <SearchBar />
              
            </div>

            {/* Menu Links */}
            <ul className="space-y-4 text-lg font-medium">
              <li><Link href="/" onClick={() => setOpen(false)}>Home</Link></li>
              <li><Link href="/shop" onClick={() => setOpen(false)}>Shop</Link></li>
              <li><Link href="/about" onClick={() => setOpen(false)}>About</Link></li>
              <li><Link href="/contact" onClick={() => setOpen(false)}>Contact</Link></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
}

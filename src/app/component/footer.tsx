"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo / About */}
        <div>
          
          <Link href="/" className="flex flex-1 justify-center md:justify-start">
            <Image src="/company-logo.png" alt="logo" width={150} height={150} style={{ width: "200px", height: "auto" }} />
          </Link>
          
          <p className="mt-4 text-sm text-gray-200">
            Affordable laptops and gadgets at unbeatable prices.
            Trusted by thousands across Nigeria.
          </p>
        </div>

        {/* Quick Links */}
        { <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-200">
            {/* <li><Link href="/products" className="hover:text-white">Products</Link></li> */}
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/book-repair" className="hover:text-white">Book a repair</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div> }

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
          <ul className="space-y-2 text-gray-200">
            <li><Link href="/returns-policy" className="hover:text-white">Returns Policy</Link></li>
            <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact & Socials */}
         <div>
          <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
          <p className="text-gray-200">📍 Abuja, Nigeria</p>
          <p className="text-gray-200">📧 support@ashirovinc.com</p>
          <p className="text-gray-200">📞 234 815 695 9605</p>

          <div className="flex gap-4 mt-4 text-2xl">
            <a href="https://www.facebook.com/share/17XYXACYee/" target="_blank" className="hover:text-blue-400"><FaFacebook /></a>
            <a href="https://www.tiktok.com/@ashirov_inc_" target="_blank"  className="hover:text-black"><FaTiktok /></a>
            <a href="https://x.com/ASHirov_inc_?t=zgCQtUsVgTbFi-FcQZ99AA&s=09" target="_blank" className="hover:text-blue-600"><FaTwitter /></a>
            <a href="https://www.instagram.com/ashirov_inc_?igsh=MTUxN2lzcmp3a2hu" target="_blank" className="hover:text-red-500"><FaInstagram /></a>
            <a href="https://wa.me/2348156959605?text=Hello%2C%20I%20saw%20your%20website%20and%20wanted%20to%20chat!" target="_blank" className="hover:text-green-500"><FaWhatsapp /></a>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-10 border-t border-gray-400 pt-6 text-center text-gray-300 text-sm">
        © {new Date().getFullYear()} AshirovInc. All rights reserved.
      </div>
    </footer>
  );
}

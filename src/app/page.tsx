"use client";
import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

export default function ComingSoon() {
 const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2025-10-22T00:00:00")
    targetDate.setDate(targetDate.getDate());

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white text-center px-6">
      <h1 className="text-5xl font-bold mb-4">
        {
            isMobile ? (
            <>
            Coming Soon <br /> <span>🚧</span>
            </>
           
          ) : ("🚧 Coming Soon🚧")
        
          
        }
        
        </h1>
      <p className="text-lg mb-6">
        Our online store is under construction. We’re launching soon!
      </p>

      {/* Countdown Timer */}
      <div className="flex space-x-4 text-2xl font-mono mb-8">
        <div>
          <span className="block text-4xl font-bold">{timeLeft.days}</span>
          <span className="text-sm">Days</span>
        </div>
        <div>
          <span className="block text-4xl font-bold">{timeLeft.hours}</span>
          <span className="text-sm">Hours</span>
        </div>
        <div>
          <span className="block text-4xl font-bold">{timeLeft.minutes}</span>
          <span className="text-sm">Minutes</span>
        </div>
        <div>
          <span className="block text-4xl font-bold">{timeLeft.seconds}</span>
          <span className="text-sm">Seconds</span>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex space-x-6">
        <a href="https://facebook.com" target="_blank" className="hover:text-blue-300">
          <FaFacebook size={30} />
        </a>
        <a href="https://twitter.com" target="_blank" className="hover:text-blue-300">
          <FaTwitter size={30} />
        </a>
        <a href="https://instagram.com" target="_blank" className="hover:text-pink-400">
          <FaInstagram size={30} />
        </a>
        <a  href="https://wa.me/2348062319098"  rel="noopener noreferrer" target="_blank" className="hover:text-blue-400">
          <FaWhatsapp size={30} />
        </a>

      
      </div>

      <p className="mt-8 text-sm opacity-80">
        © {new Date().getFullYear()} Ashirovinc. All Rights Reserved.
      </p>
    </div>
  );
}
 
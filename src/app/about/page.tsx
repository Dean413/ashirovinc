"use client";
import React from "react";
import { Cpu, Package, Users } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-gray-50">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600  bg-clip-text">
        💻 About Ashirovinc
      </h1>

      {/* Intro */}
      <div className="space-y-6 text-gray-700 text-lg max-w-4xl mx-auto leading-relaxed">
        <p>
          <strong>Ashirovinc – Affordable Quality Laptops in Nigeria</strong>
        </p>
        <p>At Ashirov Technology, we don’t just sell tech. We make technology work better for you. Whether you are a business aiming to grow or an individual seeking reliable tools, we guide you  through the often confusing world of technology with clarity and care.
        </p>
        <p>
          We provide affordable, reliable, and high-quality UK/US fairly used laptops
          and computers for students, professionals, and businesses.
        </p>
        

        <p>
          <strong>What makes us different</strong>
        </p>

        <p>We listen first, then solve. By understanding your unique needs, we provide solutions that fit your situation.</p>

        <p>As Nigeria’s trusted technology partner, we specialize in laptops and everything that comes with them. From quality laptop sales to professional installations and reliable repair services, we deliver at fair prices. When you work with us, you get honest advice, expert service, and lasting support.
        </p>

        <p><strong>Misson</strong></p>
        <p>Our mission is simple: to solve real problems with technology that makes life and business better.</p>
        <p><strong>Goals</strong></p>
        <p>
          Our goal is simple: deliver quality devices at the best prices, build trust
          with every customer, and make technology accessible to everyone.
        </p>

        <p><strong>Values</strong></p>
        <p>Our values guide everything we do. We are built on trust and honesty, always telling you exactly what you need and nothing more. We are passionate about excellence, constantly improving how we serve you to ensure the best results. We also believe in simplicity, making laptop ownership easy from purchase to repair. These principles shape our work and define us as your reliable technology partner.</p>
        <p>At Ashirovinc, you don’t just buy a laptop, you buy peace of mind.</p>
      </div>

      {/* Image Cards Section */}
      <h2 className="text-3xl font-bold text-gray-800 mt-16 mb-6 text-center">
        Our Operations
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            {/* Placeholder for actual image */}
            <span className="text-gray-400 text-xl">Image of systems being repaired</span>
          </div>
          <div className="p-5">
            <Cpu className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-lg mb-2">Repairs & Maintenance</h3>
            <p className="text-gray-600 text-sm">
              All laptops are tested, repaired if needed, and certified before sale.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xl">Image of shipping/packaging</span>
          </div>
          <div className="p-5">
            <Package className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-lg mb-2">Packaging & Delivery</h3>
            <p className="text-gray-600 text-sm">
              Devices are securely packaged and shipped nationwide with tracking.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xl">Image of happy customers</span>
          </div>
          <div className="p-5">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-lg mb-2">Customer Satisfaction</h3>
            <p className="text-gray-600 text-sm">
              We prioritize trust and support, ensuring every customer is happy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

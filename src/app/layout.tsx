"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./component/navbar";
import Footer from "./component/footer";
import { CartProvider } from "@/context/cartcontext";
import { AuthProvider, useAuth } from "./authprovider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}

// Wrapper to connect auth user with CartProvider
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useAuth();

  // Wait for Supabase to finish checking the session
  if (!isLoaded) {
    console.log("⏳ Waiting for auth session...");
    return null; // or a spinner/placeholder
  }

  console.log("✅ Auth ready. userId =", user?.id);

  return (
    <CartProvider userId={user?.id}>
      <Navbar />
      {children}
      <Footer />
    </CartProvider>
  );
}


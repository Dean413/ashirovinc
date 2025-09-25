"use client";

import Navbar from "./component/navbar";
import Footer from "./component/footer";
import { CartProvider } from "@/context/cartcontext";
import { AuthProvider, useAuth } from "./authprovider";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useAuth();
  if (!isLoaded) return null;
  return (
    <CartProvider userId={user?.id}>
      <Navbar />
      {children}
      <Footer />
    </CartProvider>
  );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </AuthProvider>
  );
}

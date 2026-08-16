// "use client";
// import { createContext, useContext, useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseclient";

// type AuthContextType = { user: any; isLoaded: boolean; };
// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

//   const [user, setUser] = useState<any>(null);
//   const [isLoaded, setIsLoaded] = useState(false)
//   useEffect(() => {
//     // 🔹 1. Check what we get on first mount
//     supabase.auth.getSession().then(({ data }) => {
//       setUser(data.session?.user ?? null);
//       setIsLoaded(true);
//     });

//     // 🔹 2. Log every auth state change
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         setUser(session?.user ?? null);
//         setIsLoaded(true);
//       }
//     );

//     return () => authListener.subscription.unsubscribe();
//   }, [supabase]);


//   return (
//     <AuthContext.Provider value={{ user, isLoaded }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// };


"use client";

import { useEffect } from "react";
import { useAuthStore } from "./authStore/authStore";

// Kicks off the ONE Supabase auth listener for the whole app.
// Everything else reads state from the store — no other file needs
// its own getUser()/getSession()/onAuthStateChange() call.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return <>{children}</>;
};

// Compatibility hook — existing components that already call `useAuth()`
// (navbar, homepage, etc.) keep working unchanged, now backed by Zustand.
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isLoaded = useAuthStore((s) => s.isLoaded);
  return { user, isLoaded };
};
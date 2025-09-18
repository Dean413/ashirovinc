"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type AuthContextType = { user: any; isLoaded: boolean; };
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    // Load current session on first mount
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setIsLoaded(true)
    });

    // Listen for sign-in/sign-out changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoaded(true)
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

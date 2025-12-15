"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FullPageLoader from "@/app/component/page-reloader";
import { supabase } from "@/lib/supabaseclient";

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleSession = async () => {
      // Get the current session
      const { data, error } = await supabase.auth.getSession();

      if (data.session) {
        setLoading(false)
        // ✅ User is logged in → redirect to dashboard
        router.push("/");
      } else {
        // ❌ Not logged in → back to sign-in
        router.push("/sign-in");
      }
    };

    handleSession();
  }, [router, supabase]);

 if(loading) return <FullPageLoader text="signing in...."/>
}

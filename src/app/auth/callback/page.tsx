"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleSession = async () => {
      // Get the current session
      const { data, error } = await supabase.auth.getSession();

      if (data.session) {
        // ✅ User is logged in → redirect to dashboard
        router.push("/dashboard/client-dashboard");
      } else {
        // ❌ Not logged in → back to sign-in
        router.push("/sign-in");
      }
    };

    handleSession();
  }, [router, supabase]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Signing you in...</p>
    </div>
  );
}

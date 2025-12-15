// lib/supabaseClient.ts
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { createBrowserClient } from "@supabase/ssr";


// This automatically uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
)



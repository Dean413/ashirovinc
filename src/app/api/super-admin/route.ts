import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using Service Role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    return NextResponse.json({ users: data.users });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ users: [], error: err.message });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) throw new Error("User ID required");

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role: "admin" },
    });

    if (error) throw error;
    return NextResponse.json({ success: true, user: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message });
  }
}

import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { product_id, quantity } = await request.json();

  // Get current user from session cookie
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Upsert one row per user/product
  const { error } = await supabase
    .from("cart")
    .upsert(
      { user_id: user.id, product_id: product_id, quantity },
      { onConflict: "user_id, product_id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { product_id } = await request.json();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    // 🚨 Stop here before hitting the database
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", product_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

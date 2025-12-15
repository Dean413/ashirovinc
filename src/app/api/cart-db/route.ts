// src/app/api/cart-db/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies(); // ✅ await

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll(); // ✅ now works
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options) // ✅ now works
            );
          },
        },
      }
    );

    const { product_id, quantity } = await request.json();

    const { data: { session }, error: sessErr } = await supabase.auth.getSession();

    if (sessErr || !session)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const userId = session.user.id;

    const { error } = await supabase
      .from("cart")
      .upsert({ user_id: userId, product_id, quantity }, { onConflict: "user_id,product_id" });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/cart-db error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { product_id } = await request.json();

    const { data: { session }, error: sessErr } =
      await supabase.auth.getSession();

    if (sessErr || !session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", product_id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/cart-db error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

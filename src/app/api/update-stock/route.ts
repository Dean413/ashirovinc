import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { items } = await req.json(); // match the body shape
    console.log("Items received:", items);

    for (const item of items) {
      const { error } = await supabase.rpc("decrement_stock", {
        product_id: item.id,
        qty: item.quantity,
      });

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ success: false, error }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Server error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


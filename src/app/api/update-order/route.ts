import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const {cartItems, orderId, reference, status } = await req.json();

  const { error } = await supabase
    .from("orders")
    .update({ reference, status })
    .eq("id", orderId);

     // 3. Update stock using RPC
    for (const item of cartItems) {
      const { error: stockError } = await supabase.rpc("decrement_stock", {
        product_id: item.id,
        qty: item.quantity,
      });

      if (stockError) throw stockError;
    }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

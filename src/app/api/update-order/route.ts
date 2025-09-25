import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const {cartItems, orderId, reference, status } = await req.json();

  // 1. Update stock first
for (const item of cartItems) {
  const { error: stockError } = await supabaseAdmin.rpc("decrement_stock", {
    product_id: item.id,
    qty: item.quantity,
  });
  if (stockError) return NextResponse.json({ error: stockError.message }, { status: 400 });
}




// 2. Update order reference & status
const { error } = await supabaseAdmin
  .from("orders")
  .update({ reference, status })
  .eq("id", orderId);

if (error) {
  return NextResponse.json({ error: error.message }, { status: 400 });
}

return NextResponse.json({ success: true });
}

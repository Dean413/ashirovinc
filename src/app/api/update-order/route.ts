import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const {cartItems, orderId, reference, status } = await req.json();

  // 1. Update stock first
for (const item of cartItems) {
  const { error: stockError } = await supabase.rpc("decrement_stock", {
    product_id: item.id,
    qty: item.quantity,
  });
  console.log("Decrement stock for", item.id, item.quantity, "error:", stockError);
  if (stockError) return NextResponse.json({ error: stockError.message }, { status: 400 });
}




// 2. Update order reference & status
const { error } = await supabase
  .from("orders")
  .update({ reference, status })
  .eq("id", orderId);

if (error) {
  return NextResponse.json({ error: error.message }, { status: 400 });
}

return NextResponse.json({ success: true });
}

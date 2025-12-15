import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { cartItems, orderId, reference, status, userId } = await req.json();

  // 1. Decrement stock and mark units sold
  for (const item of cartItems) {
    const { error: stockError } = await supabaseAdmin.rpc("decrement_stock", {
      product_id: item.id,
      qty: item.quantity,
    });

    if (stockError) {
      return NextResponse.json({ error: stockError.message }, { status: 400 });
    }

    // Fetch available units
    const { data: units, error: fetchError } = await supabaseAdmin
      .from("product_units")
      .select("id")
      .eq("product_id", item.id)
      .eq("status", "available")
      .limit(item.quantity);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 });
    }

    if (!units || units.length < item.quantity) {
      return NextResponse.json(
        { error: "Not enough product units available" },
        { status: 400 }
      );
    }

    const unitIds = units.map((u) => u.id);

    // Mark units as sold
    const { error: markError } = await supabaseAdmin
      .from("product_units")
      .update({ status: "sold" })
      .in("id", unitIds);

    if (markError) {
      return NextResponse.json({ error: markError.message }, { status: 400 });
    }
  }

  // 2. Update the order
  const { error: orderError } = await supabaseAdmin
    .from("orders")
    .update({ reference, status })
    .eq("id", orderId);

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 400 });
  }

  // 3. Clear the user's cart
  const { error: clearError } = await supabaseAdmin
    .from("cart")
    .delete()
    .eq("user_id", userId);

  if (clearError) {
    return NextResponse.json(
      { error: "Order completed but cart clearing failed: " + clearError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { cartItems, orderId, reference, status } = await req.json();

  // 1. Decrement stock
  for (const item of cartItems) {
    const { error: stockError } = await supabaseAdmin.rpc("decrement_stock", {
      product_id: item.id,
      qty: item.quantity,
    });

    if (stockError) {
      return NextResponse.json(
        { error: stockError.message },
        { status: 400 }
      );
    }

    // 2. Fetch available serials for the product
    const { data: units, error: fetchError } = await supabaseAdmin
      .from("product_units")
      .select("id")
      .eq("product_id", item.id)
      .eq("status", "available")
      .limit(item.quantity);

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 400 }
      );
    }

    if (!units || units.length < item.quantity) {
      return NextResponse.json(
        { error: "Not enough product units available" },
        { status: 400 }
      );
    }

    const unitIds = units.map((u) => u.id);

    // 3. Mark these units as sold
    const { error: markError } = await supabaseAdmin
      .from("product_units")
      .update({ status: "sold" })
      .in("id", unitIds);

    if (markError) {
      return NextResponse.json(
        { error: markError.message },
        { status: 400 }
      );
    }
  }

  // 4. Update order
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ reference, status })
    .eq("id", orderId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}


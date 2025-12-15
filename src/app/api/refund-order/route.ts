import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // 1️⃣ Get order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "paid") {
      return NextResponse.json(
        { error: "Only paid orders can be refunded" },
        { status: 400 }
      );
    }

    // 2️⃣ Get order items
    const { data: items, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("product_id, quantity, serial_number")
      .eq("order_id", orderId);

    if (itemsError) throw itemsError;

    // 3️⃣ Restore inventory
    for (const item of items) {
      await supabaseAdmin.rpc("increment_stock", {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      });

      if (item.serial_number) {
        const serials = item.serial_number
          .split(",")
          .map((s: string) => s.trim());

        await supabaseAdmin
          .from("product_units")
          .update({ status: "available" })
          .in("serial_number", serials);
      }
    }

    // 4️⃣ Mark order as refunded (DO NOT DELETE)
    await supabaseAdmin
      .from("orders")
      .update({
        status: "refunded",
        refunded_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Refund error:", err);
    return NextResponse.json(
      { error: err.message || "Refund failed" },
      { status: 500 }
    );
  }
}

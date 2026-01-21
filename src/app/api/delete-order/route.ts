import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || user?.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // 1️⃣ Get order items (SERVER decides, not frontend)
    const { data: order } = await supabaseAdmin
  .from("orders")
  .select("status")
  .eq("id", orderId)
  .single();

if (order?.status === "paid") {
  return NextResponse.json(
    { error: "Paid orders cannot be deleted. Use refund instead." },
    { status: 403 }
  );
}

    // 4️⃣ Delete order_items
    await supabaseAdmin
      .from("order_items")
      .delete()
      .eq("order_id", orderId);

    // 5️⃣ Delete order
    await supabaseAdmin
      .from("orders")
      .delete()
      .eq("id", orderId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

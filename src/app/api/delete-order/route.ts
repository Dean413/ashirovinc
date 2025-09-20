import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from "next/server";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side key
)


export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (!orderId) return NextResponse.json({ error: "Missing order id" }, { status: 400 });

    // delete order items first
    await supabaseAdmin.from("order_items").delete().eq("order_id", orderId);

    // delete order itself
    const { error } = await supabaseAdmin.from("orders").delete().eq("id", orderId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

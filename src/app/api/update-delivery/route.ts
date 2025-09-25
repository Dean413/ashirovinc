import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status)
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("orders")
      .update({ delivery_status: status })
      .eq("id", orderId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


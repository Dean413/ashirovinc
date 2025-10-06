import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    // Query orders table by id or email
    const { data: order, error } = await supabaseAdmin
      .from("orders") // 👈 correct way
      .select("*")
      .or(`id.eq.${query},email.eq.${query}`)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "No order found" }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        payment_status: order.status,
        status: order.delivery_status,
        date: order.created_at,
        total: order.total_amount,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
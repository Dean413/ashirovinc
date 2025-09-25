import axios from "axios";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  // Call Paystack verify API
  const { data } = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    }
  );

  if (data.status && data.data.status === "success") {
    const orderId = data.data.metadata.order_id;

    // ✅ Update order to paid
    await supabaseAdmin.from("orders").update({ status: "paid" }).eq("id", orderId);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ success: false }), { status: 400 });
}

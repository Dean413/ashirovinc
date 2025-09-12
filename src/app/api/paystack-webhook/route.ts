import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // service key 🔑
);

export async function POST(req: Request) {
  try {
    // Get raw body
    const body = await req.text();
    console.log("Webhook hit! Raw body:", body); // ✅ log raw payload

    // ✅ Verify Paystack Signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    const signature = req.headers.get("x-paystack-signature");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    // ✅ Handle successful payment
    if (event.event === "charge.success") {
      const orderId = event.data.metadata.order_id;

      await supabase
        .from("orders")
        .update({
          status: "paid",
          transaction_reference: event.data.reference,
        })
        .eq("id", orderId);

      return NextResponse.json({ received: true }, { status: 200 });
    }

    // You can handle failed or abandoned payments here too
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    console.log("Webhook hit! Raw body:", body);

    // ✅ Verify Paystack signature
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
      const orderId = (event.data.metadata.order_id);

      // 1️⃣ Update order status & reference
      const { error: confirmError } = await supabase
        .from("orders")
        .update({
          status: "paid",
          reference: event.data.reference,
        })
        .eq("id", orderId);

      if (confirmError) console.error("Order update failed:", confirmError);

      // 2️⃣ Decrement stock
      const { data: orderItems, error: fetchItemsError } = await supabase
        .from("order_items") // assuming you have an order_items table
        .select("product_id, quantity")
        .eq("order_id", orderId);

      if (fetchItemsError) console.error("Fetching order items failed:", fetchItemsError);

      for (const item of orderItems || []) {
        const { error: stockError } = await supabase.rpc("decrement_stock", {
          product_id: item.product_id,
          qty: item.quantity,
        });
        if (stockError) console.error("Stock decrement failed:", stockError);
      }

      // 2.5️⃣ Get user_id to clear cart
      const { data: orderData, error: orderDataError } = await supabase
        .from("orders")
        .select("user_id")
        .eq("id", orderId)
        .single();

      if (orderDataError) {
        console.error("Fetching order for cart deletion failed:", orderDataError);
      } else {
        const userId = orderData.user_id;
        const { error: clearCartError } = await supabase
          .from("cart")
          .delete()
          .eq("user_id", userId);

        if (clearCartError) console.error("Clearing cart failed:", clearCartError);
        else console.log("Cart cleared for user:", userId);
      }


      

      // 3️⃣ Fetch customer info
      const { data: orderRow, error: fetchError } = await supabase
        .from("orders")
        .select("email, name, total_amount")
        .eq("id", orderId)
        .single();

      if (fetchError) {
        console.error("Order fetch failed:", fetchError);
        return NextResponse.json({ received: true }, { status: 200 });
      }

      
      // 4️⃣ Send confirmation email
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Ashirovinc" <${process.env.EMAIL_USER}>`,
          to: orderRow.email,
          subject: `Payment Confirmation - Order #${orderId}`,
          html: `
            <h2>Hello ${orderRow.name},</h2>
            <p>We’ve received your payment for order <strong>#${orderId}</strong>.</p>
            p
            <p>Total: <strong>₦${Number(orderRow.total_amount).toLocaleString()}</strong></p>
            <p>Your order is now being processed. Thank you for shopping with Ashirovinc!</p>
          `,
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }

      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Other Paystack events
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

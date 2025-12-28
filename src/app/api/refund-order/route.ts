import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
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

    // 1️⃣ Get order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("status, email, name")
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

      const { data: refundItems, error: refundItemsError } = await supabaseAdmin
      .from("order_items")
      .select("quantity,product_name")
      .eq("order_id", orderId);

    if (refundItemsError) throw refundItemsError;

      try {
      const transporter = nodemailer.createTransport({
        host: "smtppro.zoho.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER2, // support@ashirovinc.com
          pass: process.env.EMAIL_PASS2, // Zoho app password
        },
        tls: { rejectUnauthorized: true },
      });

      await transporter.sendMail({
        from: `"Ashirovinc Store" <${process.env.EMAIL_USER2}>`,
        to: order.email,
        subject: `Order Refunded - #${orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; color:#333; max-width:600px; margin:auto; border:1px solid #eee; padding:20px; border-radius:8px;">
            <h2 style="color:#1E3A8A;">Hi ${order.name},</h2>
            <p>Your order <strong>#${orderId}</strong> has been refunded successfully.</p>
            <h3 style="color:#1E3A8A;">Refunded Items:</h3>
            <ul>
              ${refundItems.map((item:any) => `<li>${item.product_name} (Qty: ${item.quantity})</li>`).join("")}
            </ul>
            <p>If you have any questions, reply to this email or contact our support team.</p>
            <hr/>
            <p style="font-size:12px; color:#999;">Ashirovinc Team</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Refund email failed:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Refund error:", err);
    return NextResponse.json(
      { error: err.message || "Refund failed" },
      { status: 500 }
    );
  }
}

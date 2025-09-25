import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { email, name, orderId, deliveryMethod, address } = await req.json();

    const { data: orderItems, error: fetchItemsError } = await supabaseAdmin
        .from("order_items") // assuming you have an order_items table
        .select("product_id, price, product_name, quantity, product_image")
        .eq("order_id", orderId);
        

         const items = orderItems ?? [];

     const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
            });

    await transporter.sendMail({
      from: `"Ashirovinc" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your order is ready",
      html: `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; background: #f9fafb; padding: 20px; border-radius: 8px;">
    <h2 style="color:#1E3A8A; text-align:center;">Your Order is Ready!</h2>
    <p>Hello <strong>${name}</strong>,</p>

    <p>
      We’re excited to let you know that your order <strong>#${orderId}</strong> is now ready
      ${
        deliveryMethod === "pickup"
          ? `for pickup at our office:<br/>
            <strong>Suite 045, Orago (Lozumba) Commercial Complex, Area 10 Garki,<br/>
            Opposite Garki Secondary School, Abuja</strong>.<br/>
            <em>Pickup Hours: Monday – Friday, 8:00 am – 8:00 pm</em>.`
          : `to be delivered to your address:<br/>
            <strong>${address}</strong>`
      }
    </p>

    <h3 style="color:#1E3A8A; border-bottom:1px solid #ddd; padding-bottom:4px;">Order Details</h3>
    <table style="width:100%; border-collapse:collapse;">
      <thead>
        <tr style="background:#e5e7eb;">
          <th style="text-align:left; padding:8px;">Product</th>
          <th style="text-align:center; padding:8px;">Qty</th>
          <th style="text-align:right; padding:8px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item: any) => `
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee;">
                ${item.product_image
                  ? `<img src="${item.product_image}" alt="${item.product_name}" width="50" style="vertical-align:middle; margin-right:8px; border-radius:4px;">`
                  : ""}
                ${item.product_name}
              </td>
              <td style="text-align:center; padding:8px; border-bottom:1px solid #eee;">${item.quantity}</td>
              <td style="text-align:right; padding:8px; border-bottom:1px solid #eee;">₦${Number(
                item.price
              ).toLocaleString()}</td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <p style="margin-top:20px;">
      Please pick up or receive your order within 7 days to avoid restocking.
      If you have any questions, reply to this email or call
      <strong>+234-XXX-XXX-XXXX</strong>.
    </p>

    <hr style="margin:20px 0; border:none; border-top:1px solid #e5e7eb;" />
    <p style="font-size:12px; color:#6b7280; text-align:center;">
      Thank you for shopping with <strong>Ashirovinc</strong>.<br/>
      We appreciate your business!
    </p>
  </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Notify customer error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

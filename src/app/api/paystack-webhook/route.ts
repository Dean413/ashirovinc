import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseServer";
import nodemailer from "nodemailer";


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
      const { error: confirmError } = await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          reference: event.data.reference,
        })
        .eq("id", orderId);

      if (confirmError) console.error("Order update failed:", confirmError);

      // 2️⃣ Decrement stock
      const { data: orderItems, error: fetchItemsError } = await supabaseAdmin
        .from("order_items") // assuming you have an order_items table
        .select("product_id, price, product_name, quantity, product_image")
        .eq("order_id", orderId);

      if (fetchItemsError) console.error("Fetching order items failed:", fetchItemsError);

      for (const item of orderItems || []) {
        const { error: stockError } = await supabaseAdmin.rpc("decrement_stock", {
          product_id: item.product_id,
          qty: item.quantity,
          product_name: item.product_name,
          price: item.price,
          product_image: item.product_image
        });
        if (stockError) console.error("Stock decrement failed:", stockError);
      }

      // 2.5️⃣ Get user_id to clear cart
      const { data: orderData, error: orderDataError } = await supabaseAdmin
        .from("orders")
        .select("user_id")
        .eq("id", orderId)
        .single();

      if (orderDataError) {
        console.error("Fetching order for cart deletion failed:", orderDataError);
      } else {
        const userId = orderData.user_id;
        const { error: clearCartError } = await supabaseAdmin
          .from("cart")
          .delete()
          .eq("user_id", userId);

        if (clearCartError) console.error("Clearing cart failed:", clearCartError);
      }


      

      // 3️⃣ Fetch customer info
      const { data: orderRow, error: fetchError } = await supabaseAdmin
        .from("orders")
        .select("email, name, total_amount, phone, delivery_method, address")
        .eq("id", orderId)
        .single();

      if (fetchError) {
        console.error("Order fetch failed:", fetchError);
        return NextResponse.json({ received: true }, { status: 200 });
      }

      
      // 4️⃣ Send confirmation email
      try {
        const transporter = nodemailer.createTransport({
        host: "smtppro.zoho.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER2, // e.g. support@ashirovinc.com
          pass: process.env.EMAIL_PASS2, // Zoho App Password
        },
        tls: {
          rejectUnauthorized: true
        }
      });
        
      const items = orderItems ?? []; // default to empty array

      await transporter.sendMail({
        from: `"AshirovInc Store" <${process.env.EMAIL_USER2}>`,
        to: orderRow.email,
        subject: `Order Confirmation - ${orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
            <h2 style="color: #1E3A8A;">Hi ${orderRow.name},</h2>
            <p>Thank you for shopping with <strong>Ashirovinc</strong>! Your order <strong>${orderId}</strong> has been confirmed successfully.</p>
            
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

            <p><strong>Total Paid:</strong> ₦${Number(orderRow.total_amount).toLocaleString()}</p>
            <p>Your order will be processed and shipped as soon as possible. You will receive a notification once it’s ready for collection/delivery.</p>
           

            <h3 style="color: #1E3A8A; border-bottom: 1px solid #eee; padding-bottom: 5px;">Delivery Details</h3>
            <p>
            <p>
        <strong>Recipient:</strong> ${orderRow.name} <br/>
        <strong>Phone:</strong> ${orderRow.phone || "N/A"} <br/>
        <strong>Delivery Method:</strong> ${orderRow.delivery_method === "pickup" ? "Pickup" : "Delivery"} <br/>
        <h3 style="color: #1E3A8A; border-bottom: 1px solid #eee; padding-bottom: 5px;">Pick up Address</h3>
        <strong>Address:</strong> ${orderRow.delivery_method === "pickup" ? "ADDRESS Suite 045 Orago(Lozumba) commercial complex area 10 Garki (Opposite Garki Sec School, Abuja." : orderRow.address || "N/A"}
      </p>

            
            </p>

            <p style="margin-top: 20px;">You can track your order in your Ashirovinc account if you have registered an account with us or visit www.ashirovinc.com/track-order. If you wish to cancel your order, please do so before it’s shipped.</p>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
            <p style="font-size: 12px; color: #999;">Happy Shopping!<br/>Warm Regards, <br/>Ashirovinc Team</p>
          </div>
        `,
      });
 
      
    try {
        const transporter = nodemailer.createTransport({
        host: "smtppro.zoho.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER2, // e.g. support@ashirovinc.com
          pass: process.env.EMAIL_PASS2, // Zoho App Password
        },
        tls: {
          rejectUnauthorized: true
        }
      });
  const items = orderItems ?? []; // default to empty array

  

  // Owner email (send after customer)
  await transporter.sendMail({
    from: `"AshirovInc Store" <${process.env.EMAIL_USER2}>`,
    to: "support@ashirovinc.com", // owner
    subject: `New Order Received - ${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
        <h2 style="color: #1E3A8A;">New Order Received!</h2>
        <p>Order <strong>${orderId}</strong> has been paid successfully.</p>
        <h3 style="color: #1E3A8A;">Customer Details</h3>
        <p>
          <strong>Name:</strong> ${orderRow.name}<br/>
          <strong>Email:</strong> ${orderRow.email}<br/>
          <strong>Phone:</strong> ${orderRow.phone || "N/A"}<br/>
          <strong>Delivery Method:</strong> ${orderRow.delivery_method === "pickup" ? "Pickup" : "Delivery"}<br/>
          <strong>Address:</strong> ${orderRow.delivery_method === "pickup" ? "ADDRESS Suite 045 Orago(Lozumba) commercial complex area 10 Garki (Opposite Garki Sec School, Abuja)" : orderRow.address || "N/A"}
        </p>
        <h3 style="color: #1E3A8A;">Products Ordered</h3>
        <tbody>
           ${items.map( (item: any) => `
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
        <p><strong>Total Paid:</strong> ₦${Number(orderRow.total_amount).toLocaleString()}</p>
        <p style="font-size: 12px; color: #999;">This is an automated notification from Ashirovinc.</p>
      </div>
    `,
  });

} catch (emailErr) {
  console.error("Email send failed:", emailErr);
}


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









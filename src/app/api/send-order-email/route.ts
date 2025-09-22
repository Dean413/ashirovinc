import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, name, orderId, amount } = await req.json();

    // Create transporter
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

    // Email content
    const mailOptions = {
      from: `"Ashirovinc" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Payment Confirmation - Order #${orderId}`,
      html: `
        <h2>Hi ${name},</h2>
        <p>We’ve received your payment of <strong>₦${amount}</strong> for Order <strong>#${orderId}</strong>.</p>
        <p>Your order is now being processed. We’ll notify you when it ships.</p>
        <p>Thank you for shopping with Ashirovinc!</p>
        <br/>
        <p>- The Ashirovinc Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Email send error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create transporter (replace with your email provider credentials)
   const transporter = nodemailer.createTransport({
      host: "smtppro.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER2, //support@ashirovinc.com
        pass: process.env.EMAIL_PASS2, // Zoho App Password
      },
      tls: {
        rejectUnauthorized: true
      }
    });

    // Send mail
    await transporter.sendMail({
      from: `"Ashirovinc" <${process.env.EMAIL_USER2}>`, // sender info
      to: "support@ashirovinc.com", // your company email
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      text: message,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/</g, "&lt;")}</p>
      `,
    });

    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

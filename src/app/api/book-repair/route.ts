import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // Ensures Nodemailer works properly in Next.js app router

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const bookTitle = formData.get("bookTitle") as string;
    const description = formData.get("description") as string;
    const preferredDate = formData.get("preferredDate") as string;

    if (!name || !email || !bookTitle || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Configure your transporter (prefer App Password or custom SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the mail (no attachments)
    await transporter.sendMail({
      from: `"Ashirov Inc Repairs" <${process.env.EMAIL_USER}>`,
      to: "support@ashirovinc.com",
      replyTo: email,
      subject: `Repair Request: ${bookTitle} from ${name}`,
      html: `
        <h2>Repair Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Device/Item:</strong> ${bookTitle}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        <p><strong>Description:</strong> ${description}</p>
      `,
    });

    return NextResponse.json(
      { message: "Repair request sent!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Repair API error:", err);
    return NextResponse.json(
      { error: "Failed to send repair request" },
      { status: 500 }
    );
  }
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "./client-provider"; // 👈 new component

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Ashirov Inc – Affordable Used Laptops & Computers in Nigeria",
    template: "%s | Ashirow Inc",
  },
  description:
    "Shop reliable UK-used laptops and desktop computers at unbeatable prices. Ashirow Inc offers quality devices, nationwide delivery, and secure payments.",
  keywords: [
    "used laptops Nigeria",
    "affordable computers",
    "UK used laptops",
    "cheap laptops Lagos",
    "Ashirow Inc",
  ],
  openGraph: {
    type: "website",
    url: "https://ashirovinc.com",
    title: "Ashirow Inc – Affordable Used Laptops & Computers",
    description:
      "Get premium UK-used laptops and computers with warranty and fast nationwide delivery.",
    siteName: "Ashirow Inc",
    images: [
      {
        url: "https://ashirovinc.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ashirow Inc hero banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ashirovinc",
    title: "Ashirow Inc – Affordable Used Laptops & Computers",
    description:
      "Quality UK-used laptops and computers at the best prices in Nigeria. Secure checkout, nationwide delivery.",
    images: ["https://ashirovinc.com/og-image.jpg"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

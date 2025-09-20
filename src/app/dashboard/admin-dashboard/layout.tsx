"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-md ${open ? "w-64" : "w-20"} transition-all`}>
        <div className="p-4 font-bold text-xl">Admin</div>
        <nav className="flex flex-col mt-4 gap-2">
          <Link href="/dashboard/admin-dashboard" className="px-4 py-2 hover:bg-gray-200 rounded">Dashboard</Link>
          <Link href="/dashboard/admin-dashboard/products" className="px-4 py-2 hover:bg-gray-200 rounded">Products</Link>
          <Link href="/dashboard/admin-dashboard/orders" className="px-4 py-2 hover:bg-gray-200 rounded">Orders</Link>
          <Link href="/dashboard/admin-dashboard/users" className="px-4 py-2 hover:bg-gray-200 rounded">Users</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

// file: app/dashboard/admin-dashboard/make-admin.tsx
"use client";

import { useEffect, useState } from "react";
import FullPageLoader from "@/app/component/page-reloader";

interface User {
  id: string;
  email: string;
  role?: string;
}

export default function MakeAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all users from API
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/super-admin");
      const data = await res.json();
      setUsers(
        data.users.map((u: any) => ({
          id: u.id,
          email: u.email ?? "",
          role: u.user_metadata?.role ?? "user",
        }))
      );
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Promote user to admin via API
  const promoteToAdmin = async (userId: string) => {
    setActionLoading(true);
    const res = await fetch("/api/super-admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (data.error) alert(data.error);
    else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: "admin" } : u))
      );
    }
    setActionLoading(false);
  };

  // if (loading) return <FullPageLoader />;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Manage Admins</h1>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                {user.role !== "admin" && (
                  <button
                    onClick={() => promoteToAdmin(user.id)}
                    disabled={actionLoading}
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {actionLoading ? "Processing..." : "Make Admin"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

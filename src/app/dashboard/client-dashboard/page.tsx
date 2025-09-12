"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  product_name: string;
  total_amount: number;
  status: "pending" | "paid" | "delivered";
  created_at: string;
  delivery_method: string;
  user_id : string;
};

export default function ClientDashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUserAndOrders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      setUser(user);

      // Fetch client orders
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }

      console.log("Logged in user:", user.id);
      console.log("Orders fetched:", data);


    };

    getUserAndOrders();
  }, [supabase, router]);

  const pendingOrders = orders.filter(
    (order) => order.status === "paid" || order.status === "pending"
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Client Dashboard</h1>
      {user && <p className="mt-2">Welcome, {user.email} 👋</p>}

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg bg-yellow-50">
          <h2 className="text-lg font-semibold text-yellow-800">Pending Orders</h2>
          <ul className="mt-2 space-y-2">
            {pendingOrders.map((order) => (
              <li key={order.id} className="p-2 border rounded bg-white shadow">
                <p>🛒 {order.product_name}</p>
                <p>💰 ₦{order.total_amount}</p>
                <p>Status: {order.status}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Order History */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500 mt-2">No orders yet.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {orders.map((order) => (
              <li key={order.id} className="p-2 border rounded bg-gray-50">
                <p>🛒 {order.product_name}</p>
                <p>💰 ${order.total_amount}</p>
                <p>Status: {order.status}</p>
                <p className="text-sm text-gray-500">
                  Ordered on {new Date(order.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/sign-in");
        }}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Sign Out
      </button>
    </div>
  );
}

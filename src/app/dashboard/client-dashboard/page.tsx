"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

type OrderItem = {
  id: string;
  order_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  total_amount: number;
  status: string;
  delivery_status: string;
  created_at: string;
  user_id: string;
  items?: OrderItem[]; // attach manually
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

      // 1. Get orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Orders error:", ordersError);
        return;
      }

      if (!ordersData) return;

      // 2. Get all order items for these orders
      const orderIds = ordersData.map((o) => o.id);
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);

      if (itemsError) {
        console.error("Order items error:", itemsError);
        return;
      }

      // 3. Attach items to each order
      const ordersWithItems = ordersData.map((order) => ({
        ...order,
        items: itemsData?.filter((item) => item.order_id === order.id) || [],
      }));

      setOrders(ordersWithItems as Order[]);
    };

    getUserAndOrders();
  }, [supabase, router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      {user && <p className="mt-2">Welcome, {user.email} 👋</p>}

      {orders.length === 0 ? (
        <p className="text-gray-500 mt-6">No orders yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="p-4 border rounded-lg shadow bg-white">
              {/* Order Details */}
              <div>
                <p className="font-semibold text-lg">Order #{order.id}</p>
                <p className="text-gray-700">💰 ₦{order.total_amount}</p>
                <p className="text-green-600 font-medium">✅ Status: {order.status}</p>
                <p className="text-blue-600">
                  🚚 Delivery: {order.delivery_status || "pending delivery"}
                </p>
                <p className="text-sm text-gray-500">
                  Ordered on {new Date(order.created_at).toLocaleString()}
                </p>

                <ul className="mt-4 space-y-2">
                {order.items?.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-center space-x-4 p-2 rounded ${
                      order.delivery_status === "delivered" ? "opacity-50 blur-[1px]" : ""
                    }`}
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.product_image || "/placeholder.png"}
                        alt={item.product_name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    

                    {/* Item Info */}
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>₦{item.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
              </div>

              {/* Order Items */}
              
            </li>
          ))}
        </ul>
      )}

      {/* Logout */}
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/sign-in");
        }}
        className="mt-8 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Sign Out
      </button>
    </div>
  );
}

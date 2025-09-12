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
    <div className="p-6 max-w-4xl mx-auto">
  <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
  {user && (
   <p className="mt-2 text-gray-600">
  Welcome,{" "}
  <span className="font-medium capitalize">
    {user.user_metadata?.full_name
      ? user.user_metadata.full_name.split(" ")[0]
      : user.email}
  </span>{" "}
  👋
</p>
  )}

  {orders.length === 0 ? (
    <p className="text-gray-500 mt-10 text-center">
      You haven’t placed any orders yet.
    </p>
  ) : (
    <ul className="mt-8 space-y-6">
      {orders.map((order) => (
        <li
          key={order.id}
          className="p-6 border rounded-2xl shadow-sm bg-white hover:shadow-md transition"
        >
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-lg text-gray-800">
                Order #{order.id}
              </p>
              <p className="text-gray-600 text-sm">
                Ordered on{" "}
                <span className="font-medium">
                  {new Date(order.created_at).toLocaleDateString()}{" "}
                  {new Date(order.created_at).toLocaleTimeString()}
                </span>
              </p>
            </div>

            <div className="mt-3 sm:mt-0 flex space-x-3">
              <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
                {order.status}
              </span>
              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
                {order.delivery_status || "pending delivery"}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-4">
            <p className="text-gray-700">
              <span className="font-semibold">💰 Total:</span> ₦{order.total_amount}
            </p>
          </div>

          {/* Order Items */}
          <ul className="mt-6 divide-y divide-gray-100">
            {order.items?.map((item) => (
              <li
                key={item.id}
                className={`flex items-center space-x-4 py-4 ${
                  order.delivery_status === "delivered"
                    ? "opacity-70 blur-[0.5px]"
                    : ""
                }`}
              >
                {/* Product Image */}
                <div className="w-16 h-16 relative flex-shrink-0 rounded-lg overflow-hidden border">
                  <Image
                    src={item.product_image || "/placeholder.png"}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Item Info */}
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.product_name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>

                {/* Price */}
                <p className="font-semibold text-gray-700">₦{item.price}</p>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )}

  {/* Logout */}
  <div className="text-center mt-10">
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/sign-in");
      }}
      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition"
    >
      Sign Out
    </button>
  </div>
</div>

  );
}

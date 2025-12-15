"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Select from 'react-select'
import { supabase } from "@/lib/supabaseclient";

type OrderItem = {
  quantity: number;
  product_name: string;
  price: number;
};

type Order = {
  id: string;
  total_amount: number;
  name: string;
  created_at: string;
  email?: string;
  status: string;
  order_items: OrderItem[];
};

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const [isClient, setIsClient] = useState(false);
  const [customDate, setCustomDate] = useState<string>("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          id,
          name,
          total_amount,
          status,
          created_at,
          order_items ( quantity, product_name, price )
        `)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setOrders(ordersData || []);

      setLoading(false);
    };

    fetchSales();
  }, []);

  

 // Filter sales
  const filteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      const d = new Date(order.created_at);

      let matchesDate = true;
      switch (timeFilter) {
        case "today":
          matchesDate = d.toDateString() === now.toDateString();
          break;
        case "month":
          matchesDate =
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear();
          break;
        case "year":
          matchesDate = d.getFullYear() === now.getFullYear();
          break;
        case "custom":
          if (customDate) {
            const target = new Date(customDate);
            matchesDate = d.toDateString() === target.toDateString();
          }
          break;
        default:
          matchesDate = true; // all time
      }
      return matchesDate
    });
  }, [orders, timeFilter, customDate]);

  // Total sales for filtered results
 const totalOrders = useMemo(() => {
  return filteredOrders.reduce((sum, order) => {
    if (order.status !== "paid") return sum;
    return sum + Number(order.total_amount || 0);
  }, 0);
}, [filteredOrders]);

  // Label
  const filterLabel = useMemo(() => {
    switch (timeFilter) {
      case "today":
        return "Today's Sales";
      case "month":
        return "This Month's Sales";
      case "year":
        return "This Year's Sales";
      case "custom":
        return customDate
          ? `Sales on ${new Date(customDate).toLocaleDateString()}`
          : "Custom Date Sales";
      default:
        return "All Sales Records";
    }
  }, [timeFilter, customDate]);

  if (loading) return <p>Loading sales...</p>;

  // Calculate grand total
  const grandTotal = orders.reduce((sum, order) => sum + order.total_amount, 0);

  return (
    <div className="p-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3 w-full">
          <h2 className="text-2xl font-bold">{filterLabel}</h2>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Time Filter */}
            <div className="min-w-[180px]">
              
                <Select
                  value={{ value: timeFilter, label: timeFilter }}
                  onChange={(option) => setTimeFilter(option?.value || "All")}
                  options={[
                    { value: "All", label: "All Time" },
                    { value: "today", label: "Today" },
                    { value: "month", label: "This Month" },
                    { value: "year", label: "This Year" },
                    { value: "custom", label: "Custom Date" },
                  ]}
                  classNamePrefix="react-select"
                />
              
            </div>
            {timeFilter === "custom" && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )}   
          </div>
        </div>

      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
             <th className="p-3 border">Date</th>
            <th className="p-3 border">Order ID</th>
            <th className="p-3 border">Customer</th>
            <th className="p-3 border">Product Name</th>
            <th className="p-3 border">Price (₦)</th>
            <th className="p-3 border">Quantity</th>
            <th className="p-3 border">Total (₦)</th>
             <th className="p-3 border">Status</th>
            <th className="p-3 border">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) =>
            order.order_items.map((item, idx) => (
              <tr key={`${order.id}-${idx}`} className="border hover:bg-gray-50">
                {idx === 0 && (
                  <>
                  <td className="p-3 border" rowSpan={order.order_items.length}>
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="p-3 border" rowSpan={order.order_items.length}>{order.id}</td>
                    <td className="p-3 border" rowSpan={order.order_items.length}>{order.name}</td>
                  </>
                )}
                <td className="p-3 border">{item.product_name}</td>
                <td className="p-3 border">₦{item.price.toLocaleString()}</td>
                <td className="p-3 border">{item.quantity}</td>
                <td className="p-3 border">₦{(item.price * item.quantity).toLocaleString()}</td>
                <td className={`p-3 border font-semibold ${ order.status === "refunded" ? "text-red-600" : order.status === "paid" ? "text-green-600" : "text-yellow-600"  }`}>
                  {order.status.toUpperCase()}
                </td>
                {idx === 0 && (
                  <>
                    <td className="p-3 border text-blue-600 underline" rowSpan={order.order_items.length}>
                      <Link href={`/dashboard/admin/sales/${order.id}`}>View Receipt</Link>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}

          {/* Grand Total */}
          <tr className="bg-gray-100 font-semibold">
            <td className="p-3 border text-right" colSpan={5}>Grand Total:</td>
            <td className="p-3 border">₦{totalOrders.toLocaleString()}</td>
            <td className="p-3 border" colSpan={2}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseclient";

type Order = {
  id: string;
  name: string;
  phone: number;
  address: string;
  email?: string;
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
          address,
          email,
          phone
          
        `)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setOrders(ordersData || []);

      setLoading(false);
    };

    fetchSales();
  }, []);

  if (loading) return <p>Loading Customer...</p>;

  
  return (
    <div className="p-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3 w-full">
          <h2 className="text-2xl font-bold">Customers</h2>
        </div>

      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border text-left">Customer Name</th>
            <th className="p-3 border">Email Address</th>
            <th className="p-3 border">Phone Number</th>
            <th className="p-3 border">House Address</th>
          </tr>
        </thead>
        <tbody>
            {orders.map((order) => (
                <tr key={order.id} className="border hover:bg-gray-50">
                    <td className="p-3 text-left border">{order.name}</td>
                    <td className="p-3 text-center border">{order.email}</td>
                    <td className="p-3 text-center border">{order.phone}</td>
                    <td className="p-3 text-center border">{order.address}</td>  
                </tr> 
            ))}
        </tbody>
      </table>
    </div>
  );
}

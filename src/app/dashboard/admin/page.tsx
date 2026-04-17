"use client";

import { supabase } from "@/lib/supabaseclient";
import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function SalesAnalyticsPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState<"today" | "month" | "year" | "custom">("today");
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth());
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`id, status, created_at, total_amount, order_items (product_name, quantity)`)
      .order("created_at", { ascending: true });
    if (!error) setSales(data || []);
    setLoading(false);
  };

  // Filtered sales
  const filteredSales = useMemo(() => {
  if (!sales) return [];

  const now = new Date();

  return sales.filter(s => {
    const d = new Date(s.created_at);

    if (filterType === "today") {
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }

    if (filterType === "month") {
      return d.getMonth() === filterMonth && d.getFullYear() === filterYear;
    }

    if (filterType === "year") {
      return d.getFullYear() === filterYear;
    }

    if (filterType === "custom") {
      if (!customStart || !customEnd) return true;
      const start = new Date(customStart);
      const end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);
      return d >= start && d <= end;
    }

    return true;
  });
}, [sales, filterType, filterMonth, filterYear, customStart, customEnd]);

  const paidSales = useMemo(() => filteredSales.filter(s => s.status === "paid"), [filteredSales]);
  const refundedCount = useMemo(() => filteredSales.filter(s => s.status === "refunded").length, [filteredSales]);
  const todaySales = useMemo(() => {
    const today = new Date().toDateString();
    return paidSales.filter(s => new Date(s.created_at).toDateString() === today);
  }, [paidSales]);

  const revenue = useMemo(() => paidSales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0), [paidSales]);

  /* ================= Charts ================= */
  const revenueByDate = useMemo(() => {
    const map: Record<string, number> = {};
    paidSales.forEach(s => {
      const d = new Date(s.created_at).toLocaleDateString();
      map[d] = (map[d] || 0) + Number(s.total_amount);
    });
    return Object.entries(map).map(([date, revenue]) => ({ date, revenue }));
  }, [paidSales]);

  const revenueByMonth = useMemo(() => {
    const map: Record<string, number> = {};
    paidSales.forEach(s => {
      const d = new Date(s.created_at);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      map[key] = (map[key] || 0) + Number(s.total_amount);
    });
    return Object.entries(map).map(([month, revenue]) => ({ month, revenue }));
  }, [paidSales]);

  const productSales = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSales.forEach(s => {
      s.order_items?.forEach((i: any) => {
        map[i.product_name] = (map[i.product_name] || 0) + i.quantity;
      });
    });
    return Object.entries(map).map(([name, qty]) => ({ name, qty }));
  }, [filteredSales]);

  const statusData = [
    { name: "Paid", value: paidSales.length },
    { name: "Refunded", value: refundedCount },
  ];

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div className="p-6 space-y-6 ">
      <h1 className="text-2xl font-bold">Sales Analytics</h1>

      {/* Filter Selection */}
      <div className="flex gap-4 items-end">
        <div>
          <label>Filter Type:</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value as any)} className="border p-1 rounded">
            <option value="today">Today</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {filterType === "month" && (
          <>
            <div>
              <label>Month:</label>
              <select value={filterMonth} onChange={e => setFilterMonth(Number(e.target.value))} className="border p-1 rounded">
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Year:</label>
              <input type="number" value={filterYear} onChange={e => setFilterYear(Number(e.target.value))} className="border p-1 rounded" />
            </div>
          </>
        )}

        {filterType === "year" && (
          <div>
            <label>Year:</label>
            <input type="number" value={filterYear} onChange={e => setFilterYear(Number(e.target.value))} className="border p-1 rounded" />
          </div>
        )}

        {filterType === "custom" && (
          <>
            <div>
              <label>Start:</label>
              <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="border p-1 rounded" />
            </div>
            <div>
              <label>End:</label>
              <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="border p-1 rounded" />
            </div>
          </>
        )}
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
        <KPI title="Revenue" value={`₦${revenue.toLocaleString()}`} />
        <KPI title="Sales" value={paidSales.length} />
        <KPI title="Today's Sales" value={todaySales.length} />
        <KPI title="Orders" value={filteredSales.length} />
        <KPI title="Refunded" value={refundedCount} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <ChartCard title="Revenue Over Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueByDate}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sales Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" label>
                <Cell fill="#16a34a" />
                <Cell fill="#dc2626" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Selling Products">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productSales}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qty" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Month">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

/* ================= Components ================= */
function KPI({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-blue-700">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

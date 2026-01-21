"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseclient";

const { data: { session } } = await supabase.auth.getSession();
const accessToken = session?.access_token;

// --------- Toggle Delivery Button ----------
export function ToggleDeliveryButton({orderId, currentStatus, onStatusChange,}: {orderId: string;currentStatus: string; onStatusChange: () => void;}) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    const nextStatus = currentStatus === "pending" ? "delivered" : "pending";
    const result = await Swal.fire({
      title: `Change status to ${nextStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, update",
    });
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      const res = await fetch("/api/update-delivery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" ,
        "Authorization": `Bearer ${accessToken}`},
        body: JSON.stringify({ orderId, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update delivery status");
      toast.success(`Order marked as ${nextStatus}`);
      onStatusChange();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 disabled:opacity-50">
      {loading && <Spinner />}
      {loading
        ? "Updating..."
        : currentStatus === "pending"
        ? "Mark Delivered"
        : "Mark Pending"}
    </button>
  );
}

// --------- Delete Order Button ----------
export function DeleteOrderButton({orderId, onDelete,}: {orderId: string; onDelete: () => void;}) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    const result = await Swal.fire({
      title: "Delete this order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/delete-order?id=${orderId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" ,
        "Authorization": `Bearer ${accessToken}`},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete order");
      toast.success("Order deleted successfully");
      onDelete();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 disabled:opacity-50">
      {loading && <Spinner />}
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}

export function NotifyCustomerButton({order,}: {order: {id: string; email: string; name: string; delivery_method: string; address: string;};}) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    const result = await Swal.fire({
      title: "Send email to customer?",
      text: `Notify ${order.name} about order ${order.id}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7e22ce",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Send",
    });
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      const res = await fetch("/api/notify-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
        "Authorization": `Bearer ${accessToken}`},
        body: JSON.stringify({
          email: order.email,
          name: order.name,
          orderId: order.id,
          deliveryMethod: order.delivery_method,
          address: order.address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email");
      toast.success("Notification email sent to customer.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-2 py-1 rounded bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
    >
      {loading && <Spinner />}
      {loading ? "Sending..." : "Notify Customer"}
    </button>
  );
}



export function RefundOrderButton({
  orderId,
  onRefund,
}: {
  orderId: string;
  onRefund: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const result = await Swal.fire({
      title: "Refund this order?",
      text: "This will mark the order as refunded, restore stock and serial numbers.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a", // green
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, refund",
    });
    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/refund-order?id=${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
        "Authorization": `Bearer ${accessToken}`},
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refund failed");

      toast.success("Order refunded successfully");
      onRefund(); // callback to update UI
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
     className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 disabled:opacity-50">
      {loading && <Spinner />}
      {loading ? "Processing..." : "Refund Order"}
    </button>
  );
}


// --------- Small Spinner (shared) ----------
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

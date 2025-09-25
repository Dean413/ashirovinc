"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import FullPageLoader from "@/app/component/page-reloader";
import Swal from "sweetalert2"
import SpinnerButton from "@/app/component/spinner";

export default function SettingsPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [updatingName, setUpdatingName] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // Load current user data
  useEffect(() => {
    (async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email ?? "");
        const displayName = (user.user_metadata as any)?.display_name ?? "";
        setName(displayName);
      }
      setLoading(false);
    })();
  }, [supabase]);

  // Update display name
const updateName = async () => {
  setUpdatingName(true);
  const { data, error } = await supabase.auth.updateUser({
    data: { display_name: name },
  });
  setUpdatingName(false);

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Name update failed",
      text: error.message,
    });
    return
  }

  Swal.fire({
    icon: "success",
    title: "Name updated",
    text: `Your display name is now “${name}”.`,
    timer: 2000,
    showConfirmButton: false,
  });

  const updatedName =
    (data.user?.user_metadata as any)?.display_name ?? "NO_NAME_RETURNED";
  setName(updatedName);
  setMessage("Name updated ✅");
};



// Update email
const updateEmail = async () => {
  setUpdatingEmail(true);
  const { data, error } = await supabase.auth.updateUser({ email });
  setUpdatingEmail(false);

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Name update failed",
      text: error.message,
    });
    return
  }

 Swal.fire({
    icon: "info",
    title: "Confirm your inbox",
    text: "Check your email to confirm the new address ✅",
  });
};


  // Delete account
  const deleteAccount = async () => {
   const result = await Swal.fire({
    title: "Delete account?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

    const res = await fetch("/api/delete-user", { method: "POST" });
    if (res.ok) {
      await supabase.auth.signOut();
      router.push("/");
    } else {
      Swal.fire("Error", "Failed to delete account", "error");
    }
  };

  if (loading) return <FullPageLoader text="loading" />
  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>

      {message && <p className="text-green-600">{message}</p>}

      {/* Display Name */}
      <div className="space-y-2">
        <label className="block font-medium">Display Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button
          onClick={updateName}
          disabled={updatingName}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
          {updatingName && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {updatingName ? "Updating…" : "Update Name"}
        </button>

      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block font-medium">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button
          onClick={updateEmail}
          disabled={updatingEmail}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
          {updatingEmail && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {updatingName ? "Updating…" : "Update Email"}
        </button>

        

      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t">
        <h2 className="font-bold text-red-600 mb-2">Danger Zone</h2>
        <button
          onClick={deleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

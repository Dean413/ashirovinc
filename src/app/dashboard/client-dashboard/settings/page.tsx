"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // Load current user data
  useEffect(() => {
    (async () => {
      console.log("🔎 Fetching current user…");
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log("➡️ getUser result:", { user, error });

      if (user) {
        setEmail(user.email ?? "");
        const displayName = (user.user_metadata as any)?.display_name ?? "";
        console.log("➡️ Existing display_name:", displayName);
        setName(displayName);
      }
      setLoading(false);
    })();
  }, [supabase]);

  // Update display name
  const updateName = async () => {
    console.log("📝 Updating display_name to:", name);
    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: name },
    });
    console.log("➡️ updateUser result:", { data, error });

    if (error) {
      setMessage(error.message);
      return;
    }

    // Show the new value from returned user object
    const updatedName =
      (data.user?.user_metadata as any)?.display_name ?? "NO_NAME_RETURNED";
    console.log("➡️ Updated display_name from updateUser:", updatedName);
    setName(updatedName);
    setMessage("Name updated ✅");
  };

  // Update email
  const updateEmail = async () => {
    console.log("📝 Updating email to:", email);
    const { data, error } = await supabase.auth.updateUser({ email });
    console.log("➡️ updateUser email result:", { data, error });

    setMessage(
      error
        ? error.message
        : "Check your inbox to confirm the new email address ✅"
    );
  };

  // Delete account
  const deleteAccount = async () => {
    if (!confirm("This will permanently delete your account. Continue?")) return;

    console.log("🗑️ Deleting account…");
    const res = await fetch("/api/delete-user", { method: "POST" });
    console.log("➡️ delete-user response:", res.status);
    if (res.ok) {
      await supabase.auth.signOut();
      router.push("/");
    } else {
      setMessage("Failed to delete account");
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;

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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Name
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Email
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

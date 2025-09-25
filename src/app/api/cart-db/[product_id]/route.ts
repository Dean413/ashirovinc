import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ product_id: string }> } // 👈 notice Promise here
) {
  // ✅ await the params first
  const { product_id } = await context.params;

  // if your id is a UUID, don’t convert to Number
  // const id = Number(product_id)   ❌
  const id = product_id;

  const { error } = await supabaseAdmin
    .from("cart")
    .delete()
    .eq("product_id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

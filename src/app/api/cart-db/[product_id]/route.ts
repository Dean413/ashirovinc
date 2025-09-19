import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ product_id: string }> } // 👈 notice Promise here
) {
  // ✅ await the params first
  const { product_id } = await context.params;

  // if your id is a UUID, don’t convert to Number
  // const id = Number(product_id)   ❌
  const id = product_id;

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("product_id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

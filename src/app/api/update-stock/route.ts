import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { items } = await req.json(); 
    // items = [{ product_id: "uuid", quantity: 2, serial_numbers: ["SN1", "SN2"] }]

    for (const item of items) {
      // 1️⃣ Restore stock
      const { data: p, error: stockError } = await supabaseAdmin
        .from("products")
        .select("stock")
        .eq("id", item.product_id)
        .single();

      if (stockError) return NextResponse.json({ error: stockError.message }, { status: 400 });

      const newStock = (p?.stock || 0) + item.quantity;

      const { error: updateError } = await supabaseAdmin
        .from("products")
        .update({ stock: newStock })
        .eq("id", item.product_id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }

      // 2️⃣ Restore serials
      if (item.serial_numbers && item.serial_numbers.length > 0) {
        const { error: serialError } = await supabaseAdmin
          .from("product_units")
          .update({ status: "available" })
          .in("serial_number", item.serial_numbers);

        if (serialError) {
          return NextResponse.json({ error: serialError.message }, { status: 400 });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

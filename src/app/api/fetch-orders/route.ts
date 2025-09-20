// file: app/api/fetch-orders/route.ts
import { NextRequest, NextResponse } from "next/server";
// import { supabase } from "@/lib/supabaseclient";
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side key
)

export async function GET(req: NextRequest) {
  try {
    // fetch orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: true });

    if (ordersError) throw ordersError;

    // fetch all order items
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .order("id", { ascending: true });

    if (itemsError) throw itemsError;

    console.log("Orders fetched:", orders);
console.log("Order items fetched:", items);

    // manually attach items to their orders
    const ordersWithItems = (orders || []).map((order) => ({
      ...order,
      items: (items || []).filter((item) => item.order_id === order.id),
    }));

    return NextResponse.json({ orders: ordersWithItems });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

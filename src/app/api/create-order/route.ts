import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // service role key
);

export async function POST(req: Request) {
  try {
    const { cartItems, total, details, reference, userId } = await req.json();

    // 1. Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId || null,
          total_amount: total,
          status: "paid",
          name: details.name,
          email: details.email,
          phone: details.phone,
          address: details.address,
          delivery_method: details.deliveryMethod,
          reference,
        },
      ])
      .select("id")
      .single();

    if (orderError) throw orderError;

    // 2. Insert order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Update stock using RPC
    for (const item of cartItems) {
      const { error: stockError } = await supabase.rpc("decrement_stock", {
        product_id: item.id,
        qty: item.quantity,
      });

      if (stockError) throw stockError;
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err: any) {
    console.error("Error creating order:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { cartItems, serialAssignments, total, details, reference, userId } = await req.json();

    // 1. Insert order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          user_id: userId || null,
          total_amount: total,
          status: "pending",
          name: details.name,
          email: details.email,
          phone: details.phone,
          address: details.address,
          delivery_method: details.delivery,
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
      product_name: item.name,        // ✅ add product name
      product_image: item.image,      // ✅ add product image
      quantity: item.quantity,
      price: item.price,
      ram: item.ram,
      storage: item.storage,
      processor: item.processor,
      display: item.display,
      serial_number: serialAssignments[item.id]
      ?.slice(0, item.quantity)
      .map((s: any) => s.serial_number)
      .join(", ") || null,

    }));


    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

   

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err: any) {
    console.error("Error creating order:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

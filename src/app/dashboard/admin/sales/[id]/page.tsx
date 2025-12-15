"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseclient";
import Image from "next/image";

type OrderItem = {
  product_name: string;
  quantity: number;
  price: number;
  serial_number: string,
  ram: string;
  storage: string;
  processor: string;
  display: string;
};

type Order = {
  id: string;
  name: string;
  total_amount: number;
  created_at: string;
  order_items: OrderItem[];
  
};



export default function ReceiptPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const printMode = searchParams.get("print") === "true";

  const { id } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`id, name, total_amount, created_at, order_items(quantity, product_name, price, storage, processor, serial_number, display, ram)`)
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setOrder(data);

      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (printMode && order) {
      setTimeout(() => {
        window.print();
      }, 800);
    }
  }, [printMode, order]);

  

  if (loading) return <p>Loading receipt...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto border rounded shadow print:border-0 print:shadow-none font-mono" id="printable-receipt">
      <div className="flex items-center justify-center space-x-3 mb-2" >
        <Image
          src="/ashirov-logo.jpg"
          alt="ashirov-logo"
          width={55}
          height={55}
          className="rounded"
        />
        <h1 className="font-bold text-xl text-center">Ashirov Technology</h1>
      </div>

      {/* Business Details */}
      <p className="text-center text-xs mb-3 leading-tight">
        Suite 045 Orago (Lozumba) Commercial Complex, Kam Salem Street, Area 10, Garki Abuja FCT
        <br />
        <span className="font-semibold">Account Name:</span> ASHIROV TECHNOLOGY <br />
        <span className="font-semibold">Bank:</span> Moniepoint MFB <br />
        <span className="font-semibold">Account Number:</span> 5374867746
      </p>

      <div className="border-t border-dashed border-gray-400 my-2"></div>
      {/* Customer Info */}
      <div className="text-xs mb-8 space-y-1">
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
        <p><strong>Reciept no:</strong> {`#${String(order.id).slice(-12)}`}</p>
        <p><strong>Order Id:</strong> {`#${order.id}`}</p>
        <p> <strong>Customer:</strong> {order.name}</p>
        <p><strong>Seller:</strong> Website</p>
      </div>

      <div className="border-t border-dashed border-gray-400 my-2"></div>

      {/* Items Table */}
      <table className="w-full text-[11px] mb-3 border-collapse">
        <thead className="border-b border-gray-400 my-4 border-dashed">
          <tr className="my-2">
            <th className="text-left pb-1">Item</th> 
            <th className="text-center  pb-1">Serial no</th>
            <th className="text-center pb-1">Qty</th>
            <th className="text-center pb-1">Price</th>
            <th className="text-center pb-1">Total</th>
          </tr>
          
        </thead>
       
        

        
        <tbody>
          {order.order_items.map((item, idx) => (
           <tr key={idx}>
             <td>
                <strong>{item.product_name}</strong>
                <div className="text-[9px] leading-tight opacity-80">
                 {<div>{item.ram} GB RAM</div>}
                 {<div>{item.processor} Processor</div>}
                 {<div>{item.storage} Storage</div>}
                 {<div>{item.display} display</div>}
                </div>
              </td>
            
              <td className="text-center">{item.serial_number}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-center">₦{item.price.toLocaleString()}</td>
              <td className="text-center">₦{(item.price * item.quantity).toLocaleString()}</td>
            </tr>
         ))} 
        </tbody>
      </table>
      <div className="border-t border-dashed border-gray-400 my-4">
        <h2 className="text-lg font-bold text-right">Total: ₦{order.total_amount.toLocaleString()}</h2>
      </div>
      <div className="border-t border-dashed border-gray-400 my-4"></div>

      {/* Terms & Conditions */}
      <div className="text-xs leading-relaxed mb-3 space-y-1">
        <p className="font-semibold underline">Terms & Conditions:</p>
        <p>1. No refund of money after payment.</p>
        <p>2. 10% service charge applies if a customer requests a refund instead of a replacement (in case of warranty).</p>
        <p>3. Goods received in good condition.</p>
        <p>4. 30 days warranty from the date of purchase.</p>
        <p>5. Warranty valid only upon presentation of receipt.</p>
      </div>
      <div className="text-center space-x-3 mt-4">
        <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"> Print</button>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #printable-receipt,
          #printable-receipt * {
            visibility: visible;
          }

          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 80%;
            transform: scale(1.2); /* Increase overall print size */
            transform-origin: top left;
            margin: 0;
            padding: 10px;
            font-size: 18px; 
          }

          button {
            display: none !important;
          }
        }
      `}</style> 
    </div>
  );
}



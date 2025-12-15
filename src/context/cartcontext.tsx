"use client";
import { supabase } from "@/lib/supabaseclient";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

// ---------------- types ----------------
export type CartItem = {
  id: number; // DB product id
  name: string;
  brand?: string;
  price: number;
  quantity: number;
  image: string;
  ram?: string;
  storage?: string;
  display?: string;
  maxStock: number
  processor?: string,
  
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  getTotalItems: () => number;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};



const CartContext = createContext<CartContextType | null>(null);

type CartProviderProps = {
  userId?: string; // undefined for guest
  children: ReactNode;
};

// ---------------- helpers ----------------
async function syncToDb(product_id: number, quantity: number) {
  try {
    const res = await fetch("/api/cart-db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id, quantity }),
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Request failed with ${res.status}`);
  } catch (err) {
    console.error("Cart DB sync failed:", err);
  }
}



async function removeFromDb(product_id: number) {
  try {
    const res = await fetch(`/api/cart-db/${product_id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Request failed with ${res.status}`);
  } catch (err) {
    console.error("Cart DB delete failed:", err);
  }
}


// ---------------- context ----------------
export function CartProvider({ userId, children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const prevUserId = useRef<string | null>(null);

  // 👉 1. Log whenever userId changes
  useEffect(() => {
  }, [userId]);

  // ---------------- handle sign out ----------------
  useEffect(() => {
  const prev = prevUserId.current;
  const now = userId ?? null;

  if (prev && prev !== now && !now) {
    setCartItems([]);
    localStorage.removeItem(`cart_${prev}`);
  }

  prevUserId.current = now;
}, [userId]);


  // ---------------- load cart ----------------
  useEffect(() => {
  async function loadCart() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!userId) {
      const guest = localStorage.getItem("cart_guest");
      setCartItems(guest ? JSON.parse(guest) : []);
      return;
    }
    const { data, error } = await supabase
  .from("cart")
  .select(`
    product_id,
    quantity,
    products (
      *
    )
  `)
  .eq("user_id", userId);

    let merged: CartItem[] = [];
    if (!error && data) {
      merged = data.map((row: any) => ({
      id: row.product_id, // fallback if undefined
      name: row.products?.name ?? "",
      price: row.products?.price ?? 0,
      image: row.products?.image_url?.[0],
      processor: row.processor ?? row.products?.processor ?? "",
ram: row.ram ?? row.products?.ram ?? "",
storage: row.storage ?? row.products?.storage ?? "",
display: row.display ?? row.products?.display ?? "",
      quantity: row.quantity,
      maxStock: row.products?.stock ?? 0,   // ✅ correct source
    }));
    }

    // merge guest cart (if any) with DB cart
    const guestRaw = localStorage.getItem("cart_guest");
    if (guestRaw) {
      const guestCart: CartItem[] = JSON.parse(guestRaw);
      guestCart.forEach(item => {
        const existing = merged.find(i => i.id === item.id);
        if (existing) {
          existing.quantity += item.quantity;
          syncToDb(item.id, existing.quantity);
        } else {
          merged.push(item);
          syncToDb(item.id, item.quantity);
        }
      });
      localStorage.removeItem("cart_guest");
    }
    setCartItems(merged);
  }

  loadCart();
}, [userId]);


 // ⚠ important to watch userId


  // ---------------- persist ----------------
  useEffect(() => {
    const key = userId ? `cart_${userId}` : "cart_guest";
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, userId]);

  // ---------------- actions ----------------
  const addToCart = (item: CartItem) => {
  setCartItems((prev) => {
    const existing = prev.find((i) => i.id === item.id);
    const nextQuantity = existing
      ? Math.min(existing.quantity + 1, existing.maxStock)
      : 1;
    const newCart = existing
      ? prev.map((i) =>
          i.id === item.id ? { ...i, quantity: nextQuantity } : i
        )
      : [...prev, { ...item, quantity: nextQuantity }];
    if (userId) syncToDb(item.id, nextQuantity);
    return newCart;
  });
};


//  const updateQuantity = (
//   id: number,
//   quantity: number,
//   newSerial?: string,
//   removeLastSerial: boolean = false
// ) => {
//   setCartItems((prev) => {
//     const updated = prev.map((item) => {
//       if (item.id !== id) return item;

//       let serial_number = item.serial_number || [];

//       if (newSerial) serial_number = [...serial_number, newSerial];
//       if (removeLastSerial) serial_number.pop();

//       return { ...item, quantity };
//     });

//     if (userId) syncToDb(id, quantity);
//     return updated;
//   });
// };


 const updateQuantity = (id: number, quantity: number, ) => {
  setCartItems((prev) => {
    const updated = prev.map((item) => (item.id === id ? { ...item, quantity, } : item));

    

    if (userId) syncToDb(id, quantity);
    return updated;
  });
};





  const removeFromCart = (id: number) => {
    setCartItems((prev) => {
      if (userId) removeFromDb(id);
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    const key = userId ? `cart_${userId}` : "cart_guest";
    localStorage.removeItem(key);
  };

  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, getTotalItems, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

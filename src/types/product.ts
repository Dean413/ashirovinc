export interface Product {
  id?: number;
  name: string;
  brand?: string;
  price?: number;
  stock?: number;
  image_url: string[];    // ✅ always array
  description: string[];  // ✅ always array
  display?: string;
  ram?: string;
  storage?: string;
}

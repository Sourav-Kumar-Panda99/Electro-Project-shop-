export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string;
  category?: Category;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  stock: number | null;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | "New"
  | "Contacted"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string | null;
  state: string | null;
  pincode: string | null;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  status: OrderStatus;
  created_at: string;
}

export interface ShopSettings {
  id: string;
  shop_name: string;
  shop_description: string;
  whatsapp_number: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  currency: string;
  updated_at: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
  quantity: number;
  is_active?: boolean;
}

export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "newest";

import "server-only";
import { isSupabaseConfigured } from "@/lib/config";
import { getDemoDb, demoNextId } from "@/lib/demo/store";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";

export interface CreateOrderInput {
  order_number: string;
  customer_name: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const record: Omit<Order, "id"> = {
    order_number: input.order_number,
    customer_name: input.customer_name,
    phone: input.phone,
    address: input.address,
    city: input.city ?? null,
    state: input.state ?? null,
    pincode: input.pincode ?? null,
    notes: input.notes ?? null,
    items: input.items,
    subtotal: input.subtotal,
    status: "New",
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    const order: Order = { id: demoNextId(), ...record };
    db.orders.unshift(order);
    return order;
  }

  // Uses the admin client because order creation is a public, no-login action —
  // RLS on `orders` only allows admins to read/update, not anonymous inserts.
  const admin = createAdminClient();
  const { data, error } = await admin.from("orders").insert(record).select().single();
  if (error) throw error;
  return data as Order;
}

export async function getOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return getDemoDb().orders;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Order[];
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    const order = db.orders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    order.status = status;
    return order;
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Order;
}

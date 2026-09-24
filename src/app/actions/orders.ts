"use server";

import { getProductById } from "@/lib/repo/products";
import { createOrder } from "@/lib/repo/orders";
import { getSettings } from "@/lib/repo/settings";
import { generateOrderNumber } from "@/lib/whatsapp";
import type { OrderItem } from "@/lib/types";

export interface SubmitOrderInput {
  customerName: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
  items: { productId: string; quantity: number }[];
}

export interface SubmitOrderResult {
  ok: true;
  orderNumber: string;
  shopName: string;
  whatsappNumber: string;
  items: OrderItem[];
  subtotal: number;
  removedItems: string[];
}

export interface SubmitOrderError {
  ok: false;
  error: string;
}

/**
 * Re-prices every line against the live product table (not the client-held cart)
 * so an admin price/availability change between add-to-cart and checkout can never
 * reach the WhatsApp message or the stored order.
 */
export async function submitOrder(
  input: SubmitOrderInput
): Promise<SubmitOrderResult | SubmitOrderError> {
  if (!input.customerName.trim() || !input.phone.trim() || !input.address.trim()) {
    return { ok: false, error: "Name, phone and address are required." };
  }
  if (!/^[6-9]\d{9}$/.test(input.phone.replace(/\D/g, "").slice(-10))) {
    return { ok: false, error: "Please enter a valid 10-digit Indian phone number." };
  }
  if (input.items.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const removedItems: string[] = [];
  const items: OrderItem[] = [];

  for (const line of input.items) {
    const product = await getProductById(line.productId);
    if (!product || !product.is_active) {
      removedItems.push(product?.name ?? "A product in your cart");
      continue;
    }
    items.push({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: line.quantity,
    });
  }

  if (items.length === 0) {
    return { ok: false, error: "None of the items in your cart are currently available." };
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const settings = await getSettings();
  const orderNumber = generateOrderNumber();

  await createOrder({
    order_number: orderNumber,
    customer_name: input.customerName.trim(),
    phone: input.phone.trim(),
    address: input.address.trim(),
    city: input.city?.trim(),
    state: input.state?.trim(),
    pincode: input.pincode?.trim(),
    notes: input.notes?.trim(),
    items,
    subtotal,
  });

  return {
    ok: true,
    orderNumber,
    shopName: settings.shop_name,
    whatsappNumber: settings.whatsapp_number,
    items,
    subtotal,
    removedItems,
  };
}

import { formatINR } from "@/lib/currency";
import type { CartItem } from "@/lib/types";

export interface WhatsAppOrderInput {
  shopName: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
}

export function buildWhatsAppMessage(input: WhatsAppOrderInput): string {
  const addressParts = [input.address, input.city, input.state, input.pincode]
    .filter(Boolean)
    .join(", ");

  const itemLines = input.items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} x ${item.quantity} — ${formatINR(item.price * item.quantity)}`
    )
    .join("\n");

  const totalItems = input.items.reduce((sum, i) => sum + i.quantity, 0);

  const lines = [
    `Hello ${input.shopName},`,
    "",
    "I would like to place an order.",
    "",
    `Order Reference: ${input.orderNumber}`,
    "",
    "Customer Details:",
    `Name: ${input.customerName}`,
    `Phone: ${input.phone}`,
    `Address: ${addressParts}`,
  ];

  if (input.notes) {
    lines.push(`Notes: ${input.notes}`);
  }

  lines.push("", "Order Items:", "", itemLines, "");
  lines.push(`Total Items: ${totalItems}`);
  lines.push(`Estimated Total: ${formatINR(input.subtotal)}`);
  lines.push("", "Please confirm availability and delivery details.", "", "Thank you.");

  return lines.join("\n");
}

/** Builds a wa.me deep link, stripping non-digits from the number and URL-encoding the message. */
export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const digitsOnly = whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

export function generateOrderNumber(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(100 + Math.random() * 900);
  return `EPI-${y}${m}${d}-${rand}`;
}

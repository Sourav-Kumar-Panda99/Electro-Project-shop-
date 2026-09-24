"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { useToastStore } from "@/lib/store/toast";
import { formatINR } from "@/lib/currency";
import { submitOrder } from "@/app/actions/orders";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

interface FormState {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
}

const initialState: FormState = { name: "", phone: "", address: "", city: "", state: "", pincode: "", notes: "" };

export function CheckoutForm() {
  const router = useRouter();
  const { items, getCartTotal, getCartCount, removeFromCart } = useCartStore();
  const show = useToastStore((s) => s.show);

  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    const digits = form.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits.slice(-10)) || digits.length < 10) {
      next.phone = "Enter a valid 10-digit Indian mobile number.";
    }
    if (!form.address.trim()) next.address = "Address is required.";
    if (form.pincode && !/^\d{6}$/.test(form.pincode.trim())) {
      next.pincode = "Pincode must be 6 digits.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      show("Your cart is empty.", "error");
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await submitOrder({
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city || undefined,
        state: form.state || undefined,
        pincode: form.pincode || undefined,
        notes: form.notes || undefined,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });

      if (!result.ok) {
        show(result.error, "error");
        setSubmitting(false);
        return;
      }

      if (result.removedItems.length > 0) {
        show(`Removed unavailable items: ${result.removedItems.join(", ")}`, "info");
      }

      const message = buildWhatsAppMessage({
        shopName: result.shopName,
        orderNumber: result.orderNumber,
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        notes: form.notes,
        items: result.items.map((i) => ({
          productId: i.product_id,
          name: i.name,
          slug: "",
          price: i.price,
          image_url: null,
          quantity: i.quantity,
        })),
        subtotal: result.subtotal,
      });

      const url = buildWhatsAppUrl(result.whatsappNumber, message);
      window.open(url, "_blank", "noopener,noreferrer");

      for (const i of result.items) removeFromCart(i.product_id);
      show("Order sent! Continue the conversation on WhatsApp.", "success");
      router.push("/");
    } catch {
      show("Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
        <ShoppingBag className="h-12 w-12 text-muted" />
        <p className="font-medium text-foreground">Your cart is empty.</p>
        <Link href="/shop" className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          Explore Components
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-3">
        <Field label="Full Name" required error={errors.name}>
          <input value={form.name} onChange={update("name")} className={inputClass(errors.name)} placeholder="Rahul Kumar" />
        </Field>
        <Field label="Phone Number" required error={errors.phone}>
          <input
            value={form.phone}
            onChange={update("phone")}
            className={inputClass(errors.phone)}
            placeholder="9876543210"
            inputMode="tel"
          />
        </Field>
        <Field label="Address" required error={errors.address}>
          <textarea value={form.address} onChange={update("address")} rows={3} className={inputClass(errors.address)} placeholder="House no, street, area" />
        </Field>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="City">
            <input value={form.city} onChange={update("city")} className={inputClass()} />
          </Field>
          <Field label="State">
            <input value={form.state} onChange={update("state")} className={inputClass()} />
          </Field>
          <Field label="Pincode" error={errors.pincode}>
            <input value={form.pincode} onChange={update("pincode")} className={inputClass(errors.pincode)} inputMode="numeric" />
          </Field>
        </div>
        <Field label="Additional Notes">
          <textarea value={form.notes} onChange={update("notes")} rows={2} className={inputClass()} placeholder="Preferred delivery time, etc." />
        </Field>

        <p className="text-xs text-muted">Your order will be sent to WhatsApp for confirmation.</p>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-hover disabled:opacity-60"
        >
          <MessageCircle className="h-4 w-4" />
          {submitting ? "Preparing your order..." : "Send Order on WhatsApp"}
        </button>
      </form>

      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-semibold text-foreground">Order Summary</h2>
          <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-muted">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-foreground">{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t border-border pt-3">
            <div className="flex justify-between text-sm text-muted">
              <span>Total Items</span>
              <span>{getCartCount()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-foreground">
              <span>Total</span>
              <span>{formatINR(getCartTotal())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 ${
    error ? "border-red-500/60" : "border-border focus:border-primary"
  }`;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export const metadata: Metadata = { title: "Checkout | Electro Project Items" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}

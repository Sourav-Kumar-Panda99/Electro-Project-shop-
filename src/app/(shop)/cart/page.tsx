"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function CartPage() {
  const { items, clearCart, getCartTotal, getCartCount } = useCartStore();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">Your Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
          <ShoppingBag className="h-12 w-12 text-muted" />
          <p className="font-medium text-foreground">Your cart is waiting for some components.</p>
          <Link
            href="/shop"
            className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Explore Components
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <div className="divide-y divide-border">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </div>

          <CartSummary subtotal={getCartTotal()} count={getCartCount()} />

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              href="/shop"
              className="rounded-lg border border-border py-2.5 text-center text-sm font-medium text-foreground hover:bg-white/5"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => setConfirmClear(true)}
              className="rounded-lg border border-border py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
            >
              Clear Cart
            </button>
            <Link
              href="/checkout"
              className="rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmClear}
        title="Clear cart?"
        description="This removes every item from your cart. This can't be undone."
        confirmLabel="Clear Cart"
        onConfirm={() => {
          clearCart();
          setConfirmClear(false);
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}

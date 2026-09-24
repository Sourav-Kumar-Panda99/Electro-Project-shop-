"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function CartDrawer() {
  const { items, isOpen, close, clearCart, getCartTotal, getCartCount } = useCartStore();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[85] flex h-full w-full max-w-md flex-col bg-surface-elevated shadow-2xl sm:border-l sm:border-border"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Your Cart ({getCartCount()})
              </h2>
              <button onClick={close} aria-label="Close cart" className="text-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted" />
                  <p className="font-medium text-foreground">Your cart is waiting for some components.</p>
                  <button
                    onClick={close}
                    className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
                  >
                    Explore Components
                  </button>
                </div>
              ) : (
                items.map((item) => <CartItemRow key={item.productId} item={item} />)
              )}
            </div>

            {items.length > 0 && (
              <div className="space-y-3 border-t border-border p-4">
                <CartSummary subtotal={getCartTotal()} count={getCartCount()} />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={close}
                    className="rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-white/5"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="rounded-lg border border-border py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
                  >
                    Clear Cart
                  </button>
                </div>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="block w-full rounded-lg bg-primary py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-hover"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.aside>

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
        </>
      )}
    </AnimatePresence>
  );
}

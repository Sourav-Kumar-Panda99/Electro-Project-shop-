"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          const newItem: CartItem = {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image_url: product.image_url,
            quantity,
          };
          return { items: [...state.items, newItem] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemQuantity: (productId) => {
        return get().items.find((i) => i.productId === productId)?.quantity ?? 0;
      },

      getCartTotal: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      getCartCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: "epi-cart",
      partialize: (state) => ({ items: state.items }),
      // Rehydration is triggered manually (see CartHydration) after the client's
      // first render, so the SSR markup and the initial client render always
      // agree (both start from an empty cart) and React never has to discard
      // and remount the tree to fix a mismatch.
      skipHydration: true,
    }
  )
);

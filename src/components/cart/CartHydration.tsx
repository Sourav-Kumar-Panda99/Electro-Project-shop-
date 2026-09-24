"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart";

/** Rehydrates the persisted cart from localStorage after mount — see cart.ts (skipHydration). */
export function CartHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}

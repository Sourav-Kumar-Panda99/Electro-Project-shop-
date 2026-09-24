"use client";

import { useState } from "react";
import { ImageOff, ShoppingCart, Info } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/currency";
import { useCartStore } from "@/lib/store/cart";
import { useToastStore } from "@/lib/store/toast";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

export function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((s) => s.addToCart);
  const show = useToastStore((s) => s.show);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-white/[0.03]">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
            <ImageOff className="h-12 w-12" />
            <span className="text-sm">Photo coming soon</span>
          </div>
        )}
        <p className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 bg-black/60 px-3 py-2 text-xs text-white/80">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Illustrative product photos — verify exact model/specification before purchase.
        </p>
      </div>

      <div className="flex flex-col">
        {product.category && (
          <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
            {product.category.name}
          </span>
        )}
        <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">{product.name}</h1>
        <p className="mt-3 text-3xl font-extrabold text-foreground">{formatINR(product.price)}</p>

        {!product.is_active && (
          <p className="mt-3 w-fit rounded-lg bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400">
            This product is currently unavailable.
          </p>
        )}

        <p className="mt-4 text-sm leading-relaxed text-muted">
          {product.description || "No additional description provided for this product yet."}
        </p>

        {product.is_active && (
          <div className="mt-8 flex items-center gap-4">
            <QuantitySelector quantity={quantity} onChange={setQuantity} />
            <button
              onClick={() => {
                addToCart(product, quantity);
                show(`${product.name} added to cart`, "success");
                setQuantity(1);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-hover sm:flex-none"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

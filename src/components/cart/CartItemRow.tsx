"use client";

import Link from "next/link";
import { ImageOff, Trash2 } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { formatINR } from "@/lib/currency";
import { useCartStore } from "@/lib/store/cart";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

export function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  return (
    <div className="flex gap-3 border-b border-border py-4">
      <Link
        href={`/products/${item.slug}`}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/[0.03]"
      >
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <ImageOff className="h-5 w-5" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${item.slug}`} className="text-sm font-medium text-foreground hover:text-primary">
            {item.name}
          </Link>
          <button
            onClick={() => removeFromCart(item.productId)}
            aria-label={`Remove ${item.name}`}
            className="text-muted hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted">
          {formatINR(item.price)} × {item.quantity} ={" "}
          <span className="font-semibold text-foreground">{formatINR(item.price * item.quantity)}</span>
        </p>
        <div className="mt-1">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(q) => updateQuantity(item.productId, q)}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

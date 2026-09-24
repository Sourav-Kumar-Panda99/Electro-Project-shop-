"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, ImageOff } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/currency";
import { useCartStore } from "@/lib/store/cart";
import { useToastStore } from "@/lib/store/toast";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

export function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((s) => s.addToCart);
  const show = useToastStore((s) => s.show);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, quantity);
    show(`${product.name} added to cart`, "success");
    setQuantity(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-white/[0.03]">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
              <ImageOff className="h-8 w-8" />
              <span className="text-[11px]">Photo coming soon</span>
            </div>
          )}
          {product.is_featured && (
            <span className="absolute left-2 top-2 rounded-full bg-secondary/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black">
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
          {product.category && (
            <span className="text-[11px] font-medium uppercase tracking-wide text-secondary">
              {product.category.name}
            </span>
          )}
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground sm:text-base">
            {product.name}
          </h3>
          <p className="mt-auto pt-1 text-lg font-bold text-foreground">
            {formatINR(product.price)}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-2 border-t border-border p-3 sm:p-4">
        <QuantitySelector quantity={quantity} onChange={setQuantity} size="sm" />
        <button
          onClick={handleAdd}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-2 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 sm:text-sm"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Add to Cart</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>
    </motion.div>
  );
}

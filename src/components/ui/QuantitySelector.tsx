"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  size?: "sm" | "md";
  max?: number;
}

export function QuantitySelector({ quantity, onChange, size = "md", max }: QuantitySelectorProps) {
  const dims = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const textSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-surface">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onChange(Math.max(1, quantity - 1));
        }}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className={`${dims} flex items-center justify-center rounded-l-lg text-muted transition hover:text-foreground disabled:opacity-30`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={`${dims} ${textSize} flex items-center justify-center font-medium text-foreground`}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onChange(max ? Math.min(max, quantity + 1) : quantity + 1);
        }}
        aria-label="Increase quantity"
        className={`${dims} flex items-center justify-center rounded-r-lg text-muted transition hover:text-foreground`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

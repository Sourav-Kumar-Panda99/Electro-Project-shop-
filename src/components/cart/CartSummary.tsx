import { formatINR } from "@/lib/currency";

export function CartSummary({ subtotal, count }: { subtotal: number; count: number }) {
  return (
    <div className="space-y-1.5 border-t border-border pt-4">
      <div className="flex justify-between text-sm text-muted">
        <span>Total Quantity</span>
        <span>{count}</span>
      </div>
      <div className="flex justify-between text-lg font-bold text-foreground">
        <span>Total</span>
        <span>{formatINR(subtotal)}</span>
      </div>
    </div>
  );
}

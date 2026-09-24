"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";
import { formatINR } from "@/lib/currency";
import { updateOrderStatusAction } from "@/app/actions/admin-orders";

const STATUSES: OrderStatus[] = ["New", "Contacted", "Confirmed", "Completed", "Cancelled"];

const STATUS_COLORS: Record<OrderStatus, string> = {
  New: "bg-primary/15 text-primary",
  Contacted: "bg-secondary/15 text-secondary",
  Confirmed: "bg-emerald-500/15 text-emerald-400",
  Completed: "bg-emerald-500/25 text-emerald-300",
  Cancelled: "bg-red-500/15 text-red-400",
};

export function OrderTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <th className="p-4">Order</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Items</th>
            <th className="p-4">Subtotal</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <Fragment key={order.id}>
              <tr className="border-b border-border last:border-0">
                <td className="p-4 font-medium text-foreground">{order.order_number}</td>
                <td className="p-4 text-foreground">
                  {order.customer_name}
                  <div className="text-xs text-muted">{order.phone}</div>
                </td>
                <td className="p-4 text-muted">{order.items.length} items</td>
                <td className="p-4 text-foreground">{formatINR(order.subtotal)}</td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={async (e) => {
                      await updateOrderStatusAction(order.id, e.target.value as OrderStatus);
                      router.refresh();
                    }}
                    className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-muted">{new Date(order.created_at).toLocaleDateString("en-IN")}</td>
                <td className="p-4">
                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="text-muted hover:text-foreground"
                    aria-label="Toggle details"
                  >
                    {expanded === order.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </td>
              </tr>
              {expanded === order.id && (
                <tr className="border-b border-border bg-background/40">
                  <td colSpan={7} className="p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-muted">Address</p>
                        <p className="text-sm text-foreground">
                          {order.address}
                          {order.city ? `, ${order.city}` : ""}
                          {order.state ? `, ${order.state}` : ""}
                          {order.pincode ? ` - ${order.pincode}` : ""}
                        </p>
                        {order.notes && (
                          <>
                            <p className="mb-1 mt-2 text-xs font-semibold uppercase text-muted">Notes</p>
                            <p className="text-sm text-foreground">{order.notes}</p>
                          </>
                        )}
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase text-muted">Items</p>
                        <ul className="space-y-1 text-sm text-foreground">
                          {order.items.map((item, i) => (
                            <li key={i} className="flex justify-between">
                              <span>
                                {item.name} × {item.quantity}
                              </span>
                              <span>{formatINR(item.price * item.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={7} className="p-8 text-center text-muted">
                No orders yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

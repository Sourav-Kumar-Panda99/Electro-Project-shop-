"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SortOption } from "@/lib/types";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest" },
];

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "default";

  return (
    <select
      value={sort}
      aria-label="Sort products"
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value === "default") params.delete("sort");
        else params.set("sort", e.target.value);
        router.push(`/shop?${params.toString()}`);
      }}
      className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

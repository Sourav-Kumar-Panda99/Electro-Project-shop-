"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/lib/types";

export function CategoryFilter({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const active = searchParams.get("category");

  const linkFor = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    return `/shop?${params.toString()}`;
  };

  return (
    <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      <Link
        href={linkFor(null)}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
          !active
            ? "bg-primary text-white shadow-md shadow-primary/30"
            : "border border-border bg-surface text-muted hover:text-foreground"
        }`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={linkFor(cat.slug)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            active === cat.slug
              ? "bg-primary text-white shadow-md shadow-primary/30"
              : "border border-border bg-surface text-muted hover:text-foreground"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}

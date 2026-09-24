import Link from "next/link";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import type { Category } from "@/lib/types";

export function CategoryCard({ category, count }: { category: Category; count: number }) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <CategoryIcon name={category.icon} className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{category.name}</p>
        <p className="text-xs text-muted">{count} {count === 1 ? "item" : "items"}</p>
      </div>
    </Link>
  );
}

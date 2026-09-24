import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { PackageSearch } from "lucide-react";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
        <PackageSearch className="h-10 w-10 text-muted" />
        <p className="text-lg font-medium text-foreground">No components match your search.</p>
        <p className="text-sm text-muted">Try a different keyword or clear your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

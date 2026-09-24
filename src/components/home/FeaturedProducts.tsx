import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/repo/products";
import { ProductGrid } from "@/components/shop/ProductGrid";

export async function FeaturedProducts() {
  const products = await getProducts({ featuredOnly: true, limit: 8 });
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Popular Components</h2>
          <p className="mt-1 text-sm text-muted">Frequently used parts, picked by the team.</p>
        </div>
        <Link href="/shop" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}

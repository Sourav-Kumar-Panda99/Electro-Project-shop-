import type { Metadata } from "next";
import { getProducts } from "@/lib/repo/products";
import { getCategories } from "@/lib/repo/categories";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CategoryFilter } from "@/components/shop/CategoryFilter";
import { SortDropdown } from "@/components/shop/SortDropdown";
import type { SortOption } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop All Components | Electro Project Items",
  description: "Browse the full catalog of electronic components, tools and modules.",
};

interface ShopPageProps {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { q, category, sort } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({ search: q, categorySlug: category, sort: sort as SortOption }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Shop All Components</h1>
        <p className="mt-1 text-sm text-muted">
          {products.length} {products.length === 1 ? "product" : "products"}
          {category ? " in this category" : ""}
          {q ? ` matching "${q}"` : ""}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <CategoryFilter categories={categories} />
        <div className="flex justify-end">
          <SortDropdown />
        </div>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}

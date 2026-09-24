import { getProducts } from "@/lib/repo/products";
import { getCategories } from "@/lib/repo/categories";
import { ProductTable } from "@/components/admin/ProductTable";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts({ includeInactive: true, sort: "name-asc" }),
    getCategories(),
  ]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-foreground">Products</h1>
      <p className="mb-6 text-sm text-muted">{products.length} products total.</p>
      <ProductTable products={products} categories={categories} />
    </div>
  );
}

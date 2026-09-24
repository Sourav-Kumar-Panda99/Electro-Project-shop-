import { getCategories, getCategoryCounts } from "@/lib/repo/categories";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const [categories, counts] = await Promise.all([getCategories(), getCategoryCounts()]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-foreground">Categories</h1>
      <p className="mb-6 text-sm text-muted">Product counts only include active products.</p>
      <CategoryManager categories={categories} counts={counts} />
    </div>
  );
}

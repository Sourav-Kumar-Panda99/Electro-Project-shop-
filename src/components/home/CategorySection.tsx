import { getCategories, getCategoryCounts } from "@/lib/repo/categories";
import { CategoryCard } from "@/components/shop/CategoryCard";

export async function CategorySection() {
  const [categories, counts] = await Promise.all([getCategories(), getCategoryCounts()]);
  const populated = categories.filter((c) => counts[c.id]);

  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Shop by Category</h2>
      <p className="mt-1 text-sm text-muted">Jump straight to the parts you need.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {populated.map((cat) => (
          <CategoryCard key={cat.id} category={cat} count={counts[cat.id] ?? 0} />
        ))}
      </div>
    </section>
  );
}

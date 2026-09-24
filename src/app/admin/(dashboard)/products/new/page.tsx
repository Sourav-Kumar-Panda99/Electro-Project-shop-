import { getCategories } from "@/lib/repo/categories";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Add Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}

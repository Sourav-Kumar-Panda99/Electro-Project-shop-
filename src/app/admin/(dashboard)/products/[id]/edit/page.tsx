import { notFound } from "next/navigation";
import { getProductById } from "@/lib/repo/products";
import { getCategories } from "@/lib/repo/categories";
import { ProductForm } from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Edit Product</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}

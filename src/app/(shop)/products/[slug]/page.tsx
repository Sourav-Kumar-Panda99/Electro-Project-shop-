import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/repo/products";
import { ProductDetail } from "@/components/shop/ProductDetail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Electro Project Items`,
    description: product.description ?? `Buy ${product.name} — electronic components and project essentials.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <ProductDetail product={product} />
    </div>
  );
}

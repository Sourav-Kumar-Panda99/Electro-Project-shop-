import { redirect } from "next/navigation";

interface CategoryRedirectProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryRedirectPage({ params }: CategoryRedirectProps) {
  const { slug } = await params;
  redirect(`/shop?category=${slug}`);
}

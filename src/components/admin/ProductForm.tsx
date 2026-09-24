"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { createProductAction, updateProductAction } from "@/app/actions/products";
import { useToastStore } from "@/lib/store/toast";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const show = useToastStore((s) => s.show);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(product?.image_url ?? null);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [stock, setStock] = useState(product?.stock?.toString() ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = Number(price);
    if (!name.trim() || Number.isNaN(priceNum) || priceNum < 0 || !categoryId) {
      show("Please fill in a valid name, price and category.", "error");
      return;
    }

    setSaving(true);
    const input = {
      name: name.trim(),
      price: priceNum,
      category_id: categoryId,
      description: description.trim() || null,
      image_url: imageUrl,
      is_active: isActive,
      is_featured: isFeatured,
      stock: stock ? Number(stock) : null,
    };

    try {
      if (product) {
        await updateProductAction(product.id, input);
        show("Product updated.", "success");
      } else {
        await createProductAction(input);
        show("Product created.", "success");
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      show("Could not save product.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4 rounded-2xl border border-border bg-surface p-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Product Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Price (₹)</span>
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Category</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Optional — do not invent specifications that aren't verified."
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <label className="block max-w-xs">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Stock (optional)</span>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Leave blank if not tracked"
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <span className="mb-2 block text-sm font-medium text-foreground">Product Image</span>
          <ImageUploader value={imageUrl} onChange={setImageUrl} />
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-surface p-5">
          <label className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Active</span>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 accent-primary" />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Featured</span>
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 accent-primary" />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {product ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

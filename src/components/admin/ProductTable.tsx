"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ImageOff, Pencil, Trash2, Star, Search } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { formatINR } from "@/lib/currency";
import {
  deleteProductAction,
  toggleProductActiveAction,
  toggleProductFeaturedAction,
} from "@/app/actions/products";
import { useToastStore } from "@/lib/store/toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useRouter } from "next/navigation";

export function ProductTable({ products, categories }: { products: Product[]; categories: Category[] }) {
  const router = useRouter();
  const show = useToastStore((s) => s.show);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryId === "all" || p.category_id === categoryId;
    return matchesSearch && matchesCategory;
  });

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deleteProductAction(pendingDelete.id);
      show(`${pendingDelete.name} deleted.`, "success");
      router.refresh();
    } catch {
      show("Could not delete product.", "error");
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="p-4">Image</th>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0">
                <td className="p-4">
                  <div className="h-10 w-10 overflow-hidden rounded-lg bg-white/5">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted">
                        <ImageOff className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium text-foreground">{product.name}</td>
                <td className="p-4 text-muted">{categoryById.get(product.category_id)?.name ?? "—"}</td>
                <td className="p-4 text-foreground">{formatINR(product.price)}</td>
                <td className="p-4">
                  <button
                    onClick={async () => {
                      await toggleProductActiveAction(product.id, !product.is_active);
                      router.refresh();
                    }}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.is_active ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-muted"
                    }`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={async () => {
                      await toggleProductFeaturedAction(product.id, !product.is_featured);
                      router.refresh();
                    }}
                    aria-label="Toggle featured"
                    className={product.is_featured ? "text-secondary" : "text-muted hover:text-foreground"}
                  >
                    <Star className="h-4 w-4" fill={product.is_featured ? "currentColor" : "none"} />
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-muted hover:text-primary" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => setPendingDelete(product)} className="text-muted hover:text-red-400" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted">
                  No products match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete product?"
        description={`"${pendingDelete?.name}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Check, X, AlertTriangle } from "lucide-react";
import type { Category } from "@/lib/types";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/app/actions/categories";
import { useToastStore } from "@/lib/store/toast";

export function CategoryManager({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const show = useToastStore((s) => s.show);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [reassignTo, setReassignTo] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    await createCategoryAction(newName.trim());
    setNewName("");
    show("Category created.", "success");
    router.refresh();
  }

  async function handleRename(id: string) {
    if (!editValue.trim()) return;
    await updateCategoryAction(id, editValue.trim());
    setEditingId(null);
    show("Category renamed.", "success");
    router.refresh();
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    const hasProducts = (counts[pendingDelete.id] ?? 0) > 0;
    const result = await deleteCategoryAction(
      pendingDelete.id,
      hasProducts && reassignTo ? reassignTo : undefined
    );
    if (!result.ok) {
      show(result.reason ?? "Could not delete category.", "error");
    } else {
      show("Category deleted.", "success");
    }
    setPendingDelete(null);
    setReassignTo("");
    router.refresh();
  }

  const otherCategories = categories.filter((c) => c.id !== pendingDelete?.id);

  return (
    <div>
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="flex-1 max-w-xs rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
        />
        <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface p-4">
            {editingId === cat.id ? (
              <div className="flex flex-1 items-center gap-2">
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                  className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
                <button onClick={() => handleRename(cat.id)} className="text-emerald-400" aria-label="Save">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => setEditingId(null)} className="text-muted" aria-label="Cancel">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-medium text-foreground">{cat.name}</p>
                  <p className="text-xs text-muted">{counts[cat.id] ?? 0} products</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditValue(cat.name);
                    }}
                    className="text-muted hover:text-primary"
                    aria-label="Rename"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setPendingDelete(cat)} className="text-muted hover:text-red-400" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {pendingDelete && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4"
          onClick={() => {
            setPendingDelete(null);
            setReassignTo("");
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl border border-border bg-surface-elevated p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Delete category?</h2>
            </div>

            {(counts[pendingDelete.id] ?? 0) > 0 ? (
              <>
                <p className="mb-3 text-sm text-muted">
                  &quot;{pendingDelete.name}&quot; has {counts[pendingDelete.id]} product(s). Choose a
                  category to move them to before deleting.
                </p>
                <select
                  value={reassignTo}
                  onChange={(e) => setReassignTo(e.target.value)}
                  className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="">— Select category —</option>
                  {otherCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <p className="mb-6 text-sm text-muted">
                &quot;{pendingDelete.name}&quot; will be permanently removed.
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setPendingDelete(null);
                  setReassignTo("");
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:bg-white/5 hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={(counts[pendingDelete.id] ?? 0) > 0 && !reassignTo}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-40"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

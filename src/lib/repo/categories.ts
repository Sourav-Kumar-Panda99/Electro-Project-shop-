import "server-only";
import { isSupabaseConfigured } from "@/lib/config";
import { getDemoDb, demoNextId } from "@/lib/demo/store";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { Category } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return [...getDemoDb().categories].sort((a, b) => a.name.localeCompare(b.name));
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data as Category[];
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    const counts: Record<string, number> = {};
    for (const p of db.products) {
      if (!p.is_active) continue;
      counts[p.category_id] = (counts[p.category_id] ?? 0) + 1;
    }
    return counts;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("category_id")
    .eq("is_active", true);
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data as { category_id: string }[]) {
    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
  }
  return counts;
}

export async function createCategory(name: string, icon = "package"): Promise<Category> {
  const slug = slugify(name);
  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    const category: Category = {
      id: demoNextId(),
      name,
      slug,
      icon,
      created_at: new Date().toISOString(),
    };
    db.categories.push(category);
    return category;
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("categories")
    .insert({ name, slug, icon })
    .select()
    .single();
  if (error) throw error;
  return data as Category;
}

export async function updateCategory(
  id: string,
  fields: Partial<Pick<Category, "name" | "icon">>
): Promise<Category> {
  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    const category = db.categories.find((c) => c.id === id);
    if (!category) throw new Error("Category not found");
    Object.assign(category, fields, fields.name ? { slug: slugify(fields.name) } : {});
    return category;
  }
  const admin = createAdminClient();
  const patch: Record<string, unknown> = { ...fields };
  if (fields.name) patch.slug = slugify(fields.name);
  const { data, error } = await admin
    .from("categories")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string): Promise<{ ok: boolean; reason?: string }> {
  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    const hasProducts = db.products.some((p) => p.category_id === id);
    if (hasProducts) {
      return { ok: false, reason: "Category still has products assigned to it." };
    }
    db.categories = db.categories.filter((c) => c.id !== id);
    return { ok: true };
  }
  const supabase = await createClient();
  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);
  if (count && count > 0) {
    return { ok: false, reason: "Category still has products assigned to it." };
  }
  const admin = createAdminClient();
  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) throw error;
  return { ok: true };
}

export async function reassignCategoryProducts(fromId: string, toId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    for (const p of db.products) {
      if (p.category_id === fromId) p.category_id = toId;
    }
    return;
  }
  const admin = createAdminClient();
  const { error } = await admin
    .from("products")
    .update({ category_id: toId })
    .eq("category_id", fromId);
  if (error) throw error;
}

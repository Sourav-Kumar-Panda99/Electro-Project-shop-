import "server-only";
import { isSupabaseConfigured } from "@/lib/config";
import { getDemoDb, demoNextId } from "@/lib/demo/store";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { Product, SortOption } from "@/lib/types";

export interface ProductFilters {
  search?: string;
  categorySlug?: string;
  sort?: SortOption;
  /** Admin views need inactive products too; customer-facing views default to active-only. */
  includeInactive?: boolean;
  featuredOnly?: boolean;
  limit?: number;
}

function applyFilters(products: Product[], filters: ProductFilters, categorySlugById: Map<string, string>) {
  let result = products;

  if (!filters.includeInactive) {
    result = result.filter((p) => p.is_active);
  }
  if (filters.featuredOnly) {
    result = result.filter((p) => p.is_featured);
  }
  if (filters.categorySlug) {
    result = result.filter((p) => categorySlugById.get(p.category_id) === filters.categorySlug);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }

  result = [...result];
  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "newest":
      result.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      break;
    default:
      break;
  }

  if (filters.limit) result = result.slice(0, filters.limit);
  return result;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    const categorySlugById = new Map(db.categories.map((c) => [c.id, c.slug]));
    const withCategory = db.products.map((p) => ({
      ...p,
      category: db.categories.find((c) => c.id === p.category_id),
    }));
    return applyFilters(withCategory, filters, categorySlugById);
  }

  const supabase = await createClient();
  let query = supabase.from("products").select("*, category:categories(*)");

  if (!filters.includeInactive) query = query.eq("is_active", true);
  if (filters.featuredOnly) query = query.eq("is_featured", true);
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);
  if (filters.categorySlug) {
    query = query.eq("category.slug", filters.categorySlug);
  }

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "name-asc":
      query = query.order("name", { ascending: true });
      break;
    case "name-desc":
      query = query.order("name", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("name", { ascending: true });
  }

  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;

  // Supabase's inner-join-via-filter on an embedded resource can return null categories
  // for unrelated rows depending on join strategy; drop anything that slipped through.
  const rows = data as Product[];
  return filters.categorySlug ? rows.filter((p) => p.category?.slug === filters.categorySlug) : rows;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    const product = db.products.find((p) => p.slug === slug);
    if (!product) return null;
    return { ...product, category: db.categories.find((c) => c.id === product.category_id) };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    const product = db.products.find((p) => p.id === id);
    if (!product) return null;
    return { ...product, category: db.categories.find((c) => c.id === product.category_id) };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export interface ProductInput {
  name: string;
  description?: string | null;
  price: number;
  category_id: string;
  image_url?: string | null;
  is_active: boolean;
  is_featured: boolean;
  stock?: number | null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const now = new Date().toISOString();
  const record = {
    name: input.name,
    slug: slugify(input.name),
    description: input.description ?? null,
    price: input.price,
    category_id: input.category_id,
    image_url: input.image_url ?? null,
    is_active: input.is_active,
    is_featured: input.is_featured,
    stock: input.stock ?? null,
  };

  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    const product: Product = { id: demoNextId(), created_at: now, updated_at: now, ...record };
    db.products.push(product);
    return product;
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from("products").insert(record).select().single();
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  const patch: Record<string, unknown> = { ...input, updated_at: new Date().toISOString() };
  if (input.name) patch.slug = slugify(input.name);

  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    const product = db.products.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    Object.assign(product, patch);
    return product;
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("products")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    db.products = db.products.filter((p) => p.id !== id);
    return;
  }
  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) throw error;
}

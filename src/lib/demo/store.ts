import "server-only";
import { CATEGORY_ICONS, CATEGORY_NAMES, SEED_PRODUCTS } from "@/data/seed-catalog";
import { slugify } from "@/lib/slug";
import type { Category, Order, Product, ShopSettings } from "@/lib/types";

/**
 * Zero-config in-memory data store used when Supabase env vars are absent, so the
 * site runs and can be fully explored (including admin CRUD) without any setup.
 * State lives on `globalThis` so it survives Next.js dev hot-reloads, and resets
 * whenever the server process restarts — same tradeoff as any other demo mode.
 */

interface DemoDb {
  categories: Category[];
  products: Product[];
  orders: Order[];
  settings: ShopSettings;
  nextId: number;
}

function buildInitialDb(): DemoDb {
  let idCounter = 1;
  const nextId = () => String(idCounter++);

  const categories: Category[] = CATEGORY_NAMES.map((name) => ({
    id: nextId(),
    name,
    slug: slugify(name),
    icon: CATEGORY_ICONS[name] ?? "package",
    created_at: new Date("2026-01-01").toISOString(),
  }));

  const categoryIdByName = new Map(categories.map((c) => [c.name, c.id]));

  const now = new Date("2026-01-01").toISOString();
  const products: Product[] = SEED_PRODUCTS.map((p) => ({
    id: nextId(),
    name: p.name,
    slug: slugify(p.name),
    description: null,
    price: p.price,
    category_id: categoryIdByName.get(p.category)!,
    image_url: null,
    is_active: true,
    is_featured: Boolean(p.featured),
    stock: null,
    created_at: now,
    updated_at: now,
  }));

  const settings: ShopSettings = {
    id: "1",
    shop_name: "Electro Project Items",
    shop_description:
      "Components, tools, modules and project essentials — all in one place.",
    whatsapp_number: "919999999999",
    phone: null,
    email: null,
    address: null,
    logo_url: null,
    currency: "INR",
    updated_at: now,
  };

  return { categories, products, orders: [], settings, nextId: idCounter };
}

declare global {
  var __electroDemoDb: DemoDb | undefined;
}

export function getDemoDb(): DemoDb {
  if (!globalThis.__electroDemoDb) {
    globalThis.__electroDemoDb = buildInitialDb();
  }
  return globalThis.__electroDemoDb;
}

export function demoNextId(): string {
  const db = getDemoDb();
  return String(db.nextId++);
}

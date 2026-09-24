// Generates supabase/seed.sql from the single source of truth in src/data/seed-catalog.ts.
// Run with: node scripts/generate-seed-sql.ts
import { writeFileSync } from "node:fs";
import { CATEGORY_ICONS, CATEGORY_NAMES, SEED_PRODUCTS } from "../src/data/seed-catalog.ts";

function esc(value: string): string {
  return value.replace(/'/g, "''");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[×µ]/g, (c) => (c === "×" ? "x" : "u"))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const lines: string[] = [];

lines.push("-- Generated from src/data/seed-catalog.ts — do not hand-edit product rows here.");
lines.push("-- Re-run `node scripts/generate-seed-sql.ts` after changing the catalog source.");
lines.push("");
lines.push("insert into shop_settings (shop_name, shop_description, whatsapp_number, currency)");
lines.push(
  "values ('Electro Project Items', 'Components, tools, modules and project essentials — all in one place.', '919999999999', 'INR')"
);
lines.push("on conflict do nothing;");
lines.push("");

lines.push("insert into categories (name, slug, icon) values");
lines.push(
  CATEGORY_NAMES.map(
    (name, i) =>
      `  ('${esc(name)}', '${slugify(name)}', '${CATEGORY_ICONS[name] ?? "package"}')${i === CATEGORY_NAMES.length - 1 ? "" : ","}`
  ).join("\n")
);
lines.push("on conflict (slug) do nothing;");
lines.push("");

lines.push("insert into products (name, slug, price, category_id, is_featured) values");
lines.push(
  SEED_PRODUCTS.map((p, i) => {
    const slug = slugify(p.name);
    return `  ('${esc(p.name)}', '${slug}', ${p.price}, (select id from categories where slug = '${slugify(p.category)}'), ${p.featured ? "true" : "false"})${i === SEED_PRODUCTS.length - 1 ? "" : ","}`;
  }).join("\n")
);
lines.push("on conflict (slug) do nothing;");
lines.push("");

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), lines.join("\n") + "\n");
console.log(`Generated supabase/seed.sql with ${SEED_PRODUCTS.length} products and ${CATEGORY_NAMES.length} categories.`);

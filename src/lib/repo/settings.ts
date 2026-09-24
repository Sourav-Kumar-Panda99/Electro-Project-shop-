import "server-only";
import { isSupabaseConfigured } from "@/lib/config";
import { getDemoDb } from "@/lib/demo/store";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ShopSettings } from "@/lib/types";

const FALLBACK_SETTINGS: ShopSettings = {
  id: "",
  shop_name: "Electro Project Items",
  shop_description: "Components, tools, modules and project essentials — all in one place.",
  whatsapp_number: "",
  phone: null,
  email: null,
  address: null,
  logo_url: null,
  currency: "INR",
  updated_at: new Date(0).toISOString(),
};

export async function getSettings(): Promise<ShopSettings> {
  if (!isSupabaseConfigured()) {
    return getDemoDb().settings;
  }
  const supabase = await createClient();
  // maybeSingle (not single) — an empty shop_settings table (e.g. schema
  // migrated but supabase/seed.sql not yet run) should render the site with
  // sane defaults, not throw and take down every page that reads settings.
  const { data, error } = await supabase.from("shop_settings").select("*").limit(1).maybeSingle();
  if (error) throw error;
  return (data as ShopSettings | null) ?? FALLBACK_SETTINGS;
}

export async function updateSettings(
  fields: Partial<Omit<ShopSettings, "id" | "updated_at">>
): Promise<ShopSettings> {
  if (!isSupabaseConfigured()) {
    const db = getDemoDb();
    Object.assign(db.settings, fields, { updated_at: new Date().toISOString() });
    return db.settings;
  }
  const admin = createAdminClient();
  const current = await getSettings();

  // No row yet (empty table, e.g. seed.sql was never run) — create one instead
  // of updating a row that doesn't exist.
  if (!current.id) {
    const { data, error } = await admin
      .from("shop_settings")
      .insert({ ...FALLBACK_SETTINGS, ...fields, id: undefined })
      .select()
      .single();
    if (error) throw error;
    return data as ShopSettings;
  }

  const { data, error } = await admin
    .from("shop_settings")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", current.id)
    .select()
    .single();
  if (error) throw error;
  return data as ShopSettings;
}

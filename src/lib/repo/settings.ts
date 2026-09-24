import "server-only";
import { isSupabaseConfigured } from "@/lib/config";
import { getDemoDb } from "@/lib/demo/store";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ShopSettings } from "@/lib/types";

export async function getSettings(): Promise<ShopSettings> {
  if (!isSupabaseConfigured()) {
    return getDemoDb().settings;
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("shop_settings").select("*").limit(1).single();
  if (error) throw error;
  return data as ShopSettings;
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
  const { data, error } = await admin
    .from("shop_settings")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", current.id)
    .select()
    .single();
  if (error) throw error;
  return data as ShopSettings;
}

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import * as settingsRepo from "@/lib/repo/settings";
import type { ShopSettings } from "@/lib/types";

export async function updateSettingsAction(
  fields: Partial<Omit<ShopSettings, "id" | "updated_at">>
) {
  await requireAdmin();
  const settings = await settingsRepo.updateSettings(fields);
  revalidatePath("/", "layout");
  return settings;
}

"use server";

import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_BYTES = 5 * 1024 * 1024;
const PRODUCT_IMAGES_BUCKET = "product-images";

export interface UploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

export async function uploadProductImageAction(formData: FormData): Promise<UploadResult> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "No file provided." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Only image files are allowed." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Image must be smaller than 5MB." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!isSupabaseConfigured()) {
    // Demo mode has no storage backend — embed the image as a data URL instead.
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    return { ok: true, url: dataUrl };
  }

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await admin.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) {
    return { ok: false, error: `Upload failed: ${error.message}` };
  }

  const { data } = admin.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

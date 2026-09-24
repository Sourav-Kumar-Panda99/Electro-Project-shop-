"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import type { ShopSettings } from "@/lib/types";
import { updateSettingsAction } from "@/app/actions/settings";
import { useToastStore } from "@/lib/store/toast";

export function SettingsForm({ settings }: { settings: ShopSettings }) {
  const router = useRouter();
  const show = useToastStore((s) => s.show);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    shop_name: settings.shop_name,
    shop_description: settings.shop_description,
    whatsapp_number: settings.whatsapp_number,
    phone: settings.phone ?? "",
    email: settings.email ?? "",
    address: settings.address ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettingsAction({
        shop_name: form.shop_name.trim(),
        shop_description: form.shop_description.trim(),
        whatsapp_number: form.whatsapp_number.replace(/[^0-9]/g, ""),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        address: form.address.trim() || null,
      });
      show("Settings saved.", "success");
      router.refresh();
    } catch {
      show("Could not save settings.", "error");
    } finally {
      setSaving(false);
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-2xl border border-border bg-surface p-6">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">Shop Name</span>
        <input {...field("shop_name")} required className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">Shop Description</span>
        <textarea {...field("shop_description")} rows={2} className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">WhatsApp Number (with country code)</span>
        <input {...field("whatsapp_number")} required placeholder="919876543210" className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" />
        <span className="mt-1 block text-xs text-muted">Digits only, including country code — this is where customer orders are sent.</span>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Contact Phone</span>
          <input {...field("phone")} className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
          <input {...field("email")} type="email" className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">Address</span>
        <textarea {...field("address")} rows={2} className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" />
      </label>

      <label className="block max-w-[10rem]">
        <span className="mb-1.5 block text-sm font-medium text-foreground">Currency</span>
        <input value={settings.currency} disabled className="w-full rounded-lg border border-border bg-background/50 px-3.5 py-2.5 text-sm text-muted" />
      </label>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Settings
      </button>
    </form>
  );
}

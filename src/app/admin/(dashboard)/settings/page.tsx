import { getSettings } from "@/lib/repo/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-foreground">Settings</h1>
      <p className="mb-6 text-sm text-muted">Shop details and the WhatsApp number used for all orders.</p>
      <SettingsForm settings={settings} />
    </div>
  );
}

import { getCategories } from "@/lib/repo/categories";
import { getSettings } from "@/lib/repo/settings";
import { Header } from "@/components/layout/Header";

export async function SiteHeader() {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);
  return <Header shopName={settings.shop_name} categories={categories} />;
}

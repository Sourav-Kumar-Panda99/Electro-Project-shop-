import Link from "next/link";
import { Cpu, MessageCircle, Lock } from "lucide-react";
import { getSettings } from "@/lib/repo/settings";
import { getCategories } from "@/lib/repo/categories";

export async function Footer() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Cpu className="h-4 w-4" />
            </span>
            {settings.shop_name}
          </Link>
          <p className="mt-3 text-sm text-muted">{settings.shop_description}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Shop</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/shop" className="hover:text-foreground">All Products</Link></li>
            <li><Link href="/cart" className="hover:text-foreground">Cart</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Categories</h3>
          <ul className="space-y-2 text-sm text-muted">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link href={`/shop?category=${c.slug}`} className="hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Get in Touch</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </li>
            {settings.phone && <li>{settings.phone}</li>}
            {settings.email && <li>{settings.email}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center text-xs text-muted sm:flex-row sm:justify-between sm:text-left">
          <p>
            Product images are illustrative. Please verify exact model/specification before purchase.
            <span className="mx-2">·</span>© {new Date().getFullYear()} {settings.shop_name}
          </p>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-muted/50 transition hover:border-border hover:text-muted"
          >
            <Lock className="h-3 w-3" />
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

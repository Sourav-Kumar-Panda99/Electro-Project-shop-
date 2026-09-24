"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, FolderTree, ClipboardList, Settings, LogOut, Cpu, X } from "lucide-react";
import { signOutAdmin } from "@/app/actions/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-full flex-col gap-1 p-4">
      <div className="mb-4 flex items-center justify-between px-2">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Cpu className="h-4 w-4" />
          </span>
          Admin
        </Link>
        <button onClick={onNavigate} className="text-muted hover:text-foreground md:hidden" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-primary/15 text-primary" : "text-muted hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}

      <button
        onClick={async () => {
          await signOutAdmin();
          router.push("/admin/login");
          router.refresh();
        }}
        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
}

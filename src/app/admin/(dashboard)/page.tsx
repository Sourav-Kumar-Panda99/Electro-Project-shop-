import Link from "next/link";
import { Package, PackageCheck, FolderTree, ClipboardList } from "lucide-react";
import { getProducts } from "@/lib/repo/products";
import { getCategories } from "@/lib/repo/categories";
import { getOrders } from "@/lib/repo/orders";

export default async function AdminDashboardPage() {
  const [allProducts, categories, orders] = await Promise.all([
    getProducts({ includeInactive: true }),
    getCategories(),
    getOrders(),
  ]);

  const activeCount = allProducts.filter((p) => p.is_active).length;

  const cards = [
    { label: "Total Products", value: allProducts.length, icon: Package, href: "/admin/products" },
    { label: "Active Products", value: activeCount, icon: PackageCheck, href: "/admin/products" },
    { label: "Categories", value: categories.length, icon: FolderTree, href: "/admin/categories" },
    { label: "Total Orders", value: orders.length, icon: ClipboardList, href: "/admin/orders" },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted">Overview of your shop.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/40"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted">No orders yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{order.order_number}</p>
                  <p className="text-muted">{order.customer_name}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

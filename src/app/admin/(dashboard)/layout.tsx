import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface md:block">
        <AdminSidebar />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader email={session.email} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

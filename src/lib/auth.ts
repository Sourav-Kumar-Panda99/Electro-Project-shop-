import "server-only";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export const DEMO_ADMIN_COOKIE = "epi_demo_admin";

export interface AdminSession {
  isAdmin: boolean;
  email: string | null;
}

/** Reads the current admin session without redirecting — safe for layouts/UI checks. */
export async function getAdminSession(): Promise<AdminSession> {
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get(DEMO_ADMIN_COOKIE)?.value === "1";
    return { isAdmin, email: isAdmin ? "admin@electroproject.demo" : null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { isAdmin: false, email: null };

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return { isAdmin: Boolean(profile), email: user.email ?? null };
}

/** Throws if the current request is not an authenticated admin — call at the top of server actions. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    throw new Error("Unauthorized: admin session required.");
  }
  return session;
}

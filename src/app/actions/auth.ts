"use server";

import { cookies } from "next/headers";
import { isSupabaseConfigured, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { DEMO_ADMIN_COOKIE } from "@/lib/auth";

export interface SignInResult {
  ok: boolean;
  error?: string;
}

export async function signInAdmin(email: string, password: string): Promise<SignInResult> {
  if (!isSupabaseConfigured()) {
    if (email.trim().toLowerCase() === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set(DEMO_ADMIN_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });
      return { ok: true };
    }
    return { ok: false, error: "Invalid demo admin credentials." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { ok: false, error: "Invalid email or password." };
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return { ok: false, error: "This account does not have admin access." };
  }

  return { ok: true };
}

export async function signOutAdmin(): Promise<void> {
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    cookieStore.delete(DEMO_ADMIN_COOKIE);
    return;
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
}

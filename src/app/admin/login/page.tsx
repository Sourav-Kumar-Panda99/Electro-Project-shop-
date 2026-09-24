"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cpu, Lock } from "lucide-react";
import { signInAdmin } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const demoMode = !isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signInAdmin(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Login failed.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Cpu className="h-6 w-6" />
          </span>
          <h1 className="text-lg font-bold text-foreground">Admin Sign In</h1>
          <p className="text-xs text-muted">Electro Project Items dashboard</p>
        </div>

        {demoMode && (
          <div className="mb-4 rounded-lg border border-secondary/30 bg-secondary/10 p-3 text-xs text-secondary">
            Demo mode — sign in with <strong>admin@electroproject.demo</strong> /{" "}
            <strong>demo-admin</strong>. Connect Supabase for real authentication.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <Link href="/" className="mt-6 block text-center text-xs text-muted hover:text-foreground">
          ← Back to store
        </Link>
      </div>
    </div>
  );
}

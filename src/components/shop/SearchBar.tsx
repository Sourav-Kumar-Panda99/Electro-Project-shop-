"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  const [, startTransition] = useTransition();

  // Keep the input in sync when the URL's `q` changes from outside this
  // component (browser back/forward, clearing filters elsewhere) — adjusting
  // state during render instead of in an effect avoids an extra render pass.
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setValue(urlQuery);
  }

  useEffect(() => {
    // Skip firing on mount and whenever `value` merely reflects the current
    // URL (e.g. right after the render-time sync above) — only navigate once
    // the user has actually typed something different.
    if (value === syncedQuery) return;

    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("q", value);
      else params.delete("q");
      const target = pathname === "/shop" ? pathname : "/shop";
      startTransition(() => {
        router.push(`${target}?${params.toString()}`);
      });
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search components, e.g. ESP32"
        aria-label="Search products"
        className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-9 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

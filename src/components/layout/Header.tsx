"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingCart, X, Cpu } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { SearchBar } from "@/components/shop/SearchBar";
import type { Category } from "@/lib/types";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export function Header({ shopName, categories }: { shopName: string; categories: Category[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const pathname = usePathname();
  const toggleCart = useCartStore((s) => s.toggle);
  // Cart state starts empty on both server and client (see CartHydration —
  // the persisted store is rehydrated from localStorage right after mount),
  // so this never mismatches the SSR markup.
  const displayCount = useCartStore((s) => s.getCartCount());

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold text-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Cpu className="h-5 w-5" />
          </span>
          <span className="hidden text-base leading-tight sm:block">
            Electro Project
            <br />
            Items
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === link.href ? "text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="group relative">
            <button className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:text-foreground">
              Categories
            </button>
            <div className="invisible absolute left-0 top-full grid w-64 grid-cols-1 gap-0.5 rounded-xl border border-border bg-surface-elevated p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-foreground"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="hidden flex-1 md:block md:max-w-xs lg:max-w-sm">
          <Suspense fallback={<div className="h-10 rounded-full border border-border bg-surface" />}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Search"
            className="rounded-lg p-2 text-muted hover:text-foreground md:hidden"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={toggleCart}
            aria-label={`Cart, ${displayCount} items`}
            className="relative rounded-lg p-2 text-muted hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            {displayCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-black">
                {displayCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-muted hover:text-foreground md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <Suspense fallback={<div className="h-10 rounded-full border border-border bg-surface" />}>
            <SearchBar />
          </Suspense>
        </div>
      )}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[95] bg-black/60 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="ml-auto flex h-full w-72 flex-col gap-1 bg-surface-elevated p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-foreground">{shopName}</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5 text-muted" />
                </button>
              </div>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
              <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Categories
              </p>
              <div className="flex-1 overflow-y-auto">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

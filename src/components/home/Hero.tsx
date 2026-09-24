"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid } from "lucide-react";

export function Hero() {
  return (
    <section className="circuit-bg relative overflow-hidden border-b border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-secondary"
        >
          Components · Tools · Modules · Project Essentials
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl"
        >
          Build. Prototype. Create.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl text-balance text-base text-muted sm:text-lg"
        >
          Electronic components, modules, tools and project essentials — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-3 pt-2 sm:flex-row"
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-hover hover:shadow-primary/50"
          >
            Shop Components
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/shop#categories"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-7 py-3 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
          >
            <LayoutGrid className="h-4 w-4" />
            View Categories
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

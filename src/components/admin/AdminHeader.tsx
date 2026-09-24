"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminHeader({ email }: { email: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:hidden">
      <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-muted hover:text-foreground">
        <Menu className="h-5 w-5" />
      </button>
      <Link href="/admin" className="font-semibold text-foreground">
        Admin
      </Link>
      <span className="max-w-[120px] truncate text-xs text-muted">{email}</span>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="h-full w-64 bg-surface-elevated"
              onClick={(e) => e.stopPropagation()}
            >
              <AdminSidebar onNavigate={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

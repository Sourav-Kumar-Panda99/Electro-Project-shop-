"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/lib/store/toast";

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };
const COLORS = {
  success: "border-emerald-500/40 text-emerald-300",
  error: "border-red-500/40 text-red-300",
  info: "border-primary/40 text-secondary",
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.variant];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`glass flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-black/30 ${COLORS[t.variant]}`}
              role="status"
            >
              <Icon className="h-5 w-5 shrink-0" />
              <p className="text-sm text-foreground">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-2 text-muted hover:text-foreground"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

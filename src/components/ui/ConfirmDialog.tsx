"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-sm rounded-2xl border border-border bg-surface-elevated p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${danger ? "bg-red-500/15 text-red-400" : "bg-primary/15 text-primary"}`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 id="confirm-title" className="text-lg font-semibold text-foreground">
                {title}
              </h2>
            </div>
            <p className="mb-6 text-sm text-muted">{description}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:bg-white/5 hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${danger ? "bg-red-600 hover:bg-red-500" : "bg-primary hover:bg-primary-hover"}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

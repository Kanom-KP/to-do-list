"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface ToastMessage {
  id: number;
  message: string;
  variant?: "default" | "error" | "success";
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastMessage["variant"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const toast = useCallback((message: string, variant: ToastMessage["variant"] = "default") => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 4000);
  }, []);
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-xl border-2 px-4 py-3 text-sm font-medium shadow-lg",
              m.variant === "error" &&
                "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/80 dark:text-red-200",
              m.variant === "success" &&
                "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950/80 dark:text-teal-200",
              (!m.variant || m.variant === "default") &&
                "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)]"
            )}
          >
            {m.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

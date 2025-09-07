"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

// Typy
export type ToastVariant = "success" | "error" | "info" | "custom";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastOptions = {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
  background?: string;
  textColor?: string;
};

export type ToastAPI = {
  show: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
};

// Kontekst
const ToastContext = createContext<ToastAPI | null>(null);

export function useToast(): ToastAPI {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast musi być użyty wewnątrz <ToastProvider>");
  return ctx;
}

// Pomocnicze
const genId = () => Math.random().toString(36).slice(2, 9);

const variantStyles: Record<Exclude<ToastVariant, "custom">, {
  bg: string;
  ring: string;
  icon: React.ReactNode;
}> = {
  success: {
    bg: "bg-emerald-600",
    ring: "ring-emerald-300/40",
    icon: <CheckCircle2 className="h-5 w-5" aria-hidden />,
  },
  error: {
    bg: "bg-rose-600",
    ring: "ring-rose-300/40",
    icon: <AlertCircle className="h-5 w-5" aria-hidden />,
  },
  info: {
    bg: "bg-cyan-600",
    ring: "ring-cyan-300/40",
    icon: <Info className="h-5 w-5" aria-hidden />,
  },
};

// Provider
export type ToastProviderProps = {
  children?: React.ReactNode;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  maxStack?: number;
};

export default function ToastProvider({
  children,
  position = "top-right",
  maxStack = 3,
}: ToastProviderProps) {
  const [items, setItems] = useState<(ToastOptions & { id: string; createdAt: number })[]>([]);
  const portalElRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const el = document.getElementById("toast-portal");
      if (el) portalElRef.current = el;
      else {
        const node = document.createElement("div");
        node.id = "toast-portal";
        document.body.appendChild(node);
        portalElRef.current = node;
      }
    }
  }, []);

  const show = useCallback((opts: ToastOptions) => {
    const id = opts.id ?? genId();
    setItems((prev) => {
      const next = [{ ...opts, id, createdAt: Date.now() }, ...prev];
      return next.slice(0, maxStack);
    });
    return id;
  }, [maxStack]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  const api = useMemo<ToastAPI>(() => ({ show, dismiss, clearAll }), [show, dismiss, clearAll]);

  const posClass = useMemo(() => {
    const base = "fixed z-[1000] p-4 gap-2 flex flex-col pointer-events-none";
    switch (position) {
      case "top-left": return `${base} top-4 left-4 items-start`;
      case "top-center": return `${base} top-4 inset-x-0 items-center`;
      case "top-right": return `${base} top-4 right-4 items-end`;
      case "bottom-left": return `${base} bottom-4 left-4 items-start`;
      case "bottom-center": return `${base} bottom-4 inset-x-0 items-center`;
      default: return `${base} bottom-4 right-4 items-end`;
    }
  }, [position]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted && portalElRef.current && createPortal(
        <div className={posClass} role="region" aria-live="polite">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <ToastItem key={item.id} item={item} onClose={() => dismiss(item.id)} />
            ))}
          </AnimatePresence>
        </div>,
        portalElRef.current
      )}
    </ToastContext.Provider>
  );
}

// Pojedynczy toast
function ToastItem({ item, onClose }: { item: ToastOptions & { id: string; createdAt: number }; onClose: () => void; }) {
  const [hover, setHover] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = item.duration ?? 3000;

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const run = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      if (!hover) setProgress(pct);
      if (elapsed >= duration && !hover) onClose();
      else raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [duration, hover, onClose]);

  const variant = item.variant ?? "info";
  const vs = variant !== "custom" ? variantStyles[variant] : null;

  const bgStyle = variant === "custom" && item.background ? (isHexColor(item.background) ? undefined : item.background) : vs?.bg;
  const inlineBg = variant === "custom" && item.background && isHexColor(item.background) ? { backgroundColor: item.background } as React.CSSProperties : undefined;
  const textStyle = variant === "custom" && item.textColor && isHexColor(item.textColor) ? { color: item.textColor } as React.CSSProperties : undefined;

  const ringClass = variant !== "custom" && vs ? vs.ring : "ring-white/10";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.6 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`pointer-events-auto w-full max-w-sm rounded-lg shadow-lg ring-1 text-white ${bgStyle ?? "bg-gray-800"} ${ringClass}`}
      style={{ ...(inlineBg || {}), ...(textStyle || {}) }}
      role="status"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0" aria-hidden>
            {variant === "custom" ? <div className="h-5 w-5 rounded-full bg-white/30" /> : vs?.icon}
          </div>
          <div className="flex-1 min-w-0">
            {item.title && <p className="text-sm font-semibold leading-5">{item.title}</p>}
            {item.description && <p className="mt-0.5 text-sm opacity-95 break-words">{item.description}</p>}
            {item.action && (
              <div className="mt-3">
                <button
                  onClick={() => { item.action?.onClick(); onClose(); }}
                  className="px-3 py-1.5 text-sm font-medium underline underline-offset-4"
                >
                  {item.action.label}
                </button>
              </div>
            )}
          </div>
          <div>
            <button onClick={onClose} className="rounded-md p-1.5 text-white/90 hover:text-white focus:outline-none" aria-label="Zamknij toast">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </motion.div>
  );
}

// Pomocnicza funkcja
function isHexColor(v?: string) {
  return !!v && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
}

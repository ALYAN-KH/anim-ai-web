"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 7.75v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.75" r="0.9" fill="currentColor" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ToastView({
  message,
  onClose,
  variant = "default",
}: {
  message: string;
  onClose: () => void;
  variant?: "default" | "error";
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return createPortal(
    <div
      role="alert"
      className={`fixed left-5 top-4 z-[4000] flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1c1c1e] p-3 text-white shadow-[0_16px_40px_rgba(0,0,0,.5)] transition duration-300 ease-out motion-reduce:transition-none ${shown ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        }`}
    >
      <span className={`grid size-8 shrink-0 place-items-center rounded-full ${variant === "error" ? "bg-red-500/15 text-red-500" : "bg-orange-500/20 text-orange-400"}`}>
        <AlertCircleIcon className="size-4" />
      </span>
      <p className="text-[15px] font-medium">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="ml-1 inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-white/10 text-white/80 transition hover:bg-white/[.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17]"
      >
        <CloseIcon />
      </button>
    </div>,
    document.body,
  );
}

export function useToast(duration = 4000, variant: "default" | "error" = "default"): {
  showToast: (message: string) => void;
  hideToast: () => void;
  toast: ReactNode;
} {
  const [current, setCurrent] = useState<{ id: number; message: string } | null>(
    null,
  );
  const timer = useRef<number | undefined>(undefined);

  const hideToast = useCallback(() => {
    window.clearTimeout(timer.current);
    setCurrent(null);
  }, []);

  const showToast = useCallback(
    (message: string) => {
      window.clearTimeout(timer.current);
      setCurrent({ id: Date.now(), message });
      timer.current = window.setTimeout(() => setCurrent(null), duration);
    },
    [duration],
  );

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  const toast = current ? (
    <ToastView variant={variant} key={current.id} message={current.message} onClose={hideToast} />
  ) : null;

  return { showToast, hideToast, toast };
}

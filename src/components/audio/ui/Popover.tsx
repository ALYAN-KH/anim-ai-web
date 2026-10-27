"use client";
import type { ReactNode } from "react";
import { useDismiss } from "../hooks/useDismiss";

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  placement?: "top" | "bottom";
  className?: string;
}

export function Popover({
  open,
  onClose,
  trigger,
  children,
  align = "right",
  placement = "bottom",
  className = "w-60",
}: PopoverProps) {
  const ref = useDismiss<HTMLDivElement>(open, onClose);

  return (
    <div ref={ref} className="relative shrink-0">
      {trigger}
      {open && (
        <div
          role="dialog"
          className={`absolute z-40 rounded-xl border border-white/10 bg-[#1b1c1e] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${
            align === "right" ? "right-0" : "left-0"
          } ${placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2"} ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

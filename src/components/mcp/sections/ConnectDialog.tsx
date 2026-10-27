"use client";
import { useEffect, useRef, useState } from "react";
import type { AgentDefinition } from "../types";
import { copyText } from "../lib/clipboard";
import { CheckIcon, CloseIcon, CopyIcon } from "../ui/Icons";

interface ConnectDialogProps {
  agent: AgentDefinition;
  open: boolean;
  onClose: () => void;
}

export function ConnectDialog({ agent, open, onClose }: ConnectDialogProps) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { guide } = agent;

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleCopy = async () => {
    if (!guide.code) return;
    if (await copyText(guide.code)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={guide.title}
        className="relative w-full max-w-[520px] rounded-3xl border border-white/10 bg-[#17181a] p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-grotesk text-2xl font-bold uppercase leading-7 tracking-tight text-white">
            {guide.title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
        <ol className="flex flex-col gap-3">
          {guide.steps.map((step, index) => (
            <li key={step} className="flex gap-3 text-base font-medium leading-6 text-white/70">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        {guide.code && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-black/50 py-2 pl-4 pr-2">
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-[#d1fe17]">
              {guide.code}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy"
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

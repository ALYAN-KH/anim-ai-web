import type { ButtonHTMLAttributes } from "react";

export type ChangeButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** Shared preset/tool switcher used throughout Video Studio. */
export function ChangeButton({ className = "", children, ...props }: ChangeButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-black/65 px-2.5 text-[13px] font-semibold text-white backdrop-blur-[4.5px] transition hover:border-lime hover:bg-lime hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fill="currentColor"
          d="M13.548 2.143a1.582 1.582 0 0 1 2.238 0l2.572 2.571a1.584 1.584 0 0 1 0 2.24L7.316 17.995a1.58 1.58 0 0 1-1.119.464H2.792a.75.75 0 0 1-.75-.75v-3.405c0-.42.167-.822.464-1.119l8.506-8.507 2.536-2.535ZM3.566 14.245a.083.083 0 0 0-.024.059v2.655h2.655a.084.084 0 0 0 .059-.024l7.975-7.976-2.689-2.689-7.976 7.975Zm11.16-11.042a.083.083 0 0 0-.118 0l-2.005 2.005 2.689 2.69 2.006-2.005a.084.084 0 0 0 0-.118l-2.572-2.572Z"
        />
      </svg>
      {children ?? "Change"}
    </button>
  );
}

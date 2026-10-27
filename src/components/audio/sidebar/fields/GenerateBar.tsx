"use client";

interface GenerateBarProps {
  disabled: boolean;
  loading: boolean;
}

export function GenerateBar({ disabled, loading }: GenerateBarProps) {
  return (
    <div className="sticky bottom-0 z-20 -mx-3 mt-3 shrink-0 bg-gradient-to-b from-[#17181a]/0 to-[#17181a] px-3 pb-4 pt-12">
      <button
        type="submit"
        disabled={disabled || loading}
        aria-busy={loading}
        className="relative flex h-14 w-full min-w-12 items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(180deg,rgba(255,255,20,0)_0%,rgb(255,255,20)_100%),linear-gradient(90deg,rgb(209,254,23),rgb(209,254,23))] px-5 pb-5 pt-4 shadow-[0_32px_24px_rgba(0,0,0,0.15),0_6px_4px_rgba(0,0,0,0.25)] transition hover:brightness-105 active:brightness-95 disabled:pointer-events-none disabled:[filter:brightness(0.6)]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_-3px_0_0_#829B19]"
        />
        <span className="px-1.5 text-lg font-semibold leading-6 tracking-[-0.4px] text-[#1a1d0a]">
          {loading ? "Generating…" : "Generate"}
        </span>
      </button>
    </div>
  );
}

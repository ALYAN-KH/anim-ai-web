type BillingToggleProps = {
  annual: boolean;
  onMonthly: () => void;
  onAnnual: () => void;
  onToggle: () => void;
  accent: string;
};

export function BillingToggle({
  annual,
  onMonthly,
  onAnnual,
  onToggle,
  accent,
}: BillingToggleProps) {
  return (
    <div className="relative flex justify-center">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMonthly}
          className={`whitespace-pre text-right text-sm font-semibold leading-5 ${annual ? "text-white/50" : "text-white"}`}
        >
          Monthly
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          aria-label="Toggle between monthly and annual billing"
          onClick={onToggle}
          className="relative block h-6 w-9 shrink-0 cursor-pointer rounded-full bg-[#3a3c3e] transition"
        >
          <span
            className="pointer-events-none absolute block h-4 w-4 rounded-full bg-white shadow-lg transition-[left] duration-300 ease-in-out"
            style={{ top: 4, left: annual ? 18 : 2 }}
          />
        </button>
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={onAnnual}
            className={`whitespace-pre text-sm font-semibold leading-5 ${annual ? "text-white" : "text-white/50"}`}
          >
            Annual
          </button>
          <div className="absolute bottom-0 left-full top-0 ml-2 flex items-center justify-center">
            <span
              className="inline-flex h-4 -skew-x-[10.89deg] items-center justify-center rounded-[2px] pl-1 pr-1.5 font-grotesk text-xs font-bold uppercase leading-none text-white"
              style={{ background: accent }}
            >
              <span className="whitespace-nowrap">30% OFF</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

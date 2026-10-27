export function ToolToggle({ checked }: { checked: boolean }) {
  return <span aria-hidden="true" className={`relative inline-block h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-lime" : "bg-white/20"}`}><span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${checked ? "left-[18px]" : "left-0.5"}`} /></span>;
}

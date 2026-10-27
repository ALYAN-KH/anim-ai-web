import { HiggsSnake } from "@/components/ui/HiggsSnake";
import {
  type ModelIcon
} from "../data";

export function OpenAILogo({ className = "", size = 22 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="white"
        d="M12 2.25a9.75 9.75 0 0 0-9.75 9.75c0 5.38 4.37 9.75 9.75 9.75s9.75-4.37 9.75-9.75A9.75 9.75 0 0 0 12 2.25z"
      />
      <path
        fill="black"
        d="M12 2.25a9.75 9.75 0 0 0-9.75 9.75c0 5.38 4.37 9.75 9.75 9.75s9.75-4.37 9.75-9.75A9.75 9.75 0 0 0 12 2.25z"
        fill-rule="evenodd"
        clip-rule="evenodd"
        opacity="0"
      />
      <g fill="white">
        <path d="M12 5.25a6.75 6.75 0 1 1 0 13.5 6.75 6.75 0 0 1 0-13.5z" />
        <path d="M12 3.75a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5z" />
      </g>
      <path
        fill="white"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
      />
    </svg>
  );
}

export function SeedreamLogo({ className = "", size = 22 }: { className?: string; size?: number }) {
  return (
    <img
      src="https://static.higgsfield.ai/explore/image-generate-block/seedance-logo.png"
      alt="Seedream"
      className={`${className} h-[${size}px] w-[${size}px] object-contain`}
      loading="lazy"
    />
  );
}

export function AspectIcon({ w, h }: { w: number; h: number }) {
  const s = 14 / Math.max(w, h);
  const rw = w * s - 1.5;
  const rh = h * s - 1.5;
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <rect
        x={8 - rw / 2}
        y={8 - rh / 2}
        width={rw}
        height={rh}
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ModelGlyph({ icon, size = 22 }: { icon: ModelIcon; size?: number }) {
  if (icon === "snake") return <HiggsSnake className={`size-5 text-lime`} />;
  if (icon === "snakeDim") return <HiggsSnake className={`size-5 text-zinc-400`} />;
  if (icon === "gpt") return <OpenAILogo size={size} />;
  if (icon === "google") return <span className="text-lg font-semibold text-zinc-300">G</span>;
  if (icon === "seedream") return <SeedreamLogo size={size} />;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className="text-zinc-400">
      <rect x="3" y="9" width="2.4" height="7" rx="1" fill="currentColor" />
      <rect x="8.8" y="4" width="2.4" height="12" rx="1" fill="currentColor" />
      <rect x="14.6" y="7" width="2.4" height="9" rx="1" fill="currentColor" />
    </svg>
  );
}

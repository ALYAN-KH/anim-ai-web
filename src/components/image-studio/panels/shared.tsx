import {
  ImagePlus,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SafeImage({
  src,
  alt,
  className = "",
  fallbackSrc,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  // reset error state when the image changes (e.g. a different preset is picked)
  useEffect(() => {
    setFailed(false);
    setUseFallback(false);
  }, [src, fallbackSrc]);
  return failed ? (
    <div
      className={`grid place-items-center bg-[#25282b] text-zinc-600 ${className}`}
    >
      <ImagePlus />
    </div>
  ) : (
    <img
      src={useFallback && fallbackSrc ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => {
        if (fallbackSrc && !useFallback) setUseFallback(true);
        else setFailed(true);
      }}
    />
  );
}

export function PanelCloseButton({
  onClick,
  label,
  hidden = false,
}: {
  onClick: () => void;
  label: string;
  hidden?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-[11px] top-3.5 z-20 grid size-8 place-items-center rounded-full bg-white/5"
      style={
        hidden
          ? {
            opacity: 0,
            pointerEvents: "none",
            transition: "opacity 200ms ease",
          }
          : { transition: "opacity 200ms ease" }
      }
      aria-label={label}
    >
      <X size={16} />
    </button>
  );
}

export function RevealCard({
  root,
  index,
  children,
  onClick,
}: {
  root: HTMLElement | null;
  index: number;
  children: React.ReactNode;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !root) return;
    const io = new IntersectionObserver(
      ([entry]) => setShown(entry.isIntersecting),
      { root, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [root]);
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="mb-card group text-center"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(14px) scale(.96)",
        transition:
          "opacity 380ms ease, transform 420ms cubic-bezier(.2,.7,.2,1)",
        transitionDelay: shown ? `${(index % 5) * 55}ms` : "0ms",
      }}
    >
      {children}
    </button>
  );
}

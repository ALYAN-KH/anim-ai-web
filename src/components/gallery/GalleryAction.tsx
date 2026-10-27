import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type GalleryActionProps = {
  href: string;
  label: string;
  variant?: "view-all" | "recreate";
  className?: string;
  ariaLabel?: string;
};

export function GalleryAction({
  href,
  label,
  variant = "view-all",
  className = "",
  ariaLabel,
}: GalleryActionProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`gallery-action gallery-action-${variant} ${className}`.trim()}
    >
      {variant === "recreate" && (
        <svg className="gallery-action-ai-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="m11.1 2.2 1.8 5.1 5.1 1.8-5.1 1.8-1.8 5.1-1.8-5.1-5.1-1.8 5.1-1.8 1.8-5.1Zm8.2 11.4 1 2.8 2.8 1-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1 1-2.8ZM4 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
        </svg>
      )}
      <span>{label}</span>
      {variant === "view-all" && <ArrowUpRight size={20} strokeWidth={1.8} aria-hidden="true" />}
    </Link>
  );
}



import { ICONS } from "./data";

/** Renders reference SVG markup verbatim (static, bundled data) at the wrapper's size. */
export function Icon({ name, markup, className = "size-4" }: { name?: string; markup?: string; className?: string }) {
  const html = markup ?? (name ? ICONS[name] : "");
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center [&>img]:size-full [&>svg]:h-full [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: html ?? "" }}
    />
  );
}

import type { CSSProperties } from "react";

/** Explicit thumb coordinates avoid transforms inherited from vendor styles. */
export function ToggleTrack({ checked, size = "small", onColor = "#22c576" }: { checked: boolean; size?: "small" | "medium" | "scene" | "audio"; onColor?: string }) {
  const width = size === "audio" ? 44 : size === "small" || size === "scene" ? 28 : 36;
  const height = size === "small" || size === "scene" ? 16 : 24;
  const thumb = size === "audio" ? 20 : size === "scene" ? 13 : size === "small" ? 12 : 16;
  const reset: CSSProperties = { display: "block", margin: 0, padding: 0, border: 0, boxSizing: "border-box", transform: "none", translate: "none" };
  return <span aria-hidden="true" style={{ ...reset, position: "relative", flex: `0 0 ${width}px`, width, minWidth: width, height, borderRadius: 999, overflow: "hidden", backgroundColor: checked ? onColor : "#60656f", transition: "background-color 150ms" }}>
    <span style={{ ...reset, position: "absolute", width: thumb, height: thumb, minWidth: thumb, borderRadius: 999, backgroundColor: "#fff", top: (height - thumb) / 2, left: checked ? width - thumb - 2 : 2, transition: "left 150ms ease", boxShadow: "0 1px 2px rgba(20,21,26,.05)" }} />
  </span>;
}

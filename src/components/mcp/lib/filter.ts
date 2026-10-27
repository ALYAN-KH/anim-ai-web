import type { PresetDefinition } from "../types";

export function filterPresets(
  presets: PresetDefinition[],
  categoryId: string,
  query: string,
): PresetDefinition[] {
  const q = query.trim().toLowerCase();
  if (q) {
    return presets.filter((p) =>
      [p.title, p.description, p.command].some((field) => field.toLowerCase().includes(q)),
    );
  }
  if (categoryId === "popular") return presets.filter((p) => p.popular);
  return presets.filter((p) => p.categories.includes(categoryId));
}

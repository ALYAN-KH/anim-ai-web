import { CATEGORY_GLYPHS } from "../config/categoryGlyphs";

export function CategoryGlyph({ label }: { label: string }) {
  const svg = CATEGORY_GLYPHS[label];
  if (!svg) return null;
  return <span className="inline-flex" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}

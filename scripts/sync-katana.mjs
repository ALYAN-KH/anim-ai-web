// Recover exact media and category metadata from the public catalog used by higgsfield.ai/katana.
// Run manually with `node scripts/sync-katana.mjs`; the app serves the saved catalog without an API dependency.
import { readFileSync, writeFileSync } from "node:fs";

const output = "src/components/katana/presets.json";
const existing = JSON.parse(readFileSync(output, "utf8"));
const categories = { personalized_edits: "Personalized edits", style_transfer: "Style transfer", motion_transfer: "Motion transfer" };
const endpoint = "https://fnf-api-gw.higgsfield.ai/fnf-cms-api/katana-presets";
const recovered = [];
const cursors = new Set();
let cursor;
for (let page = 0; page < 25; page += 1) {
  const url = new URL(endpoint);
  url.searchParams.set("lang", "en");
  url.searchParams.set("limit", "20");
  if (cursor) url.searchParams.set("cursor", cursor);
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data.items)) throw new Error("Catalog response has no items");
  for (const item of data.items) {
    const image = item.thumbnail_media?.url;
    const video = item.video_media?.url;
    const width = item.video_media?.width ?? item.thumbnail_media?.width;
    const height = item.video_media?.height ?? item.thumbnail_media?.height;
    if (!item.slug || !item.title || !image || !width || !height) continue;
    // Save only public preset content; author/account metadata is unnecessary for this clone.
    const previous = existing.find(preset => preset.image === image || preset.video === video || preset.id === item.slug);
    recovered.push({
      id: previous?.id ?? item.slug, title: item.title, width, height, image,
      ...(video && { video }), ...(previous?.likes !== undefined && { likes: previous.likes }),
      ...(categories[item.category] && { category: categories[item.category] }),
    });
  }
  cursor = data.next_cursor;
  if (!cursor) break;
  if (cursors.has(cursor)) throw new Error("Catalog repeated a pagination cursor");
  cursors.add(cursor);
  if (page === 24) throw new Error("Catalog exceeded the bounded capture; leaving the existing file intact");
}
if (!recovered.length) throw new Error("No valid presets recovered; leaving the existing file intact");
const merged = [...new Map(recovered.map(item => [item.image, item])).values()];
for (const previous of existing) {
  if (!merged.some(item => item.id === previous.id || item.image === previous.image)) merged.push(previous);
}
if (new Set(merged.map(item => item.id)).size !== merged.length) throw new Error("Duplicate preset IDs; leaving the existing file intact");
writeFileSync(output, JSON.stringify(merged, null, 2) + "\n");
console.log(`Saved ${merged.length} presets; ${merged.filter(item => item.video).length} videos; ${merged.filter(item => item.category).length} verified categories.`);

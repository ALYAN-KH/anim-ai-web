// Builds src/components/katana/presets.json from saved copies of the Katana page markup.
// Usage: node scripts/extract-katana.mjs [capture.html ...]   (default: _ref/katana.html)
//
// The live gallery is virtualized, so any single DOM capture only holds the cards that were mounted at the
// time. Captured cards are merged into the existing presets.json (matched by media URL) instead of replacing
// it, so several partial captures can be combined. Media URLs are copied verbatim — several are extensionless.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const OUTPUT = process.env.KATANA_PRESETS_OUT ?? "src/components/katana/presets.json";
const sources = process.argv.slice(2);
if (sources.length === 0) sources.push("_ref/katana.html");

const decode = value => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const tag = (block, name) => block.match(new RegExp(`<${name}\\b[^>]*>`))?.[0];
// `\s` before the name keeps e.g. `src` from matching `data-loaded-src`.
const attr = (element, name) => {
  const value = element?.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
  return value ? decode(value) : undefined;
};
const likesOf = block => {
  const raw = block.match(/aria-label="Like"[\s\S]*?<\/svg>\s*([\d.,]+[KkMm]?)\s*<\/button>/)?.[1];
  if (!raw) return undefined;
  const scale = /k$/i.test(raw) ? 1e3 : /m$/i.test(raw) ? 1e6 : 1;
  return Math.round(Number(raw.replace(/[KkMm,]/g, "")) * scale);
};

const skipped = [];
const captured = sources.flatMap(source => {
  const html = readFileSync(source, "utf8");
  const selectedCategory = [...html.matchAll(/<button\b[^>]*aria-pressed="true"[^>]*>([\s\S]*?)<\/button>/g)]
    .map(match => decode(match[1].replace(/<[^>]+>/g, "")).trim())
    .find(value => ["Personalized edits", "Style transfer", "Motion transfer"].includes(value));
  return html.split(/<div data-explore-item=""/).slice(1).map(chunk => {
    const style = chunk.match(/^\s*style="([^"]*)"/)?.[1] ?? "";
    const px = name => Number(style.match(new RegExp(`(?:^|;)\\s*${name}:\\s*([\\d.]+)px`))?.[1] ?? NaN);
    // A capture can end mid-card; keep whatever the card exposes before the cut.
    const block = chunk.split(/<\/article>/)[0];
    const title = decode(block.match(/aria-label="View ([^"]*)"/)?.[1] ?? "").trim();
    const [, width, height] = block.match(/aspect-ratio:\s*(\d+)\s*\/\s*(\d+)/) ?? [];
    const img = tag(block, "img");
    const videoTag = tag(block, "video");
    const videoBlock = videoTag ? block.slice(block.indexOf(videoTag)).split(/<\/video>/)[0] : "";
    const video = attr(videoTag, "src") ?? attr(tag(videoBlock, "source"), "src");
    const poster = attr(videoTag, "poster");
    const image = attr(img, "src") ?? attr(img, "data-loaded-src") ?? poster;
    const item = { title, width: Number(width), height: Number(height), image, video, poster, likes: likesOf(block), category: selectedCategory, top: px("top"), left: px("left") };
    if (!title || !image || !item.width || !item.height) skipped.push(`${source}: ${title || "(untitled card)"} — missing ${[!title && "title", !image && "image", !(item.width && item.height) && "aspect ratio"].filter(Boolean).join(", ")}`);
    return item;
  }).filter(item => item.title && item.image && item.width && item.height)
    // Reading order of the capture; absolute offsets themselves are not kept (the grid lays itself out).
    .sort((a, b) => a.top - b.top || a.left - b.left);
});

const existing = existsSync(OUTPUT) ? JSON.parse(readFileSync(OUTPUT, "utf8")) : [];
const keyOf = preset => preset.poster ?? preset.image;
const byKey = new Map(existing.map(preset => [keyOf(preset), { ...preset }]));
let added = 0;
for (const { title, width, height, image, video, poster, likes, category } of captured) {
  const key = poster ?? image;
  const match = byKey.get(key) ?? [...byKey.values()].find(preset => preset.image === image || (video && preset.video === video));
  const next = { title, width, height, image, ...(video && { video }), ...(poster && poster !== image && { poster }), ...(likes !== undefined && { likes }), ...(category && { category }) };
  if (match) Object.assign(match, next, { video: video ?? match.video, likes: likes ?? match.likes });
  else {
    byKey.set(key, next);
    added += 1;
  }
}

const slug = text => text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const seen = new Map();
const presets = [...byKey.values()].map(({ id: _id, column: _column, ...preset }) => {
  const base = slug(preset.title) || "preset";
  const count = (seen.get(base) ?? 0) + 1;
  seen.set(base, count);
  const ordered = { id: count > 1 ? `${base}-${count}` : base, title: preset.title, width: preset.width, height: preset.height, image: preset.image, video: preset.video, poster: preset.poster, likes: preset.likes, category: preset.category };
  return Object.fromEntries(Object.entries(ordered).filter(([, value]) => value !== undefined));
});

writeFileSync(OUTPUT, JSON.stringify(presets, null, 2) + "\n");
console.log(`Captured ${captured.length} cards (${captured.filter(item => item.video).length} with video) from ${sources.join(", ")}.`);
console.log(`Wrote ${presets.length} presets (${added} new, ${presets.filter(preset => preset.video).length} with video, ${presets.filter(preset => preset.category).length} with a category).`);
if (skipped.length) console.warn(`Skipped ${skipped.length} incomplete card(s):\n  ${skipped.join("\n  ")}`);

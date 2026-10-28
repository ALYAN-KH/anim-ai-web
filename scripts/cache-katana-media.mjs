// Keep the exact supplied demo assets local so CDN/network interruptions cannot freeze the hero.
import { mkdirSync, writeFileSync, renameSync } from "node:fs";
const directory = "public/media/katana";
mkdirSync(directory, { recursive: true });
const sources = {
  "banner.mp4": "https://static.higgsfield.ai/katana/katana-banner-v2-mini.mp4",
  "banner.webp": "https://static.higgsfield.ai/katana/katana-banner-v2-thumbnail.webp",
  "hero.mp4": "https://static.higgsfield.ai/katana-custom-test-v02-20261009/test_v02.mp4",
  "hero.webp": "https://static.higgsfield.ai/katana-custom-test-v02-20261009/test_v02-poster.webp",
  "connect.mp4": "https://static.higgsfield.ai/mcp/connect-tutorials-final-20260925/Claude.mp4",
  "connect.png": "https://static.higgsfield.ai/katana/assets-20261009/desktop/how-it-works/connect.png",
};
await Promise.all(Object.entries(sources).map(async ([name, url]) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const type = response.headers.get("content-type") ?? "";
  if (!type.startsWith(name.endsWith(".mp4") ? "video/" : "image/")) throw new Error(`${name}: unexpected ${type}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const temp = `${directory}/${name}.tmp`;
  writeFileSync(temp, bytes);
  renameSync(temp, `${directory}/${name}`);
  console.log(`${name}: ${bytes.length} bytes`);
}));
writeFileSync(`${directory}/sources.json`, JSON.stringify(sources, null, 2) + "\n");

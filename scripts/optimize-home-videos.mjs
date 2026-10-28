// Transcode every remote video the homepage renders into a small local preview.
// The originals are full-quality uploads (some 300MB+); tiles only need a short,
// muted, ~960px loop. Usage: start the app, then `npm run optimize:videos [baseUrl]`.
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, statSync, writeFileSync, renameSync, rmSync } from "node:fs";
import { promisify } from "node:util";
import ffmpeg from "ffmpeg-static";

const run = promisify(execFile);
const base = process.argv[2] || "http://localhost:3000";
const outDir = "public/media/home";
const manifestPath = "src/data/homeVideoPreviews.json";
// Bump when encoder settings change so browsers never reuse a stale cached file.
const VERSION = "v1";
const MAX_SIDE = 960;
const MAX_SECONDS = 15;
const CONCURRENCY = 4;

mkdirSync(outDir, { recursive: true });

async function text(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(180000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.text();
}

// URLs are partly built at runtime (Genjutsu, Seedance), so read them from the
// rendered page and its client chunks instead of grepping the source.
const html = await text(base + "/");
const chunks = [...new Set(html.match(/\/_next\/static\/[^"]+\.js/g) ?? [])];
const bodies = [html, ...(await Promise.all(chunks.map((c) => text(base + c))))];
const urls = [
  ...new Set(bodies.flatMap((b) => b.match(/https?:\/\/[^"\\\s']+\.(?:mp4|webm)/g) ?? [])),
].sort();
console.log(`${urls.length} videos found on ${base}/`);

const manifest = {};
const failures = [];
const vf = `scale='min(${MAX_SIDE},iw)':'min(${MAX_SIDE},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps='min(30,source_fps)'`;

async function optimize(url) {
  const id = createHash("sha1").update(`${VERSION}:${url}`).digest("hex").slice(0, 16);
  const video = `${outDir}/${id}.mp4`;
  const poster = `${outDir}/${id}.webp`;
  if (!existsSync(video)) {
    const temp = `${video}.tmp.mp4`;
    const source = `${video}.src.mp4`;
    // Long sources (full films) open on black titles; preview from 10% in instead.
    const probe = await run(ffmpeg, ["-rw_timeout", "30000000", "-i", url], { timeout: 60000 }).catch((e) => e);
    const [, h = 0, m = 0, s = 0] = /Duration: (\d+):(\d+):([\d.]+)/.exec(probe.stderr ?? "") ?? [];
    const duration = h * 3600 + m * 60 + Number(s);
    const seek = duration > 60 ? ["-ss", String(Math.floor(duration * 0.1))] : [];
    const encode = (input) =>
      run(ffmpeg, [
        "-y", "-loglevel", "error", "-rw_timeout", "30000000", ...seek, "-t", String(MAX_SECONDS), "-i", input,
        "-vf", vf, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "28",
        "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", temp,
      ], { maxBuffer: 1 << 24, timeout: 300000 });
    try {
      try {
        // ffmpeg reads the URL with range requests, so only the first seconds download.
        await encode(url);
      } catch {
        // Some CDNs stall on ranged reads; fall back to a full download.
        const response = await fetch(url, { signal: AbortSignal.timeout(600000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        writeFileSync(source, Buffer.from(await response.arrayBuffer()));
        await encode(source);
      }
      renameSync(temp, video);
    } finally {
      rmSync(temp, { force: true });
      rmSync(source, { force: true });
    }
  }
  if (!existsSync(poster)) {
    await run(ffmpeg, [
      "-y", "-loglevel", "error", "-i", video, "-frames:v", "1",
      "-c:v", "libwebp", "-quality", "75", poster,
    ]);
  }
  manifest[url] = { video: "/" + video.replace(/^public\//, ""), poster: "/" + poster.replace(/^public\//, "") };
  console.log(`${(statSync(video).size / 1048576).toFixed(2)}MB  ${url}`);
}

const queue = [...urls];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let url = queue.shift(); url; url = queue.shift()) {
      try {
        await optimize(url);
      } catch (error) {
        failures.push(url);
        console.warn(`FAILED ${url}: ${String(error.message).split("\n")[0]}`);
      }
    }
  }),
);

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + "\n");
console.log(`Wrote ${Object.keys(sorted).length} previews to ${manifestPath}; ${failures.length} failed (kept remote).`);

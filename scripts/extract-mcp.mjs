#!/usr/bin/env node
/**
 * Higgsfield MCP page extractor (Playwright).
 *
 *   npm i -D playwright && npx playwright install chromium
 *   node scripts/extract-mcp.mjs                # extract all agent tabs -> data/extracted/*.json
 *   node scripts/extract-mcp.mjs --download     # also save media + inline SVG icons to public/mcp/
 *   node scripts/extract-mcp.mjs --headed       # watch it run
 *   node scripts/extract-mcp.mjs --tabs=chatgpt,claude
 *
 * Output (data/extracted/):
 *   <tab>.json     hero, CTAs, dialogs, code blocks, demos, preset categories + cards
 *   icons.json     inline <svg> markup of the agent tab icons
 *   network.json   every media/font URL requested by the page
 *   <tab>.png      full-page screenshot for visual comparison
 *
 * The page is client-rendered, so a plain fetch/curl only sees the ChatGPT tab.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE = "https://higgsfield.ai/mcp";
const ALL_TABS = ["chatgpt", "claude", "claude-code", "telegram", "cli", "other"];
const CATEGORIES = [
  "Popular", "Paid Ads", "Motion Design", "Marketing", "Production",
  "UGC", "Faceless", "For After Effects", "For Blender",
];

const args = new Map(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")));
const HEADED = args.has("headed");
const DOWNLOAD = args.has("download");
const TABS = args.has("tabs") ? String(args.get("tabs")).split(",") : ALL_TABS;
const OUT = path.resolve("data/extracted");
const PUBLIC = path.resolve("public/mcp");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const abs = (u) => (u ? new URL(u, BASE).href : null);

async function settle(page, ms = 900) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await sleep(ms);
}

/** Close any open dialog so the next interaction isn't blocked. */
async function closeDialogs(page) {
  for (let i = 0; i < 3; i++) {
    if (!(await page.locator('[role="dialog"]').count())) return;
    await page.keyboard.press("Escape");
    await sleep(300);
  }
}

async function readDialog(page) {
  const dialog = page.locator('[role="dialog"]').last();
  if (!(await dialog.count())) return null;
  return dialog.evaluate((el) => ({
    text: el.innerText.trim(),
    html: el.innerHTML,
    code: [...el.querySelectorAll("pre, code")].map((n) => n.innerText.trim()).filter(Boolean),
    links: [...el.querySelectorAll("a[href]")].map((a) => ({ text: a.innerText.trim(), href: a.href })),
    images: [...el.querySelectorAll("img")].map((i) => i.currentSrc || i.src),
    videos: [...el.querySelectorAll("video")].map((v) => v.currentSrc || v.src || v.poster),
  }));
}

/** Click each CTA / "How to connect?" button and record the dialog it opens. */
async function captureDialogs(page) {
  const dialogs = [];
  const triggers = page.locator('button[aria-haspopup="dialog"]');
  const count = await triggers.count();
  for (let i = 0; i < count; i++) {
    const btn = triggers.nth(i);
    if (!(await btn.isVisible().catch(() => false))) continue;
    const label = (await btn.innerText().catch(() => "")).trim();
    await btn.click({ timeout: 3000 }).catch(() => {});
    await sleep(600);
    const content = await readDialog(page);
    if (content) dialogs.push({ trigger: label, ...content });
    await closeDialogs(page);
  }
  // "How to connect?" is not always aria-haspopup
  const how = page.getByRole("button", { name: /how to connect/i }).first();
  if (await how.count()) {
    await how.click().catch(() => {});
    await sleep(600);
    const content = await readDialog(page);
    if (content && !dialogs.some((d) => d.text === content.text)) {
      dialogs.push({ trigger: "How to connect?", ...content });
    }
    await closeDialogs(page);
  }
  return dialogs;
}

async function captureHero(page) {
  return page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return {
      headline: h1?.innerText.trim() ?? null,
      headlineHtml: h1?.innerHTML ?? null,
      buttons: [...document.querySelectorAll("main button, main a, section button, section a")]
        .slice(0, 60)
        .map((el) => ({
          text: el.innerText.trim(),
          href: el.href ?? null,
          icon: el.querySelector("img")?.src ?? (el.querySelector("svg") ? "inline-svg" : null),
        }))
        .filter((b) => b.text),
      codeBlocks: [...document.querySelectorAll("pre, code, [class*=code]")]
        .map((n) => n.innerText.trim())
        .filter((t) => t.length > 3),
      mcpUrl: (document.body.innerText.match(/https:\/\/mcp\.higgsfield\.ai\/[^\s]+/) || [null])[0],
      mobileHeroImage: [...document.querySelectorAll("img")].map((i) => i.src).find((s) => /hero-phone/.test(s)) ?? null,
    };
  });
}

/** Demo pills (Genjutsu / Generate video / ...) live in a role=tablist that is NOT the agent tablist. */
async function captureDemos(page) {
  const demoTabs = page
    .locator('[role="tablist"]')
    .filter({ hasNot: page.locator('[data-agent]') })
    .first()
    .locator('[role="tab"]');
  const n = await demoTabs.count();
  const demos = [];
  for (let i = 0; i < n; i++) {
    const tab = demoTabs.nth(i);
    const label = (await tab.innerText()).replace(/\bNew\b/, "").trim();
    const isNew = /\bNew\b/.test(await tab.innerText());
    const thumb = await tab.locator("img").first().getAttribute("src").catch(() => null);
    await tab.click().catch(() => {});
    await sleep(900);
    const body = await page.evaluate(() => {
      const card = document.querySelector("h3")?.closest("div[class*=rounded]") ?? document.body;
      const video = card.querySelector("video");
      return {
        title: card.querySelector("h3")?.innerText.trim() ?? null,
        prompt: card.querySelector("h3")?.parentElement?.querySelector("p")?.innerText.trim() ?? null,
        videoSrc: video?.currentSrc || video?.src || video?.querySelector("source")?.src || null,
        poster: video?.poster || card.querySelector("img")?.src || null,
        buttons: [...card.querySelectorAll("a,button")].map((b) => ({ text: b.innerText.trim(), href: b.href ?? null })).filter((b) => b.text),
      };
    });
    demos.push({ label, isNew, thumb: abs(thumb), ...body });
  }
  return demos;
}

async function captureCards(page) {
  return page.evaluate(() => {
    const items = [...document.querySelectorAll("li")].filter((li) =>
      /Try in ChatGPT|Try in Claude|Learn more/i.test(li.innerText),
    );
    return items.map((li) => {
      const media = li.querySelector("video");
      const imgs = [...li.querySelectorAll("img")].map((i) => i.currentSrc || i.src);
      const links = [...li.querySelectorAll("a[href]")].map((a) => ({ text: a.innerText.trim(), href: a.href }));
      const tryLink = links.find((l) => /Try in/i.test(l.text));
      const learn = links.find((l) => /Learn more/i.test(l.text));
      let prompt = null;
      try {
        prompt = tryLink ? new URL(tryLink.href).searchParams.get("q") : null;
      } catch {}
      return {
        title: li.querySelector("h3, h2, h4")?.innerText.replace(/\bNew\b/, "").trim() ?? null,
        isNew: /\bNew\b/.test(li.querySelector("h3, h2, h4")?.innerText ?? ""),
        description: li.querySelector("p")?.innerText.trim() ?? null,
        tags: [...li.querySelectorAll("ul li, [class*=chip], [class*=tag]")].map((t) => t.innerText.trim()).filter(Boolean),
        video: media ? { src: media.currentSrc || media.src, poster: media.poster } : null,
        images: imgs,
        tryHref: tryLink?.href ?? null,
        promptDecoded: prompt,
        learnMoreHref: learn?.href ?? null,
      };
    });
  });
}

async function captureCategories(page) {
  const result = {};
  for (const name of CATEGORIES) {
    const btn = page.getByRole("button", { name, exact: true }).first();
    if (!(await btn.count())) continue;
    await btn.click().catch(() => {});
    await sleep(900);
    // scroll so lazy media loads
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
    });
    result[name] = {
      icon: await btn.locator("svg, img").first().evaluate((el) => (el.tagName === "svg" ? el.outerHTML : el.src)).catch(() => null),
      cards: await captureCards(page),
    };
  }
  return result;
}

async function captureSearch(page) {
  const input = page.getByPlaceholder(/search presets/i).first();
  if (!(await input.count())) return null;
  await input.fill("video");
  await sleep(700);
  const cards = await captureCards(page);
  await input.fill("");
  return { query: "video", resultCount: cards.length, titles: cards.map((c) => c.title) };
}

async function captureAgentIcons(page) {
  return page.evaluate(() =>
    Object.fromEntries(
      [...document.querySelectorAll('[role="tab"][data-agent]')].map((tab) => [
        tab.dataset.agent,
        {
          label: tab.innerText.trim(),
          svg: tab.querySelector("svg")?.outerHTML ?? null,
          img: tab.querySelector("img")?.src ?? null,
        },
      ]),
    ),
  );
}

async function download(urls) {
  await mkdir(PUBLIC, { recursive: true });
  const saved = [];
  for (const url of [...new Set(urls)].filter(Boolean)) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const u = new URL(url);
      const file = path.join(PUBLIC, u.hostname, u.pathname.replace(/^\//, ""));
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, Buffer.from(await res.arrayBuffer()));
      saved.push({ url, file: path.relative(process.cwd(), file) });
    } catch (err) {
      console.warn("  ! download failed", url, err.message);
    }
  }
  return saved;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: !HEADED, channel: process.env.PW_CHANNEL || undefined });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const network = new Set();
  const page = await context.newPage();
  page.on("response", (res) => {
    if (/\.(mp4|webm|webp|png|jpe?g|svg|gif|woff2?)(\?|$)/i.test(res.url())) network.add(res.url());
  });

  let icons = {};
  for (const tab of TABS) {
    console.log(`→ ${tab}`);
    await page.goto(`${BASE}?tab=${tab}`, { waitUntil: "domcontentloaded" });
    await settle(page);

    if (!Object.keys(icons).length) icons = await captureAgentIcons(page);

    const data = {
      tab,
      url: `${BASE}?tab=${tab}`,
      extractedAt: new Date().toISOString(),
      title: await page.title(),
      hero: await captureHero(page),
      dialogs: await captureDialogs(page),
      demos: await captureDemos(page).catch(() => []),
      categories: await captureCategories(page).catch(() => ({})),
      search: await captureSearch(page).catch(() => null),
    };
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(OUT, `${tab}.png`), fullPage: true }).catch(() => {});
    await writeFile(path.join(OUT, `${tab}.json`), JSON.stringify(data, null, 2));
    const cardCount = Object.values(data.categories).reduce((n, c) => n + c.cards.length, 0);
    console.log(`  hero ✓  dialogs ${data.dialogs.length}  demos ${data.demos.length}  cards ${cardCount}`);
  }

  await writeFile(path.join(OUT, "icons.json"), JSON.stringify(icons, null, 2));
  await writeFile(path.join(OUT, "network.json"), JSON.stringify([...network].sort(), null, 2));

  if (DOWNLOAD) {
    console.log("↓ downloading media…");
    const saved = await download([...network]);
    await writeFile(path.join(OUT, "downloaded.json"), JSON.stringify(saved, null, 2));
    console.log(`  saved ${saved.length} files to public/mcp/`);
  }

  await browser.close();
  console.log(`\nDone. See ${path.relative(process.cwd(), OUT)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

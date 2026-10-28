// Browser acceptance checks. Requires local Chrome and a running development server.
// Usage: node scripts/verify-katana.mjs [http://localhost:3000]
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const presets = JSON.parse(readFileSync("src/components/katana/presets.json", "utf8"));
const output = "artifacts/katana";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1536, height: 864 } });
const page = await context.newPage();
page.setDefaultNavigationTimeout(90000);
const errors = [];
page.on("pageerror", error => errors.push(error.message));
const results = [];
const pass = text => { results.push(text); console.log(`PASS ${text}`); };
const wait = async (fn, message) => {
  await page.waitForFunction(fn, null, { timeout: 30000 });
  pass(message);
};
const picker = () => page.getByRole("dialog", { name: /Choose (reference video|your characters)/ });
const closePicker = async () => { await picker().getByRole("button", { name: "Close", exact: true }).click(); };
try {
  await page.goto(`${base}/katana`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Add your characters", exact: true }).waitFor();
  await wait(() => [...document.querySelectorAll("video")].slice(0, 2).every(node => !node.paused && node.readyState >= 2 && node.currentTime > 0.2), "Banner and hero decode frames and advance playback");
  assert.equal(await page.getByRole("link", { name: "Install Higgsfield in Claude" }).getAttribute("href"), "https://claude.ai/new");
  pass("Install button targets Claude");
  await page.screenshot({ path: `${output}/desktop.png` });
  await page.getByRole("tab", { name: "How it works", exact: true }).click();
  await page.getByRole("heading", { name: "Connect Higgsfield to Claude", exact: true }).waitFor();
  await page.waitForFunction(() => { const v = document.querySelector('video[aria-label="How to connect Higgsfield to Claude"]'); return v && !v.paused && v.currentTime > 0.2 && v.readyState >= 2; });
  await page.screenshot({ path: `${output}/how-it-works.png` });
  pass("How it works matches the connection screen and plays the exact tutorial");
  await page.getByRole("button", { name: "Continue, I have Higgsfield MCP", exact: true }).click();

  const instructions = page.getByRole("switch", { name: "Enable instructions" });
  const textarea = page.getByRole("textbox", { name: "Instructions (optional)" });
  assert.equal(await instructions.getAttribute("aria-checked"), "false");
  await instructions.click();
  await textarea.fill("Keep the character and use a warm color grade.");
  assert.equal(await instructions.getAttribute("aria-checked"), "true");
  await instructions.click();
  assert.equal(await textarea.isVisible(), false);
  await instructions.focus();
  await page.keyboard.press("Space");
  assert.equal(await textarea.inputValue(), "Keep the character and use a warm color grade.");
  pass("Instructions toggle works with click and keyboard and preserves text");
  await page.screenshot({ path: `${output}/instructions.png` });

  await page.getByRole("button", { name: "Add your characters", exact: true }).click();
  await picker().getByRole("tab", { name: "AI Influencer", exact: true }).click();
  await picker().getByRole("link", { name: /Build your next hype machine/ }).waitFor();
  pass("Character picker reuses the existing AI Influencer panel");
  await picker().getByRole("tab", { name: "Generations", exact: true }).click();
  await picker().getByText("Your image generations will appear here").waitFor();
  pass("Character picker reuses image Generations panel");
  await picker().getByRole("tab", { name: "Uploads", exact: true }).click();
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64");
  await picker().locator('input[type="file"]').setInputFiles([{ name: "character-one.png", mimeType: "image/png", buffer: png }, { name: "character-two.png", mimeType: "image/png", buffer: png }]);
  await page.getByRole("button", { name: "Remove character-one.png", exact: true }).waitFor();
  await page.getByRole("button", { name: "Remove character-two.png", exact: true }).waitFor();
  await page.getByRole("button", { name: "Remove character-one.png", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "Remove character-one.png", exact: true }).count(), 0);
  pass("Multiple character uploads and individual removal work");

  await page.getByRole("button", { name: "Add a reference video", exact: true }).click();
  await picker().getByRole("tab", { name: "Generations", exact: true }).click();
  await picker().getByText("Your video generations will appear here").waitFor();
  pass("Reference field opens the existing video Generations panel");
  await picker().getByRole("tab", { name: "Presets", exact: true }).click();
  const presetCard = picker().getByRole("button", { name: "Select " + presets[0].title, exact: true });
  const presetBox = await presetCard.boundingBox();
  assert.ok(presetBox.height > 80 && Math.abs(presetBox.height - presetBox.width) < 2);
  await page.screenshot({ path: `${output}/presets-picker.png` });
  pass("Shared preset cards remain square and scroll without collapsing");
  await presetCard.click();
  const selected = page.locator('aside video:not([aria-label="Higgsfield Katana banner"])');
  await selected.waitFor();
  assert.equal(await selected.getAttribute("src"), presets[0].video);
  assert.equal(await page.getByRole("button", { name: "Remove character-two.png", exact: true }).count(), 1);
  assert.equal(await textarea.inputValue(), "Keep the character and use a warm color grade.");
  pass("Preset selection populates the exact reference and preserves characters/instructions");
  await page.getByRole("button", { name: "Expand selected video", exact: true }).hover();
  await page.screenshot({ path: `${output}/selected-reference.png` });
  await page.getByRole("button", { name: "Expand selected video", exact: true }).click();
  const selectedPreview = page.getByRole("dialog", { name: "Preview " + presets[0].title, exact: true });
  await selectedPreview.waitFor();
  await selectedPreview.getByRole("button", { name: "Close preview", exact: true }).click();
  pass("Selected reference reuses Extend Video hover controls and expandable preview");

  await page.evaluate(() => { window.__katanaOpenedUrl = ""; window.open = url => { window.__katanaOpenedUrl = String(url); return null; }; });
  await page.getByRole("button", { name: "Send & Generate in Claude", exact: true }).click();
  const url = new URL(await page.evaluate(() => window.__katanaOpenedUrl));
  assert.equal(url.hostname, "claude.ai");
  assert.ok(url.searchParams.get("q").includes(presets[0].video));
  assert.ok(url.searchParams.get("q").includes("Keep the character"));
  assert.ok(url.searchParams.get("q").includes("character-two.png"));
  assert.ok(!url.searchParams.get("q").includes("blob:"));
  pass("Send button opens Claude with the selected reference and instructions");

  const asideBefore = await page.locator("aside").boundingBox();
  await page.locator('#katana-panel-explore').evaluate(element => element.scrollTop = 650);
  await page.waitForTimeout(300);
  const asideAfter = await page.locator("aside").boundingBox();
  assert.equal(asideBefore.y, asideAfter.y);
  assert.equal(await page.evaluate(() => window.scrollY), 0);
  await wait(() => [...document.querySelectorAll('#katana-presets video')].some(node => !node.paused && node.currentTime > 0.2 && node.readyState >= 2), "Gallery videos decode and play while in view");
  pass("Right workspace scrolls without moving the left panel or document");
  await page.screenshot({ path: `${output}/gallery.png` });

  const firstCard = page.locator('#katana-presets article').first();
  await firstCard.scrollIntoViewIfNeeded();
  await firstCard.hover();
  await firstCard.getByRole("button", { name: "Like", exact: true }).click();
  await page.getByRole("button", { name: "Replace reference", exact: true }).click();
  await picker().getByRole("tab", { name: "Liked", exact: true }).click();
  await picker().getByRole("button", { name: "Select " + presets[0].title, exact: true }).waitFor();
  await closePicker();
  pass("Gallery likes are connected to the reference picker");
  await firstCard.getByRole("button", { name: "Expand example", exact: true }).click();
  const preview = page.getByRole("dialog", { name: presets[0].title, exact: true });
  await preview.locator("video").waitFor();
  await preview.getByRole("button", { name: "Recreate", exact: true }).click();
  assert.equal(await selected.getAttribute("src"), presets[0].video);
  pass("Preview dialog Recreate updates the form");

  await page.getByRole("button", { name: "Remove selected video", exact: true }).click();
  const video = readFileSync("public/media/katana/banner.mp4");
  await page.getByRole("button", { name: "Add a reference video", exact: true }).click();
  await picker().locator('input[type="file"]').setInputFiles({ name: "reference.mp4", mimeType: "video/mp4", buffer: video });
  await page.getByRole("button", { name: "Remove selected video", exact: true }).waitFor();
  await page.getByRole("button", { name: "Remove selected video", exact: true }).click();
  pass("Local video upload and removal work");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Add a reference video", exact: true }).click();
  await picker().getByRole("button", { name: "Select reference.mp4", exact: true }).click();
  await page.getByRole("button", { name: "Remove selected video", exact: true }).waitFor();
  pass("Uploaded media survives reload and can be selected again");
  await page.getByRole("button", { name: "Replace reference", exact: true }).click();
  await picker().getByRole("tab", { name: "Presets", exact: true }).click();
  await picker().getByRole("button", { name: "Select " + presets[1].title, exact: true }).click();
  assert.equal(await selected.getAttribute("src"), presets[1].video);
  pass("Switching between uploaded references and presets works");

  for (const category of ["Personalized edits", "Style transfer", "Motion transfer"]) {
    await page.getByRole("button", { name: category, exact: true }).click();
    assert.equal(await page.locator('#katana-presets article').count(), presets.filter(item => item.category === category).length);
  }
  pass("Category filters use verified catalog memberships");
  const motionCard = page.locator('#katana-presets article').first();
  await motionCard.scrollIntoViewIfNeeded();
  await motionCard.hover();
  await motionCard.getByRole("button", { name: "More options", exact: true }).click();
  assert.deepEqual(await motionCard.getByRole("menuitem").allTextContents(), ["Report", "Share"]);
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => { window.__katanaSharedUrl = text; } }, configurable: true });
  });
  await motionCard.getByRole("menuitem", { name: "Share", exact: true }).click();
  const sharedUrl = new URL(await page.evaluate(() => window.__katanaSharedUrl));
  assert.equal(sharedUrl.pathname, "/katana");
  assert.ok(sharedUrl.searchParams.get("preset"));
  pass("Motion transfer menu shows Report and Share and creates a preset deep link");
  await page.screenshot({ path: `${output}/motion-transfer.png` });
  await page.setViewportSize({ width: 1280, height: 600 });
  const generate = await page.getByRole("button", { name: "Send & Generate in Claude", exact: true }).boundingBox();
  assert.ok(generate.y + generate.height <= 600);
  await page.screenshot({ path: `${output}/short-desktop.png` });
  pass("Generate remains reachable on a short desktop viewport");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Remove selected video", exact: true }).click();
  await page.getByRole("button", { name: "Add your characters", exact: true }).click();
  const mobilePicker = await picker().boundingBox();
  assert.ok(mobilePicker.x >= 0 && mobilePicker.x + mobilePicker.width <= 390);
  await page.screenshot({ path: `${output}/mobile-picker.png` });
  await closePicker();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.screenshot({ path: `${output}/mobile.png` });
  pass("Mobile form and shared picker fit without horizontal overflow");
  assert.deepEqual(errors, []);
  pass("No browser runtime errors");
  writeFileSync(`${output}/verification.json`, JSON.stringify({ passed: results, errors }, null, 2));
} catch (error) {
  await page.screenshot({ path: `${output}/failure.png` }).catch(() => {});
  throw error;
} finally {
  await browser.close();
}

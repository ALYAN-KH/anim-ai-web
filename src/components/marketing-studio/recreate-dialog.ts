import { RECREATE_EDITOR_HTML, RECREATE_RELATED_HEAD } from "./recreate-editor-html";
import { AVATAR_PATHS, UGC_EDITOR_HTML, UGC_RING } from "./ugc-editor-html";

export type TemplateItem = [string, string, string, string | 0, number, number, number];

const CDN = "https://cdn.higgsfield.ai/cdn-cgi/image/";
const sized = (p: string, w: number) => (p.startsWith("~") ? `${CDN}width=${w},quality=80,format=auto/${p.slice(1)}` : p);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const LINK_CLS = "group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-q-border-focus";
const HOVER_CLS = "pointer-events-none absolute inset-0 flex flex-col items-start justify-end gap-0.5 bg-q-transparent-dark-40 p-2.5 text-left opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[ms2-card-open]:opacity-100 motion-reduce:transition-none";
const MEDIA_CLS = "absolute inset-0 size-full max-w-none object-cover object-center";
const ROW_H = 330;
const GAP = 4;
const PAGE = 40;

export interface RecreateHandle { setProduct(url: string | null): void; setAvatar(avatar: { url: string; name: string } | null): void; close(): void }

const AVATAR_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-4">${AVATAR_PATHS}</svg>`;
/** Templates shot with a person can swap the avatar; their posters live in the "product-shots-people" folder. */
const hasAvatar = (it: TemplateItem) => it[2].includes("product-shots-people");
/** UGC videos use the longer editor with hook and setting pickers (category index 2 = "UGC video", 3 = "TikTok"). */
const isUgc = (it: TemplateItem) => it[6] === 2 || it[6] === 3;

/** Card-click dialog on the All tab. Built inside the iframe document so the live stylesheets apply. */
export function openRecreateDialog(root: HTMLElement, items: TemplateItem[], order: number[], labels: string[], start: TemplateItem, h: { onUpload(): void; onChooseAvatar(): void }): RecreateHandle {
  const doc = root.ownerDocument;
  doc.querySelector("[data-ms2-recreate-dialog]")?.remove();
  const overlay = doc.createElement("div");
  overlay.setAttribute("data-ms2-recreate-dialog", "true"); overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true"); overlay.setAttribute("aria-label", "Recreate template");
  overlay.style.cssText = "position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.55);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)";
  const shell = doc.createElement("div");
  shell.style.cssText = "position:absolute;left:50%;top:112px;bottom:0;transform:translateX(-50%);display:flex;flex-direction:column;width:min(1348px,calc(100% - 48px));box-sizing:border-box;padding-top:16px;overflow:hidden;border-radius:24px 24px 0 0;background:#131416";
  const scroll = doc.createElement("div");
  scroll.className = "ms2-recreate-content hide-scrollbar min-h-0 flex-1 overflow-y-auto rounded-none motion-reduce:animate-none md:rounded-t-2xl";
  scroll.setAttribute("data-ms2-recreate-scroll-area", "true"); scroll.style.cssText = "flex:1 1 0;min-height:0;overflow-y:auto";
  const closeBtn = doc.createElement("button");
  closeBtn.type = "button"; closeBtn.setAttribute("aria-label", "Close");
  closeBtn.style.cssText = "position:absolute;top:26px;right:35px;z-index:30;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:9999px;border:0;background:rgba(255,255,255,.08);color:#fff;cursor:pointer";
  closeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.75 7.75L16.25 16.25M16.25 7.75L7.75 16.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>';
  shell.append(scroll, closeBtn); overlay.appendChild(shell); doc.body.appendChild(overlay);

  let product: string | null = null; let avatar: { url: string; name: string } | null = null; let current = start; let io: IntersectionObserver | null = null;
  const close = () => { io?.disconnect(); overlay.remove(); doc.removeEventListener("keydown", onKey); };
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
  doc.addEventListener("keydown", onKey);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) close(); });

  const applyProduct = () => {
    const btn = scroll.querySelector<HTMLElement>("button[aria-label='Upload product']"); if (!btn) return;
    btn.style.backgroundImage = product ? `url("${product}")` : ""; btn.style.backgroundSize = "contain"; btn.style.backgroundRepeat = "no-repeat"; btn.style.backgroundPosition = "center";
    Array.from(btn.children).forEach((c) => ((c as HTMLElement).style.opacity = product ? "0" : ""));
  };

  const applyAvatar = () => {
    const btn = scroll.querySelector<HTMLElement>("button[aria-label='Choose avatar']"); if (!btn) return;
    btn.style.backgroundImage = avatar ? `url("${avatar.url}")` : ""; btn.style.backgroundSize = "cover"; btn.style.backgroundPosition = "center";
    Array.from(btn.children).forEach((c) => ((c as HTMLElement).style.opacity = avatar ? "0" : ""));
  };

  const cardHtml = (it: TemplateItem, label: string, style: string) => {
    const poster = esc(sized(it[2], 640));
    const media = it[3] ? `<video aria-label="" src="${esc(it[3])}" poster="${poster}" muted loop playsinline preload="none" class="${MEDIA_CLS}"></video>` : `<img alt="" width="${it[4]}" height="${it[5]}" loading="lazy" decoding="async" draggable="false" class="${MEDIA_CLS}" src="${poster}">`;
    return `<a href="/marketing-studio/preset/${slugify(it[1])}-${it[0]}" aria-label="${esc(it[1])}" data-ms2-preset-link="true" data-preset-id="${it[0]}" class="${LINK_CLS}" style="${style}"><span data-ms2-card-frame="true" class="relative block size-full overflow-hidden bg-white/5"><span data-ms2-card-media="true" class="pointer-events-none absolute inset-0 overflow-hidden">${media}</span><span data-ms2-card-hover="true" aria-hidden="true" class="${HOVER_CLS}"><span data-ms2-card-category="true" class="w-full truncate text-q-label-xs-medium text-q-text-on-overlay-secondary">${esc(label)}</span><span data-ms2-card-name="true" class="w-full truncate text-q-accent-2xs-bold text-base! leading-4! text-q-text-primary uppercase [font-feature-settings:'ss04'_1]">${esc(it[1])}</span></span><span data-ms2-card-stroke="true" aria-hidden="true" class="pointer-events-none absolute inset-0 border-2 border-white/10"></span></span></a>`;
  };

  const render = (item: TemplateItem) => {
    current = item; io?.disconnect();
    const ratio = item[5] ? `${item[4]} / ${item[5]}` : "1 / 1";
    const full = esc(sized(item[2], 1080));
    const media = item[3]
      ? `<video aria-label="${esc(item[1])}" src="${esc(item[3])}" poster="${full}" autoplay muted loop playsinline class="block size-full object-contain"></video>`
      : `<img alt="${esc(item[1])}" width="${item[4]}" height="${item[5]}" loading="eager" fetchpriority="high" decoding="async" draggable="false" class="block size-full object-contain" src="${full}">`;
    scroll.setAttribute("data-ms2-preset-id", item[0]);
    scroll.innerHTML = (isUgc(item) ? UGC_EDITOR_HTML : RECREATE_EDITOR_HTML).replace("@@ASPECT@@", ratio).replace("@@MEDIA@@", media) + RECREATE_RELATED_HEAD;
    scroll.scrollTop = 0;
    scroll.querySelector("button[aria-label='Upload product']")?.addEventListener("click", () => h.onUpload());
    if (isUgc(item)) scroll.querySelector("button[aria-label='Choose avatar']")?.addEventListener("click", () => h.onChooseAvatar());
    else if (hasAvatar(item)) {
      // Second tile next to the product one, cloned from it so both share the live styling.
      const productCol = scroll.querySelector("label")?.parentElement; const row = productCol?.parentElement;
      if (productCol && row) {
        const col = productCol.cloneNode(true) as HTMLElement;
        productCol.className = productCol.className.replace("col-span-2 w-full", "flex-1"); col.className = productCol.className;
        const label = col.querySelector("label"); if (label) label.textContent = "Replace avatar";
        const btn = col.querySelector("button")!; btn.setAttribute("aria-label", "Choose avatar");
        const texts = btn.querySelectorAll("span"); texts.forEach((s) => { if (s.textContent === "Upload product") s.textContent = "Choose avatar"; else if (s.textContent === "Add your product") s.textContent = "Choose avatar"; });
        const icon = btn.querySelector(".ms2-reference-upload-icon svg"); if (icon) icon.outerHTML = AVATAR_ICON;
        const badge = Array.from(col.querySelectorAll("span")).find((s) => s.textContent === "Required"); if (badge) badge.textContent = "Optional";
        row.appendChild(col);
        btn.addEventListener("click", () => h.onChooseAvatar());
      }
    }
    applyProduct(); applyAvatar();

    const related = order.map((i) => items[i]).filter((x) => x && x[6] === item[6] && x[0] !== item[0]);
    const grid = scroll.querySelector<HTMLElement>("[data-ms2-preset-grid]")!;
    let shown = 0;
    const sentinel = doc.createElement("div"); sentinel.style.height = "1px";
    const more = () => {
      const w = grid.clientWidth; if (!w || shown >= related.length) return;
      const html: string[] = []; let cur: { it: TemplateItem; r: number }[] = []; let sum = 0;
      const flush = (fullRow: boolean) => { if (!cur.length) return; html.push(`<div data-ms2-preset-row="true" class="flex w-full items-start gap-1">${cur.map(({ it, r }) => cardHtml(it, labels[it[6]] ?? "", fullRow ? `flex:${r} 1 0px;min-width:0;aspect-ratio:${r} / 1` : `flex:0 0 ${Math.round(r * ROW_H)}px;min-width:0;aspect-ratio:${r} / 1`)).join("")}</div>`); cur = []; sum = 0; };
      const end = Math.min(related.length, shown + PAGE);
      for (const it of related.slice(shown, end)) { const r = it[5] ? it[4] / it[5] : 1; cur.push({ it, r }); sum += r; if ((w - GAP * (cur.length - 1)) / sum <= ROW_H) flush(true); }
      flush(end >= related.length ? false : true); shown = end;
      sentinel.remove(); grid.insertAdjacentHTML("beforeend", html.join("")); grid.appendChild(sentinel);
    };
    more();
    const View = doc.defaultView?.IntersectionObserver ?? IntersectionObserver;
    io = new View((en) => { if (en[0].isIntersecting) more(); }, { root: scroll, rootMargin: "800px 0px" }); io.observe(sentinel);
  };

  scroll.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const more = t.closest<HTMLButtonElement>("button[aria-label='Show more']");
    if (more) { more.parentElement?.querySelector<HTMLElement>(".overflow-x-auto")?.scrollBy({ left: 240, behavior: "smooth" }); return; }
    const group = t.closest<HTMLElement>("[data-ms2-setup-group]");
    const tile = t.closest<HTMLButtonElement>("button[aria-pressed]");
    if (group && tile && group.contains(tile)) {
      group.querySelectorAll<HTMLButtonElement>("button[aria-pressed]").forEach((b) => {
        const on = b === tile; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("opacity-100", on); b.classList.toggle("opacity-60", !on);
        b.querySelector(":scope > span[aria-hidden]")?.remove(); if (on) b.insertAdjacentHTML("beforeend", UGC_RING);
      });
      return;
    }
    const a = t.closest<HTMLAnchorElement>("a[data-preset-id]"); if (!a) return;
    e.preventDefault(); const next = items.find((x) => x[0] === a.dataset.presetId); if (next) render(next);
  });
  const hover = (e: Event, on: boolean) => {
    const a = (e.target as HTMLElement).closest("a[data-preset-id]"); const v = a?.querySelector("video"); if (!a || !v) return;
    if (a.contains((e as MouseEvent).relatedTarget as Node)) return;
    if (on) { v.muted = true; v.play().catch(() => {}); } else { v.pause(); v.currentTime = 0; }
  };
  scroll.addEventListener("mouseover", (e) => hover(e, true)); scroll.addEventListener("mouseout", (e) => hover(e, false));

  render(current);
  return { close, setProduct(url) { product = url; applyProduct(); }, setAvatar(a) { avatar = a; applyAvatar(); } };
}

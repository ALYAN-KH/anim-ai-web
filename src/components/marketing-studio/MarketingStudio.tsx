"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LANDING_HTML } from "./landing-html";
import { LIVE_CSS } from "./live-css";
import { LIVE_STYLE } from "./live-style";
import { openRecreateDialog, type RecreateHandle } from "./recreate-dialog";
import { openAdReferenceDialog, openProductLinkDialog, type AdReferenceHandle } from "./ad-reference-dialog";
import { GENERATIONS_MAIN_HTML } from "./generations-html";
import { STYLE_ITEMS } from "./style-dialog-data";
import { STYLE_DIALOG_HTML } from "./style-dialog-html";
import { ProductPicker, type PickedProduct } from "./product-picker";

type Media = "all" | "image" | "video";
interface Templates { total: number; categories: string[]; items: [string, string, string, string | 0, number, number, number][]; orders: Record<string, number[]> }

const CATEGORY_SLUGS: Record<string, string> = { All: "all", "Product shot": "product-shot", Motion: "motion", UGC: "ugc", TikTok: "tiktok", Ads: "ads", Posters: "posters", Marketplace: "marketplace" };
const CARD_LABEL = ["Product shot", "Product motion", "UGC video", "TikTok", "Ads", "Poster", "Marketplace"];
const CDN = "https://cdn.higgsfield.ai/cdn-cgi/image/width=640,quality=80,format=auto/";
const PAGE = 60;
const GAP = 4;

let cache: Promise<Templates> | null = null;
const loadTemplates = () => (cache ??= fetch("/marketing-studio/templates.json").then((r) => r.json()));
const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Hero carousel slots (x, y, w, h, z) measured from the live stage, ordered left to right by offset -3..3.
const SLOTS = [
  { x: -80, y: 94, w: 148, h: 130, z: 0, o: 0 }, { x: 122, y: 84, w: 168, h: 150, z: 0, o: 1 }, { x: 270, y: 69, w: 194, h: 180, z: 24, o: 1 },
  { x: 445, y: 43, w: 292, h: 228, z: 48, o: 1 }, { x: 713, y: 69, w: 194, h: 180, z: 24, o: 1 }, { x: 887, y: 84, w: 168, h: 150, z: 0, o: 1 }, { x: 1108, y: 94, w: 148, h: 130, z: 0, o: 0 },
];
/** "Choose style" dialog, built from the live markup inside the iframe document so the live stylesheets apply. */
function openStyleDialog(root: HTMLElement) {
  const doc = root.ownerDocument; if (doc.querySelector("[data-ms2-style-dialog]")) return;
  const overlay = doc.createElement("div"); overlay.setAttribute("data-ms2-style-dialog", "true"); overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true"); overlay.setAttribute("aria-label", "Choose style");
  overlay.style.cssText = "position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:24px";
  const shell = doc.createElement("div");
  shell.style.cssText = "display:flex;flex-direction:column;width:min(1040px,100%);height:min(700px,100%);min-height:0;box-sizing:border-box;padding:10px 10px 10px;border-radius:32px;border:1px solid rgba(255,255,255,.1);background:#131416;box-shadow:0 24px 64px rgba(0,0,0,.5)";
  shell.innerHTML = STYLE_DIALOG_HTML;
  const grid = shell.querySelector<HTMLElement>("[data-ms2-style-grid]"); const firstCard = grid?.querySelector<HTMLElement>("[role=radio]"); const productShots = grid?.innerHTML ?? "";
  const cardHtml = (it: { label: string; src: string; video?: string; aspect?: string }) => { const c = firstCard?.cloneNode(true) as HTMLElement; c.setAttribute("aria-label", it.label); c.setAttribute("aria-checked", "false"); c.tabIndex = -1; const img = c.querySelector("img");
    if (img && it.video) { const v = doc.createElement("video"); v.setAttribute("aria-label", ""); v.setAttribute("src", it.video); v.setAttribute("poster", it.src); v.setAttribute("loop", ""); v.setAttribute("playsinline", ""); v.setAttribute("preload", "none"); v.className = "size-full object-cover"; img.replaceWith(v); const box = v.parentElement; if (box) box.className = box.className.replace("aspect-3/4", it.aspect ?? "aspect-3/4"); }
    else if (img) { img.setAttribute("src", it.src); img.removeAttribute("width"); img.removeAttribute("height"); } const lbl = c.querySelector(":scope > span:last-child"); if (lbl) lbl.textContent = it.label; const ring = c.querySelector("[data-ms2-selected-style]"); if (ring) { ring.removeAttribute("data-ms2-selected-style"); ring.classList.remove("ring-2", "ring-inset", "ring-q-brand-primary"); } return c.outerHTML; };
  const hdr = shell.querySelector<HTMLElement>("header"); if (hdr) hdr.style.padding = "0 8px 0 10px";
  overlay.appendChild(shell); doc.body.appendChild(overlay);
  const close = () => { overlay.remove(); doc.removeEventListener("keydown", onKey); };
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
  doc.addEventListener("keydown", onKey);
  const hover = (e: Event, on: boolean) => { const card = (e.target as HTMLElement).closest?.("[role=radio]"); const v = card?.querySelector("video"); if (!v) return; if (on) { v.muted = true; v.play().catch(() => {}); } else { v.pause(); v.currentTime = 0; } };
  overlay.addEventListener("mouseover", (e) => { const c = (e.target as HTMLElement).closest("[role=radio]"); if (c && !c.contains(e.relatedTarget as Node)) hover(e, true); });
  overlay.addEventListener("mouseout", (e) => { const c = (e.target as HTMLElement).closest("[role=radio]"); if (c && !c.contains(e.relatedTarget as Node)) hover(e, false); });
  overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) close(); });
  overlay.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (t.closest("button[aria-label='Close']")) { close(); return; }
    const radio = t.closest<HTMLElement>("[role=radio]");
    if (radio) {
      overlay.querySelectorAll<HTMLElement>("[role=radio]").forEach((b) => { const on = b === radio; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; const ring = b.querySelector<HTMLElement>("[aria-hidden]"); if (ring) { ring.classList.toggle("ring-2", on); ring.classList.toggle("ring-inset", on); ring.classList.toggle("ring-q-brand-primary", on); if (on) ring.setAttribute("data-ms2-selected-style", "true"); else ring.removeAttribute("data-ms2-selected-style"); } });
      return;
    }
    const cat = t.closest<HTMLButtonElement>("nav button[aria-pressed]");
    if (cat) {
      const btns = Array.from(overlay.querySelectorAll<HTMLButtonElement>("nav button[aria-pressed]")); const onCls = btns.find((b) => b.getAttribute("aria-pressed") === "true")?.className; const offCls = btns.find((b) => b.getAttribute("aria-pressed") === "false")?.className;
      if (!onCls || !offCls) return;
      btns.forEach((b) => { const on = b === cat; b.className = on ? onCls : offCls; b.setAttribute("aria-pressed", String(on)); });
      const name = cat.textContent?.trim() ?? ""; const title = overlay.querySelector("[data-ms2-category-title]"); if (title) title.textContent = name;
      if (grid && firstCard) { grid.innerHTML = name === "Product shot" ? productShots : (STYLE_ITEMS[name] ?? []).map(cardHtml).join(""); grid.scrollTop = 0; }
    }
  });
}

const HERO_ORDER = ["Marketplace", "TikTok", "UGC", "Product shot", "Motion", "Ads", "Posters"];


function GalleryCard({ it, grow, fixedW, onOpen }: { it: Templates["items"][number]; grow: number; fixedW?: number; onOpen?: (it: Templates["items"][number]) => void }) {
  const v = useRef<HTMLVideoElement>(null);
  const poster = it[2].startsWith("~") ? CDN + it[2].slice(1) : it[2];
  const play = () => { const e = v.current; if (e) { e.muted = true; e.play().catch(() => {}); } };
  const stop = () => { const e = v.current; if (e) { e.pause(); e.currentTime = 0; } };
  const style = fixedW ? { flex: `0 0 ${fixedW}px`, aspectRatio: String(grow), minWidth: 0 } : { flexGrow: grow, flexShrink: 1, flexBasis: 0, minWidth: 0, aspectRatio: String(grow) };
  return (
    <a href={`/marketing-studio/preset/${slugify(it[1])}-${it[0]}`} aria-label={it[1]} data-ms2-preset-link="true" style={style} onClick={onOpen ? (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); onOpen(it); } : undefined} onMouseEnter={play} onMouseLeave={stop} onFocus={play} onBlur={stop}
      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-q-border-focus">
      <span data-ms2-card-frame="true" className="relative block size-full overflow-hidden bg-white/5">
        <span data-ms2-card-media="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {it[3]
            ? <video ref={v} aria-label="" src={it[3]} poster={poster} muted loop playsInline preload="none" className="absolute inset-0 size-full max-w-none object-cover object-center" />
            // eslint-disable-next-line @next/next/no-img-element
            : <img alt="" src={poster} width={it[4]} height={it[5]} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 size-full max-w-none object-cover object-center" />}
        </span>
        <span data-ms2-card-hover="true" aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-start justify-end gap-0.5 bg-q-transparent-dark-40 p-2.5 text-left opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
          <span data-ms2-card-category="true" className="w-full truncate text-q-label-xs-medium text-q-text-on-overlay-secondary">{CARD_LABEL[it[6]]}</span>
          <span data-ms2-card-name="true" className="w-full truncate text-q-accent-2xs-bold text-base! leading-4! text-q-text-primary uppercase [font-feature-settings:'ss04'_1]">{it[1]}</span>
        </span>
        <span data-ms2-card-stroke="true" aria-hidden="true" className="pointer-events-none absolute inset-0 border-2 border-white/10" />
      </span>
    </a>
  );
}

/** Justified rows over the full template list, revealed progressively as the user scrolls. */
function Gallery({ cat, media, scroller, onOpen }: { cat: string; media: Media; scroller: HTMLElement | null; onOpen?: (it: Templates["items"][number]) => void }) {
  const [data, setData] = useState<Templates | null>(null);
  const [w, setW] = useState(0);
  const [count, setCount] = useState(PAGE);
  const wrap = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => { loadTemplates().then(setData).catch(() => setData(null)); }, []);
  useEffect(() => { const e = wrap.current; if (!e) return; const ro = new ResizeObserver(() => setW(Math.floor(e.getBoundingClientRect().width))); ro.observe(e); setW(Math.floor(e.getBoundingClientRect().width)); return () => ro.disconnect(); }, []);
  useEffect(() => setCount(PAGE), [cat, media]);
  const list = useMemo(() => (data ? data.orders[cat].map((i) => data.items[i]).filter((it) => media === "all" || (media === "video") === !!it[3]) : []), [data, cat, media]);
  useEffect(() => {
    const e = sentinel.current; if (!e || count >= list.length) return;
    const io = new (e.ownerDocument.defaultView?.IntersectionObserver ?? IntersectionObserver)((en) => { if (en[0].isIntersecting) setCount((c) => c + PAGE); }, { root: scroller, rootMargin: "1200px 0px" });
    io.observe(e); return () => io.disconnect();
  }, [scroller, count, list.length]);
  const maxH = w >= 1024 ? 500 : w >= 640 ? 380 : 260;
  const rows = useMemo(() => {
    if (!w) return [];
    const out: { cards: { it: Templates["items"][number]; r: number }[]; full: boolean }[] = [];
    let cur: { it: Templates["items"][number]; r: number }[] = []; let sum = 0;
    for (const it of list.slice(0, count)) {
      const r = it[5] ? it[4] / it[5] : 1; cur.push({ it, r }); sum += r;
      if ((w - GAP * (cur.length - 1)) / sum <= maxH) { out.push({ cards: cur, full: true }); cur = []; sum = 0; }
    }
    if (cur.length) out.push({ cards: cur, full: false });
    return out;
  }, [list, count, w, maxH]);
  return (
    <div ref={wrap} className="flex w-full flex-col gap-1">
      {data && list.length === 0 && <p className="py-16 text-center text-sm text-white/50">No templates found</p>}
      {rows.map((row, k) => (
        <div key={k} data-ms2-preset-row="true" className="flex items-start gap-1">
          {row.cards.map(({ it, r }) => <GalleryCard key={it[0]} it={it} grow={r} fixedW={row.full ? undefined : Math.round(r * maxH)} onOpen={onOpen} />)}
        </div>
      ))}
      <div ref={sentinel} aria-hidden="true" className="h-px" />
    </div>
  );
}

const FRAME_DOC = '<!doctype html><html data-theme="default-light" style="color-scheme:light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_top"></head><body class="antialiased scheme-only-dark" style="margin:0;background:#131416"><div id="ms-root" style="height:100vh"></div></body></html>';

/** The page runs inside an iframe so the live site's layered stylesheets don't fight this project's global Tailwind. */
type View = "home" | "generations" | "favorites";

/** Staggered blur-in of the empty-state icon and words, like the live page. */
function animateSubpage(main: HTMLElement) {
  const els: (Element | null)[] = [main.querySelector("section > div > div:first-child"), ...Array.from(main.querySelectorAll("section h2 span, section p span"))];
  els.forEach((el, i) => el?.animate?.([{ opacity: 0, filter: "blur(8px)", transform: "translateY(8px)" }, { opacity: 1, filter: "blur(0px)", transform: "none" }], { duration: 520, delay: i * 70, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }));
}

/** My generations / My favorites live next to the landing page inside one shell; switching views never reloads the iframe. */
function applyView(r: HTMLElement, view: View, nav: { on: string; off: string } | null) {
  const home = r.querySelector<HTMLElement>("main.ms2-main-surface:not([data-ms2-subpage])"); if (!home) return;
  r.querySelector("main[data-ms2-subpage]")?.remove();
  home.style.display = view === "home" ? "" : "none";
  if (view !== "home") {
    home.insertAdjacentHTML("afterend", GENERATIONS_MAIN_HTML);
    const main = home.nextElementSibling as HTMLElement; main.setAttribute("data-ms2-subpage", view);
    if (view === "favorites") {
      main.querySelector("button[aria-label='Back to Marketing Studio']")?.remove();
      main.querySelector("[data-ms2-generations-composer]")?.remove();
      const h1 = main.querySelector("h1"); if (h1) h1.textContent = "My favorites";
      const spans = main.querySelectorAll("section p span");
      if (spans[1]) { const liked = spans[1].cloneNode(true) as HTMLElement; liked.innerHTML = "liked&nbsp;"; spans[1].before(liked); }
    }
    animateSubpage(main);
  }
  if (!nav) return;
  const hrefs: Record<View, string> = { home: "/marketing-studio", generations: "/marketing-studio/generations", favorites: "/marketing-studio/favorites" };
  (Object.keys(hrefs) as View[]).forEach((v) => {
    const a = r.querySelector<HTMLAnchorElement>("nav[aria-label='Marketing Studio'] a[href='" + hrefs[v] + "']"); if (!a) return;
    const on = v === view; a.className = on ? nav.on : nav.off;
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    a.setAttribute("data-status", on ? "active" : "inactive");
  });
}

/** Sidebar "Sort projects" dropdown. */
function toggleSortMenu(btn: HTMLElement) {
  const doc = btn.ownerDocument; const rect = btn.getBoundingClientRect();
  const menu = doc.createElement("div"); menu.setAttribute("data-ms2-filter-menu", "true"); menu.setAttribute("role", "menu"); menu.setAttribute("aria-label", "Sort by");
  menu.style.cssText = `position:fixed;z-index:60;top:${Math.round(rect.bottom + 8)}px;right:${Math.round(doc.documentElement.clientWidth - rect.right - 18)}px;width:227px;box-sizing:border-box;padding:8px;border-radius:20px;background:#1c1d1f;box-shadow:0 12px 32px rgba(0,0,0,.45);color:#fff`;
  const check = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="color:#d1fe17"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const opts = ["First created", "Last created", "Last changed", "Name A-Z", "Name Z-A"]; let current = "Name A-Z";
  const draw = () => { menu.innerHTML = '<div style="padding:12px 12px 6px;color:rgba(255,255,255,.5);font-size:14px;font-weight:500">Sort by</div>' + opts.map((o) => `<div role="menuitemradio" aria-checked="${o === current}" data-opt="${o}" style="display:flex;align-items:center;justify-content:space-between;height:46px;padding:0 12px;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer">${o}${o === current ? check : ""}</div>`).join(""); };
  draw();
  menu.addEventListener("click", (e) => { const it = (e.target as HTMLElement).closest<HTMLElement>("[data-opt]"); if (!it) return; current = it.dataset.opt!; draw(); window.setTimeout(() => { menu.remove(); btn.setAttribute("aria-expanded", "false"); }, 120); });
  doc.body.appendChild(menu); btn.setAttribute("aria-expanded", "true");
}

/** Filter dropdown under the header button (Type / Activity groups). */
function toggleFilterMenu(btn: HTMLElement) {
  const doc = btn.ownerDocument; const existing = doc.querySelector("[data-ms2-filter-menu]");
  if (existing) { existing.remove(); btn.setAttribute("aria-expanded", "false"); return; }
  const rect = btn.getBoundingClientRect();
  const menu = doc.createElement("div"); menu.setAttribute("data-ms2-filter-menu", "true"); menu.setAttribute("role", "menu");
  menu.style.cssText = `position:fixed;z-index:60;top:${Math.round(rect.bottom + 8)}px;right:${Math.round(doc.documentElement.clientWidth - rect.right + 4)}px;width:278px;box-sizing:border-box;padding:12px;border-radius:20px;background:#1c1d1f;box-shadow:0 12px 32px rgba(0,0,0,.45);color:#fff;font-size:15px;line-height:20px`;
  const ic = (d: string) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="flex:none"><path d="${d}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const item = (label: string, icon: string, tail = "") => `<div role="menuitem" data-label="${label}" style="display:flex;align-items:center;gap:12px;height:40px;padding:0 8px;border-radius:12px;cursor:pointer">${icon}<span style="flex:1;font-weight:600">${label}</span>${tail}</div>`;
  const head = (t: string) => `<div style="padding:4px 8px 8px;color:rgba(255,255,255,.5);font-size:14px">${t}</div>`;
  const check = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const toggle = `<span data-toggle="" style="width:36px;height:20px;border-radius:10px;background:rgba(255,255,255,.2);position:relative"><span style="position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .15s"></span></span>`;
  const eyeOff = "M4 4l16 16M10 6.5A9 9 0 0 1 22 12a9 9 0 0 1-2 3M6 8a9 9 0 0 0-4 4s3 7 10 7a9 9 0 0 0 4-1";
  menu.innerHTML = head("Type") + item("All", ic("M4 4h10v10H4zM10 10h10v10H10z"), `<span data-check="">${check}</span>`) + item("Image", ic("M4 4h16v16H4zM4 16l5-5 4 4 3-3 4 4")) + item("Video", ic("M3 6h13v12H3zM16 10l5-3v10l-5-3")) + item("Hide failed", ic(eyeOff), toggle)
    + `<div style="height:1px;margin:8px 0;background:rgba(255,255,255,.08)"></div>` + head("Activity") + item("Liked", ic("M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z")) + item("Downloaded", ic("M12 4v11m-4-4 4 4 4-4M5 20h14")) + item("Not viewed", ic(eyeOff));
  menu.addEventListener("click", (e) => {
    const it = (e.target as HTMLElement).closest<HTMLElement>("[role=menuitem]"); if (!it) return; const label = it.dataset.label;
    if (label === "Hide failed") { const t = it.querySelector<HTMLElement>("[data-toggle]")!; const on = t.dataset.on !== "1"; t.dataset.on = on ? "1" : ""; t.style.background = on ? "#d1fe17" : "rgba(255,255,255,.2)"; (t.firstElementChild as HTMLElement).style.left = on ? "18px" : "2px"; return; }
    if (label === "All" || label === "Image" || label === "Video") menu.querySelectorAll<HTMLElement>("[role=menuitem]").forEach((x) => { if (["All", "Image", "Video"].includes(x.dataset.label ?? "")) { x.querySelector("[data-check]")?.remove(); if (x === it) x.insertAdjacentHTML("beforeend", `<span data-check="">${check}</span>`); } });
  });
  doc.body.appendChild(menu); btn.setAttribute("aria-expanded", "true");
}

export function MarketingStudio() {
  const router = useRouter();
  const pathname = usePathname();
  const view: View = pathname.endsWith("/generations") ? "generations" : pathname.endsWith("/favorites") ? "favorites" : "home";
  const navCls = useRef<{ on: string; off: string } | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [scroller, setScroller] = useState<HTMLElement | null>(null);
  const [cat, setCat] = useState("all");
  const [media, setMedia] = useState<Media>("all");
  const [productOpen, setProductOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const recreate = useRef<RecreateHandle | null>(null);
  const adRef = useRef<AdReferenceHandle | null>(null);
  const [product, setProduct] = useState<PickedProduct | null>(null);

  const onLoad = () => {
    const doc = frame.current?.contentDocument; const r = doc?.getElementById("ms-root"); if (!doc || !r || r.childElementCount) return;
    const style = doc.createElement("style"); style.textContent = LIVE_STYLE; doc.head.appendChild(style);
    LIVE_CSS.forEach((href) => { const l = doc.createElement("link"); l.rel = "stylesheet"; l.href = href; doc.head.appendChild(l); });
    r.innerHTML = LANDING_HTML;
    const links = r.querySelectorAll<HTMLAnchorElement>("nav[aria-label='Marketing Studio'] a[href^='/marketing-studio']");
    if (links.length > 1) navCls.current = { on: links[0].className, off: links[1].className };
    setMount(r.querySelector<HTMLElement>("#ms-gallery-root")); setScroller(r.querySelector<HTMLElement>(".ms2-landing-scroll")); setRoot(r);
  };
  useEffect(() => { if (frame.current?.contentDocument?.readyState === "complete") onLoad(); }, []);

  // Filter chips keep their original markup; only the active styling and state are driven from here.
  const chipCls = useRef({ on: "", off: "", mOn: "", mOff: "" });
  useEffect(() => {
    if (!root) return;
    const chips = Array.from(root.querySelectorAll<HTMLButtonElement>("section[aria-label='Explore templates'] button:not([data-media-filter])")).filter((b) => CATEGORY_SLUGS[b.textContent?.trim() ?? ""]);
    const radios = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-media-filter]"));
    if (!chipCls.current.on && chips.length > 1 && radios.length > 1) chipCls.current = { on: chips[0].className, off: chips[1].className, mOn: radios.find((b) => b.getAttribute("aria-checked") === "true")?.className ?? "", mOff: radios.find((b) => b.getAttribute("aria-checked") === "false")?.className ?? "" };
    chips.forEach((b) => { const on = CATEGORY_SLUGS[b.textContent!.trim()] === cat; b.className = on ? chipCls.current.on : chipCls.current.off; b.setAttribute("aria-pressed", String(on)); });
    radios.forEach((b) => { const on = b.dataset.mediaFilter === media; b.className = on ? chipCls.current.mOn : chipCls.current.mOff; b.setAttribute("aria-checked", String(on)); });
  }, [root, cat, media]);

  // Delegated clicks and input: filters, space switcher, sidebar collapse and the composer (generation itself needs the Higgsfield API, which isn't connected).
  useEffect(() => {
    if (!root) return;
    let batch = 1;
    const onInput = (e: Event) => {
      const t = e.target as HTMLElement; if (t.getAttribute("role") !== "textbox") return;
      const ph = t.parentElement?.nextElementSibling as HTMLElement | null; if (ph) ph.style.display = t.textContent?.trim() ? "none" : "";
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const mf = t.closest<HTMLElement>("[data-media-filter]");
      if (mf) { setMedia((mf.dataset.mediaFilter as Media) ?? "all"); return; }
      const chip = t.closest<HTMLButtonElement>("section[aria-label='Explore templates'] button");
      if (chip && CATEGORY_SLUGS[chip.textContent?.trim() ?? ""]) { setCat(CATEGORY_SLUGS[chip.textContent!.trim()]); return; }
      if (t.closest("button[aria-label='Choose style']")) { openStyleDialog(root); return; }
      const openMenu = t.ownerDocument.querySelector("[data-ms2-filter-menu]"); if (openMenu && !openMenu.contains(t)) { openMenu.remove(); root.querySelector("button[aria-label='Filter']")?.setAttribute("aria-expanded", "false"); }
      if (t.closest("button[aria-label='Back to Marketing Studio']")) { router.push("/marketing-studio"); return; }
      const sortBtn = t.closest<HTMLElement>("button[aria-label='Sort projects']"); if (sortBtn) { if (!openMenu) toggleSortMenu(sortBtn); return; }
      const filterBtn = t.closest<HTMLElement>("button[aria-label='Filter']"); if (filterBtn) { if (!openMenu) toggleFilterMenu(filterBtn); return; }
      const link = t.closest<HTMLAnchorElement>("nav a[href]"); const path = link?.getAttribute("href");
      if (link && (path === "/marketing-studio" || path === "/marketing-studio/generations" || path === "/marketing-studio/favorites") && !e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); router.push(path); return; }
      if (t.closest("button[aria-label='Product Link']")) { openProductLinkDialog(root); return; }
      if (t.closest("button[aria-label='Ad Reference']")) {
        adRef.current = openAdReferenceDialog(root, { onPickProduct: () => setProductOpen(true), onPickAvatar: () => setAvatarOpen(true) });
        adRef.current.setProduct(productUrl.current); return;
      }
      const card = t.closest<HTMLElement>("[data-ms2-attachment-card] > [role=button]");
      if (card && card.getAttribute("aria-label") === "Avatar") { setAvatarOpen(true); return; }
      if (card && card.getAttribute("aria-label") === "Product") { setProductOpen(true); return; }
      const slot = root.querySelector("[data-ms2-composer-slot], [data-ms2-generations-composer]");
      if (slot && slot.contains(t)) {
        const tab = t.closest<HTMLButtonElement>("button"); const label = tab?.textContent?.trim();
        if (tab && (label === "Image" || label === "Video")) {
          const other = Array.from(slot.querySelectorAll<HTMLButtonElement>("button")).find((b) => b.textContent?.trim() === (label === "Image" ? "Video" : "Image"));
          if (other && other.className !== tab.className) { const c = tab.className; tab.className = other.className; other.className = c; }
          return;
        }
        const al = tab?.getAttribute("aria-label"); const dir = al === "Increase batch size" ? 1 : al === "Decrease batch size" ? -1 : 0;
        if (tab && dir) {
          batch = Math.min(4, Math.max(1, batch + dir)); const row = tab.parentElement; const num = row?.querySelector("span"); if (num) num.textContent = `${batch}/4`;
          row?.querySelectorAll("button").forEach((b) => { const d = b.getAttribute("aria-label") === "Decrease batch size" ? batch <= 1 : batch >= 4; if (d) b.setAttribute("disabled", ""); else b.removeAttribute("disabled"); });
          return;
        }
      }
      const sw = t.closest<HTMLButtonElement>("button[aria-expanded]");
      if (sw && sw.querySelector("#space-switcher-label")) {
        const open = sw.getAttribute("aria-expanded") !== "true"; sw.setAttribute("aria-expanded", String(open));
        const panel = sw.nextElementSibling as HTMLElement | null;
        if (panel) { panel.className = panel.className.replace(/grid-rows-\[[01]fr\]/, open ? "grid-rows-[1fr]" : "grid-rows-[0fr]").replace(/opacity-(0|100)/, open ? "opacity-100" : "opacity-0"); panel.setAttribute("aria-hidden", String(!open)); panel.querySelector("button")?.setAttribute("tabindex", open ? "0" : "-1"); }
        sw.querySelectorAll<SVGPathElement>("path[data-segment]").forEach((p) => p.setAttribute("class", p.getAttribute("class")!.replace(/\[transform:scaleY\(-1\)\]/, "") + (open ? "" : " [transform:scaleY(-1)]")));
        return;
      }
      const hf = t.closest<HTMLButtonElement>("button");
      if (hf && hf.textContent?.trim() === "Higgsfield AI") { router.push("/"); return; }
      if (t.closest("button[aria-label='Collapse sidebar'], button[aria-label='Expand sidebar']")) {
        const sb = root.querySelector<HTMLElement>("[data-folder-sidebar]"); if (!sb) return;
        const collapse = !sb.hasAttribute("data-collapsed");
        sb.toggleAttribute("data-collapsed", collapse); sb.style.width = collapse ? "52px" : "231px";
        const inner = sb.firstElementChild?.firstElementChild as HTMLElement | null; if (inner) inner.style.width = collapse ? "50px" : "229px";
        sb.querySelector("nav")?.toggleAttribute("data-collapsed", collapse);
        sb.querySelector("._pricing_56d5q_1")?.classList.toggle("_collapsed_56d5q_55", collapse);
        sb.querySelector("#space-switcher-label")?.closest("button")?.parentElement?.classList.toggle("hidden", collapse);
        const login = sb.querySelector<HTMLElement>("button[aria-label='Log in']");
        if (login) { login.classList.toggle("w-9", collapse); login.classList.toggle("w-full", !collapse); login.classList.toggle("px-3", !collapse); login.classList.toggle("gap-2", !collapse); const lbl = login.querySelector<HTMLElement>(".ms2-login-label"); if (lbl) lbl.style.display = collapse ? "none" : ""; }
        const account = sb.querySelector<HTMLElement>("[data-cinema-sidebar-account]"); if (account) account.style.alignItems = collapse ? "center" : "";
        t.closest("button")?.setAttribute("aria-label", collapse ? "Expand sidebar" : "Collapse sidebar");
      }
    };
    root.addEventListener("input", onInput); root.addEventListener("click", onClick);
    return () => { root.removeEventListener("input", onInput); root.removeEventListener("click", onClick); };
  }, [root, router]);

  // Hero carousel: the card nearest the centre grows and plays; the stage rotates every few seconds.
  useEffect(() => {
    const stage = root?.querySelector<HTMLElement>("[data-ms2-hero-stage]"); if (!stage) return;
    const cards = new Map<string, HTMLElement>();
    Array.from(stage.children).forEach((c) => { const el = c as HTMLElement; if (el.getAttribute("aria-hidden") === "true") return; const name = el.getAttribute("aria-label") ?? el.textContent?.trim() ?? ""; const label = HERO_ORDER.find((l) => name.startsWith(l)); if (label) cards.set(label, el); });
    if (cards.size < 7) return;
    let center = HERO_ORDER.indexOf("Product shot");
    const apply = () => HERO_ORDER.forEach((label, i) => {
      const el = cards.get(label)!; const off = Math.round(((i - center + 10.5) % 7) - 3.5); const s = SLOTS[Math.max(0, Math.min(6, off + 3))];
      Object.assign(el.style, { width: `${s.w}px`, height: `${s.h}px`, transform: `translate3d(${s.x}px, ${s.y}px, ${s.z}px)`, opacity: String(s.o), zIndex: String(10 - Math.abs(off)), transition: "transform .6s cubic-bezier(.22,1,.36,1), width .6s cubic-bezier(.22,1,.36,1), height .6s cubic-bezier(.22,1,.36,1), opacity .4s", pointerEvents: s.o ? "auto" : "none", cursor: "pointer" });
      const v = el.querySelector("video"); if (v) { v.preload = "auto"; v.style.transition = "opacity .4s"; if (off === 0) { v.muted = true; v.style.opacity = "1"; v.play().catch(() => {}); } else { v.style.opacity = "0"; v.pause(); } }
    });
    apply();
    const id = window.setInterval(() => { center = (center + 1) % 7; apply(); }, 5000);
    const click = (e: Event) => { const el = (e.target as HTMLElement).closest<HTMLElement>("[data-ms2-hero-stage] > button"); const label = HERO_ORDER.find((l) => cards.get(l) === el); if (label) { center = HERO_ORDER.indexOf(label); apply(); } };
    stage.addEventListener("click", click);
    return () => { window.clearInterval(id); stage.removeEventListener("click", click); };
  }, [root]);

  // Compact prompt bar: fades in once the hero composer scrolls out of view and away again when it returns.
  useEffect(() => {
    const slot = root?.querySelector<HTMLElement>("[data-ms2-composer-slot]"); const main = root?.querySelector<HTMLElement>("main.ms2-main-surface");
    if (!root || !slot || !main || !scroller) return;
    const doc = root.ownerDocument;
    const bar = doc.createElement("div"); bar.setAttribute("data-ms2-sticky-prompt", "true"); bar.setAttribute("role", "button"); bar.tabIndex = -1; bar.setAttribute("aria-label", "Describe the scene you imagine");
    bar.style.cssText = "position:absolute;left:50%;bottom:24px;z-index:40;display:flex;align-items:center;justify-content:space-between;gap:12px;width:min(40rem,calc(100% - 48px));height:64px;padding:12px 12px 12px 24px;box-sizing:border-box;border-radius:20px;background:#232527;border:1px solid rgba(255,255,255,.1);box-shadow:0 8px 24px rgba(0,0,0,.5);cursor:text;transition:opacity .3s,transform .3s;opacity:0;transform:translate(-50%,16px);pointer-events:none";
    const text = doc.createElement("span"); text.textContent = "Describe the scene you imagine..."; text.style.cssText = "font-size:16px;font-weight:500;color:rgba(255,255,255,.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
    const gen = doc.createElement("span"); gen.setAttribute("aria-hidden", "true"); gen.style.cssText = "display:flex;flex:none;align-items:center;justify-content:center;width:44px;height:40px;border-radius:12px;background:#d1fe17;color:#000";
    const icon = root.querySelector("button[aria-label='Generate'] svg"); if (icon) { const c = icon.cloneNode(true) as SVGElement; c.setAttribute("class", ""); c.setAttribute("width", "20"); c.setAttribute("height", "20"); gen.appendChild(c); }
    bar.append(text, gen); main.appendChild(bar);
    const show = (on: boolean) => { bar.style.opacity = on ? "1" : "0"; bar.style.transform = on ? "translate(-50%,0)" : "translate(-50%,16px)"; bar.style.pointerEvents = on ? "auto" : "none"; bar.tabIndex = on ? 0 : -1; };
    const io = new (doc.defaultView?.IntersectionObserver ?? IntersectionObserver)(([en]) => show(!en.isIntersecting && en.boundingClientRect.bottom < (en.rootBounds?.top ?? 0) + 1), { root: scroller });
    io.observe(slot);
    const toTop = () => { scroller.scrollTo({ top: 0, behavior: "smooth" }); slot.querySelector<HTMLElement>("[role=textbox]")?.focus({ preventScroll: true }); };
    bar.addEventListener("click", toTop);
    return () => { io.disconnect(); bar.removeEventListener("click", toTop); bar.remove(); };
  }, [root, scroller]);

  // All and Motion tabs: clicking a template opens the Recreate dialog; its upload tile reuses the product picker.
  const openRecreate = (it: Templates["items"][number]) => {
    if (!root) return;
    loadTemplates().then((d) => { recreate.current = openRecreateDialog(root, d.items, d.orders.all, CARD_LABEL, it, { onUpload: () => setProductOpen(true), onChooseAvatar: () => setAvatarOpen(true) }); recreate.current.setProduct(productUrl.current); });
  };
  const productUrl = useRef<string | null>(null);
  useEffect(() => { productUrl.current = product?.url ?? null; recreate.current?.setProduct(productUrl.current); adRef.current?.setProduct(productUrl.current); }, [product]);

  useEffect(() => { if (root) applyView(root, view, navCls.current); }, [root, view]);

  // The chosen product replaces the Product card's background in the composer.
  useEffect(() => {
    const card = root?.querySelector<HTMLElement>("[data-ms2-attachment-card] > [aria-label='Product']"); if (!card) return;
    card.style.backgroundImage = product ? `linear-gradient(0deg,rgba(0,0,0,.45),rgba(0,0,0,0) 60%), url("${product.url}")` : "";
    card.style.backgroundSize = "cover"; card.style.backgroundPosition = "center";
    card.setAttribute("aria-pressed", String(!!product));
  }, [root, product]);

  return (
    <div className="fixed inset-0 z-[60] bg-[#131416]">
      <iframe ref={frame} title="Marketing Studio" srcDoc={FRAME_DOC} onLoad={onLoad} className="size-full border-0" />
      {avatarOpen && <ProductPicker avatars onClose={() => setAvatarOpen(false)} onSelect={(p) => { setProduct(p); setAvatarOpen(false); }} onSelectAvatar={(a) => {
        if (root?.ownerDocument.querySelector("[data-ms2-recreate-dialog]")) recreate.current?.setAvatar({ url: a.url, name: a.name });
        else if (root?.ownerDocument.querySelector("[data-ms2-ad-reference]")) adRef.current?.setAvatar(a.url);
        else { const c = root?.querySelector<HTMLElement>("[data-ms2-attachment-card] > [aria-label='Avatar']"); if (c) { c.style.backgroundImage = `linear-gradient(0deg,rgba(0,0,0,.45),rgba(0,0,0,0) 60%), url("${a.url}")`; c.style.backgroundSize = "cover"; c.style.backgroundPosition = "center"; c.setAttribute("aria-pressed", "true"); } }
        setAvatarOpen(false);
      }} />}
      {productOpen && <ProductPicker onClose={() => setProductOpen(false)} onSelect={(p) => { setProduct(p); setProductOpen(false); }} />}
      {mount && createPortal(<Gallery cat={cat} media={media} scroller={scroller} onOpen={["all", "product-shot", "motion", "ugc", "tiktok", "ads", "posters", "marketplace"].includes(cat) ? openRecreate : undefined} />, mount)}
    </div>
  );
}

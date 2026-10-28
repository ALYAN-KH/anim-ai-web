"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  Aperture,
  AudioLines,
  Camera,
  ChevronDown,
  ChevronUp,
  Diamond,
  Globe,
  Image as ImageIcon,
  Languages,
  LayoutGrid,
  Menu,
  Mic,
  Music,
  Paintbrush,
  Sparkles,
  Sun,
  UserRound,
  Video,
  Volume2,
  X,
} from "lucide-react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import data from "@/data/content";
import { imageMenuIcons } from "@/data/content/image-navigation";
import { videoMenuIcons } from "@/data/content/video-navigation";

import { audioMenuIcons } from "@/data/content/audio-navigation";

import { mcpMenuIcons } from "@/data/content/mcp-navigation";
import { HiggsSnake } from "@/components/ui/HiggsSnake";
import { AuthDialog } from "@/components/auth/AuthDialog";
import type { AuthMode } from "@/components/auth/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeAll, setMenu, toggleDrawer } from "@/store";

const referenceMenuIcons = { ...imageMenuIcons, ...videoMenuIcons, ...audioMenuIcons, ...mcpMenuIcons };
const isReferenceMenu = (label: string) => ["Image", "Video", "Audio", "MCP"].includes(label);

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
  badge?: string;
  menu?: string[] | { groups: MenuGroup[] };
};
type MenuItem = {
  label: string;
  description: string;
  href: string;
  icon?: string;
  badge?: string;
};
type MenuGroup = { title: string; items: MenuItem[] };
function getMenuGroups(item: NavItem): MenuGroup[] {
  if (item.label === "Explore") return [];

  if (Array.isArray(item.menu)) {
    return [
      {
        title: item.label,
        items: item.menu.map((label) => ({
          label,
          description: "",
          href: item.href,
        })),
      },
    ];
  }
  return item.menu && Array.isArray(item.menu.groups) ? item.menu.groups : [];
}
const menuIcons = {
  image: ImageIcon,
  camera: Camera,
  canvas: LayoutGrid,
  moodboard: Aperture,
  character: UserRound,
  influencer: UserRound,
  photodump: ImageIcon,
  relight: Sun,
  inpaint: Paintbrush,
  higgsfield: Aperture,
  openai: Sparkles,
  google: Aperture,
  seedream: Aperture,
  flux: Aperture,
  recraft: Paintbrush,
  video: Video,
  lipsync: Mic,
  effects: Sparkles,
  seedance: Video,
  kling: Video,
  wan: Video,
  sora: Sparkles,
  grok: Sparkles,
  voice: Mic,
  music: Music,
  sound: Volume2,
  translate: Languages,
  audio: AudioLines,
} as const;
const navShineClasses =
  "inline-block bg-[linear-gradient(100deg,var(--shine-base)_0%,var(--shine-base)_42%,var(--shine-highlight)_50%,var(--shine-base)_58%,var(--shine-base)_100%)] bg-[length:300%_100%] bg-[position:100%_0] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-[nav-text-shine_10s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:[-webkit-text-fill-color:var(--shine-base)]";
function MenuGlyph({ name }: { name?: string }) {
  if (name && referenceMenuIcons[name]) return <span aria-hidden="true" className="inline-flex [&_svg]:size-6 [&_img]:size-6" dangerouslySetInnerHTML={{ __html: referenceMenuIcons[name] }} />;
  if (name === "higgsfield")
    return <HiggsSnake className="h-[21px] w-[21px]" />;
  const Icon =
    name && name in menuIcons
      ? menuIcons[name as keyof typeof menuIcons]
      : Sparkles;
  return <Icon aria-hidden="true" size={21} strokeWidth={1.8} />;
}
function Logo({ compact }: { compact: boolean }) {
  return (
    <span
      className={`grid place-items-center bg-[#f5f5f5] text-[#0b0c0e] transition-all duration-300 ${
        compact ? "h-7 w-7 rounded-[8px]" : "h-9 w-9 rounded-[10px]"
      }`}
      aria-hidden="true"
    >
      <HiggsSnake className={compact ? "h-5 w-5" : "h-6 w-6"} />
    </span>
  );
}

/** Mirrors the URL query into Header state; isolated so only this node suspends. */
function SearchSync({ onChange }: { onChange: (query: string) => void }) {
  const query = useSearchParams().toString();
  useEffect(() => onChange(query), [query, onChange]);
  return null;
}

export function Header({ forceCompact = false, studioHeight = false }: { forceCompact?: boolean; studioHeight?: boolean }) {
  const d = useAppDispatch();
  const { openMenu, drawer } = useAppSelector((s) => s.ui);
  const [scrolled, setScrolled] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const closeAuth = useCallback(() => setAuthMode(null), []);
  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const nav = data.nav as NavItem[];
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  // Compute active nav item dynamically from the current pathname
  const navigation = nav.map((item) => ({
    item,
    groups: getMenuGroups(item),
    // '/' only matches the root; other hrefs match if pathname starts with them
    isActive:
      item.href.includes("?")
        ? item.label === "Genjutsu" && pathname.startsWith(item.href.split("?")[0]) &&
          Array.from(new URLSearchParams(item.href.split("?")[1]).entries()).every(([k, v]) => new URLSearchParams(query).get(k) === v)
        : item.label === "Explore"
        ? pathname === "/"
        : item.label === "Image"
          ? pathname.startsWith("/ai/image")
          : pathname.startsWith(item.href.split("?")[0]),
  }));
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>("[data-nav-active=true]");
    if (!nav || !active) return;
    const right = active.offsetLeft + active.offsetWidth - nav.clientWidth;
    if (right > nav.scrollLeft) nav.scrollLeft = right + 24;
  }, [pathname]);
  useEffect(() => {
    const f = () => {
      const headerTop = headerRef.current?.getBoundingClientRect().top ?? 0;
      setScrolled(window.scrollY > 8 && headerTop <= 0);
    };
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    const menu = drawerRef.current;
    if (!drawer || !menu) return;
    const previousOverflow = document.body.style.overflow;
    const fit = () => {
      const mobile = window.innerWidth < 1024;
      document.body.style.overflow = mobile ? "hidden" : previousOverflow;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      menu.style.maxHeight = `${Math.max(0, viewportHeight - menu.getBoundingClientRect().top)}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", fit);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("resize", fit);
    };
  }, [drawer]);
  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-[70] w-full bg-[#0d0f10]/95 backdrop-blur-xl transition-all duration-300 max-[767px]:bg-black/[0.65] max-[767px]:backdrop-blur-2xl ${studioHeight ? "" : "border-b border-[#242628]"}`}
      onMouseLeave={() => d(setMenu(null))}
    >
      <Suspense fallback={null}><SearchSync onChange={setQuery} /></Suspense>
      <div className="mx-auto w-full max-w-[1920px]">
        <div
          className={`flex items-center gap-2 px-3 transition-all duration-300 md:px-5 ${studioHeight ? "h-11" : scrolled || forceCompact ? "h-9" : "h-[52px]"}`}
        >
          <Link
            href={data.mcpSection.href}
            aria-label="Higgsfield MCP for ChatGPT"
            className="flex shrink-0 items-center gap-2 hover:text-lime"
          >
            <Logo compact={scrolled || forceCompact} />
            <span className="font-grotesk text-sm font-semibold lg:hidden">
              Higgsfield
            </span>
          </Link>
          <nav
            ref={navRef}
            onWheel={(e) => {
              if (e.deltaY && !e.deltaX) e.currentTarget.scrollLeft += e.deltaY;
            }}
            className="[&::-webkit-scrollbar]:hidden [scrollbar-width:none] hidden min-w-0 flex-1 items-center overflow-x-auto whitespace-nowrap lg:flex"
          >
            {navigation.map(({ item: n, groups, isActive }) => (
              <div
                key={n.label}
                onMouseEnter={() => d(setMenu(groups.length ? n.label : null))}
              >
                <Link
                  href={n.href}
                  data-nav-active={isActive}
                  onFocus={() => groups.length && d(setMenu(n.label))}
                  className={`relative inline-flex items-center gap-1 rounded-lg font-semibold leading-none transition duration-200 hover:bg-[#202224] hover:text-[#dfe1e3] ${studioHeight ? "px-[0.38rem] py-[0.4rem] text-[12px]" : "px-[0.62rem] py-[0.45rem] text-sm"} ${
                    isActive ? "text-lime" : "text-[#777b80]"
                  }`}
                >
                  <span
                    className={
                      n.label === "ChatGPT Plugin"
                        ? `${navShineClasses} [--shine-base:#777b80] [--shine-highlight:#ffffff]`
                        : n.label === "Contests"
                          ? `${navShineClasses} [--shine-base:#b99b52] [--shine-highlight:#f4d98d]`
                          : ""
                    }
                  >
                    {n.label}
                  </span>
                  {n.badge && (
                    <span className="inline-flex items-center justify-center rounded-[0.35rem] bg-[#202512] px-[0.36rem] py-[0.16rem] text-[9px] font-semibold leading-none text-lime">
                      {n.badge}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <Link
              href="/pricing"
              className="pricing-link relative hidden h-9 items-center gap-2 rounded-xl border border-[#2c2f31] bg-[#1c1f21] px-3 text-sm font-semibold hover:bg-[#292c2f] sm:flex"
            >
              <Diamond size={15} />
              Pricing
              <span
                className={`absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#fe1678] px-1.5 py-px text-[9px] font-extrabold leading-none text-white ${
                  scrolled ? "top-[27px]" : "top-[30px]"
                }`}
              >
                {data.header?.pricingDiscount || "30% OFF"}
              </span>
            </Link>
            <Link
              href="/enterprise"
              className="hidden h-9 items-center gap-2 rounded-xl border border-[#2c2f31] bg-[#1c1f21] px-3 text-sm font-semibold text-[#e5e7e8] hover:bg-[#292c2f] md:flex"
            >
              <Sparkles size={15} />
              Enterprise
            </Link>
            <div className="relative hidden sm:block">
              <button
                aria-label="Language"
                onClick={() => d(setMenu(openMenu === "lang" ? null : "lang"))}
                className="grid h-9 w-9 place-items-center rounded-xl border border-[#2c2f31] bg-[#1c1f21] hover:bg-[#292c2f]"
              >
                <Globe size={17} />
              </button>
              {openMenu === "lang" && (
                <div className="absolute right-0 top-11 w-36 rounded-xl border border-[#303235] bg-[#1b1d1f] p-1 text-sm shadow-2xl">
                  {(
                    data.header?.languages || [
                      "English",
                      "EspaÃ±ol",
                      "FranÃ§ais",
                      "Deutsch",
                      "æ—¥æœ¬èªž",
                    ]
                  ).map((l) => (
                    <button
                      key={l}
                      onClick={() => d(closeAll())}
                      className="block w-full rounded-lg px-3 py-2 text-left text-zinc-300 hover:bg-white/10"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className="hidden h-8 items-center rounded-xl bg-[#202512] px-3 text-[13px] font-semibold text-lime hover:bg-[#303a10] md:flex"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className={`flex items-center rounded-xl bg-lime font-semibold text-black hover:brightness-110 ${
                scrolled || forceCompact ? "h-7 px-2.5 text-[12px]" : "h-8 px-3 text-[13px]"
              }`}
            >
              Sign up
            </button>

            <button
              className="rounded-lg p-1.5 lg:hidden"
              aria-label="Menu"
              aria-expanded={drawer}
              aria-controls="mobile-navigation"
              onClick={() => d(toggleDrawer())}
            >
              {drawer ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      {navigation
        .filter(({ item, groups }) => openMenu === item.label && groups.length)
        .map(({ item: n, groups }) => (
          <div
            key={n.label}
            onMouseEnter={() => d(setMenu(n.label))}
            style={{ "--dropdown-width": n.label === "MCP" ? "356px" : n.label === "Video" ? "913px" : n.label === "Audio" ? "925px" : "894px" } as React.CSSProperties}
            className={`hide-scrollbar absolute left-3 right-3 top-full hidden max-h-[min(82vh,850px)] overflow-y-auto border border-[#2b2d2f] bg-[#1b1d1f] shadow-2xl lg:block lg:left-5 lg:right-auto ${isReferenceMenu(n.label) ? "rounded-[22px] p-3 lg:w-[min(var(--dropdown-width),calc(100vw-40px))]" : "rounded-[26px] p-5 lg:w-[min(1120px,calc(100vw-48px))] lg:p-6"}`}
          >
            <div className={`grid ${n.label === "MCP" ? "grid-cols-1" : "md:grid-cols-2"} ${isReferenceMenu(n.label) ? "gap-2" : "gap-7 md:gap-9"}`}>
              {groups.map((group) => (
                <section key={group.title} aria-label={group.title}>
                  <h2 className="mb-2 px-1 text-sm font-medium text-[#85898e]">
                    {group.title}
                  </h2>
                  <div className={isReferenceMenu(n.label) ? "grid gap-0.5" : "grid gap-1"}>
                    {group.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => d(closeAll())}
                        className={`group/menuitem flex items-center gap-3 rounded-xl transition-colors hover:bg-[#24272a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime ${isReferenceMenu(n.label) ? "min-h-[64px] px-2 py-1.5" : "min-h-[68px] px-1.5 py-1.5"}`}
                      >
                        <span className={`relative grid shrink-0 place-items-center bg-[#24272a] text-zinc-100 group-hover/menuitem:bg-[#2c2f32] ${isReferenceMenu(n.label) ? "h-12 w-12 rounded-xl" : "h-[60px] w-[60px] rounded-2xl"}`}>
                          <MenuGlyph name={item.icon} />
                          {isReferenceMenu(n.label) && item.badge && <span className={`absolute -top-2 left-1/2 -translate-x-1/2 -skew-x-12 rounded-sm px-1.5 font-grotesk text-xs font-bold uppercase text-white ${item.badge === "new" ? "bg-[#bfef00] !text-black" : "bg-[#fe1678]"}`}>{item.badge}</span>}
                        </span>
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-[#e8e9eb]">
                            {item.label}
                            {item.badge && !isReferenceMenu(n.label) && (
                              <span className="rounded-md bg-[#202512] px-1.5 py-0.5 text-[10px] font-semibold italic leading-none text-lime">
                                {item.badge.toUpperCase()}
                              </span>
                            )}
                          </span>
                          {item.description && (
                            <span className="mt-1 block text-sm leading-5 text-[#85898e]">
                              {item.description}
                            </span>
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        ))}
      {drawer && (
        <nav ref={drawerRef} id="mobile-navigation" aria-label="Mobile navigation" className="hide-scrollbar w-full min-w-0 max-w-full overflow-x-hidden overflow-y-auto overscroll-y-contain border-t border-[#292b2d] bg-[#141617] p-4 lg:hidden max-[767px]:bg-black/60 max-[767px]:backdrop-blur-2xl">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1">
            {navigation.map(({ item: n, groups }) => {
              const expanded = openMenu === n.label;
              return (
                <div key={n.label} className="min-w-0 rounded-xl">
                  {groups.length ? (
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => d(setMenu(expanded ? null : n.label))}
                      className="flex w-full min-w-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-200 hover:bg-white/10"
                    >
                      {n.label}
                      {expanded ? <ChevronUp aria-hidden="true" className="size-5 shrink-0 text-zinc-500" /> : <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-zinc-500" />}
                    </button>
                  ) : (
                    <Link
                      href={n.href}
                      onClick={() => d(closeAll())}
                      className="block rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/10"
                    >
                      {n.label}
                    </Link>
                  )}
                  {groups.length > 0 && expanded && (
                    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 px-2 pb-3">
                      {groups.map((group) => (
                        <section key={group.title} className="min-w-0">
                          <h3 className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            {group.title}
                          </h3>
                          {group.items.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => d(closeAll())}
                              className="flex w-full min-w-0 items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/10"
                            >
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#24272a] text-zinc-100">
                                <MenuGlyph name={item.icon} />
                              </span>
                              <span className="min-w-0 flex-1 whitespace-normal break-words">
                                <span className="block text-sm text-zinc-200">
                                  {item.label}
                                </span>
                                <span className="block text-xs text-zinc-500">
                                  {item.description}
                                </span>
                              </span>
                            </Link>
                          ))}
                        </section>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </nav>
      )}

      {authMode && (
        <AuthDialog
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={closeAuth}
        />
      )}
    </header>
  );
}



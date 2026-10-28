"use client";
import { soulExamples } from "@/data/imageStudio";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AspectMenu,
  ControlsBar,
  GenerateButton,
  ModelPicker,
  MoodboardButton,
  QualityMenu,
} from "./composer";
import {
  CREDITS_PER_IMAGE,
  aspects,
  models,
  moodboardPresets,
  shineCss,
  type MenuName,
} from "./data";
import {
  CharacterPanel,
  MoodboardPanel,
  ReferenceUploadDialog,
  SafeImage,
} from "./panels";

function usePresence(open: boolean, ms = 200) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      );
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), ms);
    return () => clearTimeout(t);
  }, [open, ms]);
  return { mounted, visible };
}

function HeroSection() {
  return (
    <section className="soul-hero px-4">
      <div className="soul-showcase">
        {soulExamples.slice(0, 3).map((src, i) => (
          <SafeImage
            key={src}
            src={src}
            alt={`Soul example ${i + 1}`}
            className={`soul-tile ${i === 0 ? "soul-tile-first" : ""}`}
          />
        ))}
        <img
          src="/higgsfield-assets/soul2-wordmark.svg"
          alt="SOUL2"
          className="soul-wordmark"
        />
        {soulExamples.slice(3).map((src, i) => (
          <SafeImage
            key={src}
            src={src}
            alt={`Soul example ${i + 4}`}
            className={`soul-tile ${i === 2 ? "soul-tile-last" : ""}`}
          />
        ))}
      </div>
      <p className="mt-10 text-center text-[20px] font-semibold leading-7 text-[#9a9ea3]">
        Designed for creative, fashion-forward visuals with
        <br />
        built-in cultural fluency.
      </p>
      <Link
        href="/soul-intro"
        className="mt-10 rounded-xl border border-white/10 px-5 py-3 text-base font-semibold"
      >
        Learn about Soul 2.0
      </Link>
    </section>
  );
}

export function ImageStudio() {
  const pageRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(1);
  const [notice, setNotice] = useState("");
  const [characterOpen, setCharacterOpen] = useState(false);
  const [moodboardOpen, setMoodboardOpen] = useState(false);
  const [uploadDialog, setUploadDialog] = useState<"character" | "moodboard" | null>(null);
  const [preset, setPreset] = useState(moodboardPresets[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [modelId, setModelId] = useState("soul-2");
  const [modelQuery, setModelQuery] = useState("");
  const [aspect, setAspect] = useState("3:4");
  const [quality, setQuality] = useState("2k");
  const [enhance, setEnhance] = useState(false);
  const [menu, setMenu] = useState<MenuName | null>(null);
  const [menuPos, setMenuPos] = useState({ left: 0, bottom: 0 });
  const [advanced, setAdvanced] = useState(false);
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [viewLayout, setViewLayout] = useState<"square" | "masonry">("masonry");
  const [splitByDate, setSplitByDate] = useState(false);
  const [cardSize, setCardSize] = useState(3);

  useEffect(() => {
    const fit = () => {
      const page = pageRef.current;
      if (page) page.style.setProperty("--image-studio-top", `${page.getBoundingClientRect().top}px`);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(document.body);
    window.addEventListener("resize", fit);
    return () => { observer.disconnect(); window.removeEventListener("resize", fit); };
  }, []);

  const charP = usePresence(characterOpen);
  const moodP = usePresence(moodboardOpen);
  const selectedModel = models.find((m) => m.id === modelId) ?? models[0];
  const selectedAspect = aspects.find((a) => a.id === aspect) ?? aspects[1];
  const cost = parseFloat((count * CREDITS_PER_IMAGE).toFixed(3));

  const openMenu = (name: MenuName, el: HTMLElement) => {
    if (menu === name) return setMenu(null);
    const f = formRef.current?.getBoundingClientRect();
    if (!f) return;
    const b = el.getBoundingClientRect();
    // the form has a transform, so absolute children position relative to it
    setMenuPos({ left: b.left - f.left - 1, bottom: f.bottom - b.top + 5 });
    setModelOpen(false);
    setMenu(name);
  };
  const toggleModel = () => {
    setMenu(null);
    setModelOpen((v) => !v);
  };
  const toggleCharacter = () => {
    setMoodboardOpen(false);
    setCharacterOpen((v) => !v);
  };
  const toggleMoodboard = () => {
    setCharacterOpen(false);
    setMoodboardOpen((v) => !v);
  };
  const toggleAdvanced = () => {
    setMenu(null);
    setAdvanced((v) => !v);
  };

  return (
    <main ref={pageRef} className="soul-page-shell relative overflow-hidden bg-[#0f1113] text-white">
      <style>{shineCss}</style>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" />

      {/* View dropdown overlay */}
      {viewDropdownOpen && (
        <div
          className="fixed inset-0 z-[49]"
          onClick={() => setViewDropdownOpen(false)}
          aria-hidden
        />
      )}

      {/* View button + dropdown */}
      <div className="soul-view-wrap absolute right-4 top-3 z-50">
        <button
          onClick={() => setViewDropdownOpen((v) => !v)}
          className="flex h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-base font-semibold"
        >
          <span className="grid grid-cols-2 gap-0.5">
            {[1, 2, 3, 4].map((n) => (
              <i key={n} className="size-1.5 rounded-[1px] border border-current" />
            ))}
          </span>
          View
        </button>

        {viewDropdownOpen && (
          <div
            style={{ width: 188 }}
            className="fixed right-4 top-[56px] rounded-xl border border-white/10 bg-[#1b1c1e] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-[50]"
          >
            <div className="flex w-full flex-col items-start gap-0.5">
              {/* Square */}
              <button
                type="button"
                onClick={() => setViewLayout("square")}
                className="flex min-h-9 w-full min-w-0 items-center gap-2 rounded-lg p-2 text-left text-white transition-[background-color,transform] active:scale-95 hover:bg-white/5"
              >
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-white/70">
                  <path d="M4.29601 20.141L4.6365 19.4727L4.6365 19.4727L4.29601 20.141ZM3.85899 19.704L3.19074 20.0445L3.19074 20.0445L3.85899 19.704ZM20.141 19.704L19.4728 19.3635H19.4728L20.141 19.704ZM19.704 20.141L19.3635 19.4727V19.4727L19.704 20.141ZM20.141 4.29601L19.4728 4.6365L19.4728 4.6365L20.141 4.29601ZM19.704 3.85899L20.0445 3.19074L20.0445 3.19074L19.704 3.85899ZM3.85899 4.29601L3.19074 3.95552L3.19074 3.95552L3.85899 4.29601ZM4.29601 3.85899L3.95552 3.19074L3.95552 3.19074L4.29601 3.85899ZM19.5 5.35V18.65H21V5.35H19.5ZM18.65 19.5H5.35V21H18.65V19.5ZM4.5 18.65V5.35H3V18.65H4.5ZM5.35 4.5H18.65V3H5.35V4.5ZM5.35 19.5C5.0576 19.5 4.8834 19.4994 4.75428 19.4889C4.6339 19.479 4.62011 19.4644 4.6365 19.4727L3.95552 20.8093C4.18582 20.9266 4.419 20.9665 4.63213 20.9839C4.83651 21.0006 5.08235 21 5.35 21V19.5ZM3 18.65C3 18.9176 2.99942 19.1635 3.01612 19.3679C3.03353 19.581 3.07339 19.8142 3.19074 20.0445L4.52725 19.3635C4.5356 19.3799 4.52097 19.3661 4.51113 19.2457C4.50058 19.1166 4.5 18.9424 4.5 18.65H3ZM4.6365 19.4727C4.58946 19.4488 4.55122 19.4105 4.52725 19.3635L3.19074 20.0445C3.35852 20.3738 3.62623 20.6415 3.95552 20.8093L4.6365 19.4727ZM19.5 18.65C19.5 18.9424 19.4994 19.1166 19.4889 19.2457C19.479 19.3661 19.4644 19.3799 19.4728 19.3635L20.8093 20.0445C20.9266 19.8142 20.9665 19.581 20.9839 19.3679C21.0006 19.1635 21 18.9176 21 18.65H19.5ZM18.65 21C18.9177 21 19.1635 21.0006 19.3679 20.9839C19.581 20.9665 19.8142 20.9266 20.0445 20.8093L19.3635 19.4727C19.3799 19.4644 19.3661 19.479 19.2457 19.4889C19.1166 19.4994 18.9424 19.5 18.65 19.5V21ZM19.4728 19.3635C19.4488 19.4105 19.4105 19.4488 19.3635 19.4727L20.0445 20.8093C20.3738 20.6415 20.6415 20.3738 20.8093 20.0445L19.4728 19.3635ZM21 5.35C21 5.08235 21.0006 4.83651 20.9839 4.63213C20.9665 4.419 20.9266 4.18582 20.8093 3.95552L19.4728 4.6365C19.4644 4.62011 19.479 4.6339 19.4889 4.75428C19.4994 4.8834 19.5 5.0576 19.5 5.35H21ZM18.65 4.5C18.9424 4.5 19.1166 4.50058 19.2457 4.51113C19.3661 4.52097 19.3799 4.5356 19.3635 4.52725L20.0445 3.19074C19.8142 3.07339 19.581 3.03353 19.3679 3.01612C19.1635 2.99942 18.9177 3 18.65 3V4.5ZM20.8093 3.95552C20.6415 3.62623 20.3738 3.35852 20.0445 3.19074L19.3635 4.52725C19.4105 4.55122 19.4488 4.58946 19.4728 4.6365L20.8093 3.95552ZM4.5 5.35C4.5 5.0576 4.50058 4.8834 4.51113 4.75428C4.52097 4.6339 4.5356 4.62011 4.52725 4.6365L3.19074 3.95552C3.07339 4.18582 3.03353 4.419 3.01612 4.63213C2.99942 4.83651 3 5.08235 3 5.35H4.5ZM5.35 3C5.08235 3 4.83651 2.99942 4.63213 3.01612C4.419 3.03353 4.18582 3.07339 3.95552 3.19074L4.6365 4.52725C4.62011 4.5356 4.6339 4.52097 4.75428 4.51113C4.8834 4.50058 5.0576 4.5 5.35 4.5V3ZM4.52725 4.6365C4.55122 4.58946 4.58946 4.55122 4.6365 4.52725L3.95552 3.19074C3.62623 3.35852 3.35852 3.62623 3.19074 3.95552L4.52725 4.6365Z" fill="currentColor" />
                  <path d="M3.75 12H20.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                  <path d="M12.75 3.75V3H11.25V3.75H12.75ZM11.25 20.25V21H12.75V20.25H11.25ZM11.25 3.75V12H12.75V3.75H11.25ZM11.25 12V20.25H12.75V12H11.25Z" fill="currentColor" />
                </svg>
                <span className="min-w-0 flex-1 truncate text-sm font-medium leading-5">Square</span>
                {viewLayout === "square" && (
                  <svg className="shrink-0 text-[#6c8cff]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.7406 7.1827C18.0539 7.45363 18.0882 7.92725 17.8173 8.24057L10.4673 16.7406C10.3305 16.8988 10.1339 16.9926 9.92494 16.9996C9.71594 17.0066 9.51353 16.9259 9.36654 16.7772L6.21654 13.5897C5.92539 13.2951 5.9282 12.8202 6.22282 12.5291C6.51744 12.2379 6.9923 12.2407 7.28346 12.5353L9.86327 15.1458L16.6827 7.25945C16.9536 6.94613 17.4272 6.91177 17.7406 7.1827Z" fill="currentColor" />
                  </svg>
                )}
              </button>

              {/* Masonry */}
              <button
                type="button"
                onClick={() => setViewLayout("masonry")}
                className="flex min-h-9 w-full min-w-0 items-center gap-2 rounded-lg p-2 text-left text-white transition-[background-color,transform] active:scale-95 hover:bg-white/5"
              >
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-white/70">
                  <path d="M4.29601 20.141L4.6365 19.4727L4.6365 19.4727L4.29601 20.141ZM3.85899 19.704L3.19074 20.0445L3.19074 20.0445L3.85899 19.704ZM20.141 19.704L19.4728 19.3635H19.4728L20.141 19.704ZM19.704 20.141L19.3635 19.4727V19.4727L19.704 20.141ZM20.141 4.29601L19.4728 4.6365L19.4728 4.6365L20.141 4.29601ZM19.704 3.85899L20.0445 3.19074L20.0445 3.19074L19.704 3.85899ZM3.85899 4.29601L3.19074 3.95552L3.19074 3.95552L3.85899 4.29601ZM4.29601 3.85899L3.95552 3.19074L3.95552 3.19074L4.29601 3.85899ZM19.5 5.35V18.65H21V5.35H19.5ZM18.65 19.5H5.35V21H18.65V19.5ZM4.5 18.65V5.35H3V18.65H4.5ZM5.35 4.5H18.65V3H5.35V4.5ZM5.35 19.5C5.0576 19.5 4.8834 19.4994 4.75428 19.4889C4.6339 19.479 4.62011 19.4644 4.6365 19.4727L3.95552 20.8093C4.18582 20.9266 4.419 20.9665 4.63213 20.9839C4.83651 21.0006 5.08235 21 5.35 21V19.5ZM3 18.65C3 18.9176 2.99942 19.1635 3.01612 19.3679C3.03353 19.581 3.07339 19.8142 3.19074 20.0445L4.52725 19.3635C4.5356 19.3799 4.52097 19.3661 4.51113 19.2457C4.50058 19.1166 4.5 18.9424 4.5 18.65H3ZM4.6365 19.4727C4.58946 19.4488 4.55122 19.4105 4.52725 19.3635L3.19074 20.0445C3.35852 20.3738 3.62623 20.6415 3.95552 20.8093L4.6365 19.4727ZM19.5 18.65C19.5 18.9424 19.4994 19.1166 19.4889 19.2457C19.479 19.3661 19.4644 19.3799 19.4728 19.3635L20.8093 20.0445C20.9266 19.8142 20.9665 19.581 20.9839 19.3679C21.0006 19.1635 21 18.9176 21 18.65H19.5ZM18.65 21C18.9177 21 19.1635 21.0006 19.3679 20.9839C19.581 20.9665 19.8142 20.9266 20.0445 20.8093L19.3635 19.4727C19.3799 19.4644 19.3661 19.479 19.2457 19.4889C19.1166 19.4994 18.9424 19.5 18.65 19.5V21ZM19.4728 19.3635C19.4488 19.4105 19.4105 19.4488 19.3635 19.4727L20.0445 20.8093C20.3738 20.6415 20.6415 20.3738 20.8093 20.0445L19.4728 19.3635ZM21 5.35C21 5.08235 21.0006 4.83651 20.9839 4.63213C20.9665 4.419 20.9266 4.18582 20.8093 3.95552L19.4728 4.6365C19.4644 4.62011 19.479 4.6339 19.4889 4.75428C19.4994 4.8834 19.5 5.0576 19.5 5.35H21ZM18.65 4.5C18.9424 4.5 19.1166 4.50058 19.2457 4.51113C19.3661 4.52097 19.3799 4.5356 19.3635 4.52725L20.0445 3.19074C19.8142 3.07339 19.581 3.03353 19.3679 3.01612C19.1635 2.99942 18.9177 3 18.65 3V4.5ZM20.8093 3.95552C20.6415 3.62623 20.3738 3.35852 20.0445 3.19074L19.3635 4.52725C19.4105 4.55122 19.4488 4.58946 19.4728 4.6365L20.8093 3.95552ZM4.5 5.35C4.5 5.0576 4.50058 4.8834 4.51113 4.75428C4.52097 4.6339 4.5356 4.62011 4.52725 4.6365L3.19074 3.95552C3.07339 4.18582 3.03353 4.419 3.01612 4.63213C2.99942 4.83651 3 5.08235 3 5.35H4.5ZM5.35 3C5.08235 3 4.83651 2.99942 4.63213 3.01612C4.419 3.03353 4.18582 3.07339 3.95552 3.19074L4.6365 4.52725C4.62011 4.5356 4.6339 4.52097 4.75428 4.51113C4.8834 4.50058 5.0576 4.5 5.35 4.5V3ZM4.52725 4.6365C4.55122 4.58946 4.58946 4.55122 4.6365 4.52725L3.95552 3.19074C3.62623 3.35852 3.35852 3.62623 3.19074 3.95552L4.52725 4.6365Z" fill="currentColor" />
                  <path d="M12 13.5H11.25V15H12V13.5ZM20.25 15H21V13.5H20.25V15ZM12 15H20.25V13.5H12V15Z" fill="currentColor" />
                  <path d="M12 10.5H12.75V9H12V10.5ZM3.75 9H3V10.5H3.75V9ZM12 9H3.75V10.5H12V9Z" fill="currentColor" />
                  <path d="M11.25 20.25V21H12.75V20.25H11.25ZM12.75 3.75V3H11.25V3.75H12.75ZM11.25 3.75V20.25H12.75V3.75H11.25Z" fill="currentColor" />
                </svg>
                <span className="min-w-0 flex-1 truncate text-sm font-medium leading-5">Masonry</span>
                {viewLayout === "masonry" && (
                  <svg className="shrink-0 text-[#6c8cff]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.7406 7.1827C18.0539 7.45363 18.0882 7.92725 17.8173 8.24057L10.4673 16.7406C10.3305 16.8988 10.1339 16.9926 9.92494 16.9996C9.71594 17.0066 9.51353 16.9259 9.36654 16.7772L6.21654 13.5897C5.92539 13.2951 5.9282 12.8202 6.22282 12.5291C6.51744 12.2379 6.9923 12.2407 7.28346 12.5353L9.86327 15.1458L16.6827 7.25945C16.9536 6.94613 17.4272 6.91177 17.7406 7.1827Z" fill="currentColor" />
                  </svg>
                )}
              </button>

              {/* Separator */}
              <div className="my-0.5 h-px w-full bg-white/10" />

              {/* Split by date */}
              <button
                type="button"
                role="switch"
                aria-checked={splitByDate}
                onClick={() => setSplitByDate((v) => !v)}
                className="flex min-h-9 w-full min-w-0 items-center gap-2 rounded-lg p-2 text-left text-white transition-[background-color,transform] hover:bg-white/5 active:scale-95"
              >
                <span className="min-w-0 flex-1 truncate text-sm font-medium leading-5">Split by date</span>
                <span
                  aria-hidden="true"
                  className="relative flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition-colors"
                  style={{ backgroundColor: splitByDate ? "#6c8cff" : "rgba(255,255,255,0.15)" }}
                >
                  <span
                    className="size-3 rounded-full bg-white shadow-[0_1px_2px_rgba(20,21,26,0.05)] transition-transform"
                    style={{ transform: splitByDate ? "translateX(12px)" : "translateX(0px)" }}
                  />
                </span>
              </button>

              {/* Separator */}
              <div className="my-0.5 h-px w-full bg-white/10" />

              {/* Card size label */}
              <div className="flex w-full items-center p-2">
                <span className="text-xs font-medium leading-4 text-white/50">Card size</span>
              </div>

              {/* Card size slider */}
              <div className="flex w-full min-w-0 items-center gap-1 p-1">
                <div className="w-full min-w-0 flex-1 p-0">
                  <div className="relative flex h-8 w-full cursor-pointer items-center overflow-hidden rounded-lg bg-white/5">
                    {/* fill track */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-l-lg bg-white/10 transition-all"
                      style={{ width: `${(cardSize / 4) * 100}%` }}
                    />
                    {/* tick marks */}
                    {[25, 50, 75].map((pct) => (
                      <div
                        key={pct}
                        className="absolute top-1/2 h-1.5 w-px -translate-y-1/2 bg-white/40"
                        style={{ left: `${pct}%` }}
                      />
                    ))}
                    <input
                      type="range"
                      min={0}
                      max={4}
                      step={1}
                      value={cardSize}
                      onChange={(e) => setCardSize(Number(e.target.value))}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <HeroSection />

      {(modelOpen || menu) && (
        <div
          className="fixed inset-0 z-[35]"
          onClick={() => {
            setModelOpen(false);
            setMenu(null);
          }}
          aria-hidden
        />
      )}

      <form
        ref={formRef}
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 22,
          width: "min(880px, calc(100vw - 32px))",
          height: 124,
          boxSizing: "border-box",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          setNotice("Demo only — generation backend is not connected.");
        }}
        className="soul-form fixed z-40 rounded-[20px] border border-[#2a2c2f] bg-[#1b1c1e] p-2.5 shadow-[0_24px_80px_#000]"
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the scene you imagine"
          aria-label="Prompt"
          className="soul-f-text mt-1 h-10 w-[calc(100%-368px)] resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-[#77797c]"
        />

        <ControlsBar
          selectedModel={selectedModel}
          modelOpen={modelOpen}
          onToggleModel={toggleModel}
          aspect={selectedAspect}
          quality={quality}
          menu={menu}
          onOpenMenu={openMenu}
          enhance={enhance}
          onToggleEnhance={() => setEnhance((v) => !v)}
          count={count}
          onCountChange={setCount}
          advanced={advanced}
          onToggleAdvanced={toggleAdvanced}
          onCharacterClick={toggleCharacter}
          characterActive={characterOpen}
        />

        {modelOpen && (
          <ModelPicker
            selectedId={modelId}
            query={modelQuery}
            onQueryChange={setModelQuery}
            onSelect={(id) => {
              setModelId(id);
              setModelOpen(false);
              setModelQuery("");
            }}
          />
        )}

        {menu === "aspect" && (
          <AspectMenu
            value={aspect}
            pos={menuPos}
            onSelect={(id) => {
              setAspect(id);
              setMenu(null);
            }}
          />
        )}

        {menu === "quality" && (
          <QualityMenu
            value={quality}
            pos={menuPos}
            onSelect={(id) => {
              setQuality(id);
              setMenu(null);
            }}
          />
        )}

        <MoodboardButton preset={preset} onClick={toggleMoodboard} />
        <GenerateButton cost={cost} />

        {notice && (
          <p
            role="status"
            className="absolute bottom-full right-0 mb-2 rounded-lg bg-black/80 px-3 py-2 text-xs text-zinc-300"
          >
            {notice}
          </p>
        )}
      </form>

      {charP.mounted && (
        <CharacterPanel
          visible={charP.visible}
          onClose={() => setCharacterOpen(false)}
          onCreate={() => setUploadDialog("character")}
        />
      )}

      {moodP.mounted && (
        <MoodboardPanel
          visible={moodP.visible}
          onClose={() => setMoodboardOpen(false)}
          onBuild={() => setUploadDialog("moodboard")}
          onSelectPreset={(item) => {
            setPreset(item);
            setMoodboardOpen(false);
          }}
        />
      )}

      {uploadDialog && (
        <ReferenceUploadDialog
          kind={uploadDialog}
          onCancel={() => setUploadDialog(null)}
        />
      )}
    </main>
  );
}



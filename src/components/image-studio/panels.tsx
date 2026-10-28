import { soulExamples } from "@/data/imageStudio";
import {
  Check,
  Search,
  X
} from "lucide-react";
import { useRef, useState } from "react";
import {
  fade,
  moodboardPresets,
  panelClass,
  panelStyle,
  type Preset
} from "./data";
import { CharacterCollage, MoodboardCollage } from "./panels/collages";
import { PanelCloseButton, RevealCard, SafeImage } from "./panels/shared";
export { CharacterCollage, MoodboardCollage } from "./panels/collages";
export { ReferenceUploadDialog, characterBad, characterGood } from "./panels/reference-upload-dialog";
export { PanelCloseButton, RevealCard, SafeImage } from "./panels/shared";

export function CharacterPanel({
  visible,
  onClose,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  onCreate: () => void;
}) {
  const [activeTab, setActiveTab] = useState("Soul 2.0");

  return (
    <section
      style={{ ...panelStyle, ...fade(visible) }}
      className={panelClass}
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-panel-title"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 z-20 grid size-8 place-items-center rounded-full bg-[#2b2d2f]"
        aria-label="Close character panel"
      >
        <X size={18} className="text-zinc-300" />
      </button>

      <div className="soul-panel-head relative h-[216px] px-8 pt-8">
        <h2 id="character-panel-title" className="font-grotesk text-[28px] font-extrabold uppercase leading-[34px] tracking-[-0.04em]">
          MAKE YOUR OWN CHARACTER
        </h2>
        <p className="mt-2.5 max-w-[440px] text-sm leading-5 text-[#8b8e92]">
          Upload photos from multiple angles to train your character. Then{" "}
          <br />
          use the same consistent character across new images and{" "}
          <br />
          videos.
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="mt-6 h-11 rounded-[10px] bg-[#d1fe17] px-6 text-sm font-bold text-black shadow-[0_3px_0_#8ba513]"
        >
          Create character <span aria-hidden>✦</span>
        </button>

        {/* Fan of 4 overlapping tilted photos - hidden below lg */}
        <div className="hidden lg:block absolute inset-y-0 right-0 w-[400px] pointer-events-none">
          <CharacterCollage className="w-full h-full" animated={false} />
        </div>
      </div>

      <div className="soul-char-body relative h-[324px] overflow-hidden rounded-t-[18px] bg-[#232526] border-t border-[#303234]">
        <div className="soul-tabs flex items-center gap-2 border-b border-[#303234] px-4 py-3">
          <button
            type="button"
            onClick={() => setActiveTab("All")}
            className={`h-8 rounded-xl px-3 text-xs font-semibold ${activeTab === "All" ? "bg-[#3b3d3f] text-white" : "text-zinc-500 hover:text-white"}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Soul")}
            className={`h-8 rounded-xl px-3 text-xs font-semibold ${activeTab === "Soul" ? "bg-[#3b3d3f] text-white" : "text-zinc-500 hover:text-white"}`}
          >
            Soul
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Soul 2.0")}
            className={`h-8 rounded-xl px-3 text-xs font-semibold ${activeTab === "Soul 2.0" ? "bg-[#3b3d3f] text-white" : "text-zinc-500 hover:text-white"}`}
          >
            Soul 2.0
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Soul Cinema")}
            className={`h-8 rounded-xl px-3 text-xs font-semibold ${activeTab === "Soul Cinema" ? "bg-[#3b3d3f] text-white" : "text-zinc-500 hover:text-white"}`}
          >
            Soul Cinema
          </button>
          <label className="soul-search ml-auto flex h-10 w-[205px] items-center gap-2 rounded-xl bg-[#303234] px-3">
            <Search size={14} className="text-zinc-500" />
            <input
              placeholder="Search..."
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-zinc-500"
            />
          </label>
        </div>
        <div className="flex h-full items-center justify-center px-4">
          <p className="text-center text-base font-semibold text-[#c8cacd]">
            No characters yet. Create your first one!
          </p>
        </div>
      </div>
    </section>
  );
}

export const STUCK_AT = 209;

export function MoodboardPanel({
  visible,
  onClose,
  onSelectPreset,
  onBuild,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectPreset: (preset: Preset) => void;
  onBuild: () => void;
}) {
  const [presetQuery, setPresetQuery] = useState("");
  const [stuck, setStuck] = useState(false); // tabs reached the top
  const [showBar, setShowBar] = useState(false); // slim bar (shown on scroll up)
  const [gridEl, setGridEl] = useState<HTMLDivElement | null>(null);
  const lastTop = useRef(0);

  const visiblePresets = moodboardPresets.filter((m) =>
    m.name.toLowerCase().includes(presetQuery.trim().toLowerCase()),
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const t = e.currentTarget.scrollTop;
    const dir = t - lastTop.current;
    lastTop.current = t;
    setStuck(t >= STUCK_AT);
    if (t < STUCK_AT) setShowBar(false);
    else if (dir < -2) setShowBar(true);
    else if (dir > 2) setShowBar(false);
  };

  return (
    <section style={{ ...panelStyle, ...fade(visible) }} className={panelClass}>
      {/* slim sticky bar, revealed when scrolling up */}
      <div
        className="absolute inset-x-0 top-0 z-30 flex h-[58px] items-center justify-center gap-3 bg-[#181a1c]"
        style={{
          transform: showBar ? "none" : "translateY(-100%)",
          opacity: showBar ? 1 : 0,
          transition:
            "transform 320ms cubic-bezier(.3,.7,.2,1), opacity 240ms ease",
          pointerEvents: showBar ? "auto" : "none",
        }}
      >
        <p className="text-sm font-medium text-zinc-300">
          Create a clear moodboard from your references.
        </p>
        <button
          type="button"
          onClick={onBuild}
          className="flex h-9 items-center gap-2 rounded-xl bg-lime px-3.5 text-sm font-bold text-black shadow-[inset_0_-3px_0_#829b19]"
        >
          Build your moodboard
          <span aria-hidden>✦</span>
        </button>
        <PanelCloseButton onClick={onClose} label="Close moodboard panel" />
      </div>

      <div
        ref={setGridEl}
        onScroll={handleScroll}
        className="h-full overflow-y-auto [scrollbar-width:none]"
      >
        <div className="soul-panel-head relative h-[213px] px-8 pt-[30px]">
          <PanelCloseButton onClick={onClose} label="Close moodboard panel" />
          <h2 className="font-grotesk text-[27px] font-bold uppercase leading-[34px] tracking-[-0.018em]">
            Create your moodboard
          </h2>
          <p className="mt-2.5 text-sm leading-5 text-zinc-400">
            Turn your references into a focused moodboard that{" "}
            <br />
            defines style, tone, consistent details, and creative{" "}
            <br />
            direction.
          </p>
          <button
            type="button"
            onClick={onBuild}
            className="mt-[22px] h-12 rounded-xl bg-lime px-6 text-sm font-bold text-black shadow-[inset_0_-3px_0_#829b19]"
          >
            Build your moodboard　✦
          </button>

          <div className="soul-collage pointer-events-none absolute inset-y-0 right-0 w-[400px]">
            <MoodboardCollage />
          </div>
        </div>

        {/* tabs + grid */}
        <div className="min-h-[261px] rounded-t-[18px] bg-[#242628]">
          <div
            className="soul-tabs sticky z-10 flex items-center gap-1 bg-[#242628] px-2.5 pb-4"
            style={{
              top: showBar ? 58 : 0,
              paddingTop: stuck && !showBar ? 2 : 8,
              borderTopLeftRadius: stuck ? 0 : 18,
              borderTopRightRadius: stuck ? 0 : 18,
              transition:
                "top 320ms cubic-bezier(.3,.7,.2,1), padding-top 200ms ease",
            }}
          >
            <button className="h-8 rounded-xl bg-white/10 px-3 text-xs font-semibold text-white">
              Curated
            </button>
            <button className="h-8 px-3 text-xs font-semibold text-zinc-500">
              My Moodboards
            </button>
            <label className="soul-search ml-auto flex h-8 w-[192px] items-center gap-2 rounded-xl bg-white/5 px-3 text-zinc-400">
              <Search size={14} />
              <input
                value={presetQuery}
                onChange={(e) => setPresetQuery(e.target.value)}
                placeholder="Search presets..."
                className="w-full bg-transparent text-xs font-medium text-white outline-none placeholder:text-zinc-400"
              />
            </label>
          </div>

          <div className="px-2.5 pb-3">
            <div className="soul-preset-grid grid grid-cols-5 gap-x-2 gap-y-2">
              {visiblePresets.map((item, i) => (
                <RevealCard
                  key={item.name}
                  root={gridEl}
                  index={i}
                  onClick={() => onSelectPreset(item)}
                >
                  <SafeImage
                    src={item.src}
                    fallbackSrc={item.fallback}
                    alt={item.name}
                    className="aspect-square w-full rounded-xl object-cover ring-white group-hover:ring-2"
                  />
                  <span className="soul-preset-name mt-2 block truncate text-xs font-bold text-white">
                    {item.name}
                  </span>
                </RevealCard>
              ))}
            </div>
            {visiblePresets.length === 0 && (
              <p className="py-16 text-center text-sm font-semibold text-zinc-500">
                No presets found
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExampleStrip({ images, label, good = false }: { images: string[]; label: string; good?: boolean }) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-zinc-400">
        <span className={`grid size-[18px] place-items-center rounded-full ${good ? "bg-green-500" : "bg-red-500"} text-black`}>
          {good ? <Check size={13} strokeWidth={4} /> : <X size={13} strokeWidth={4} />}
        </span>
        <span className="truncate">{label}</span>
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {images.map((src, i) => (
          <SafeImage
            key={`${src}-${i}`}
            src={src}
            fallbackSrc={
              src.includes("soul-character")
                ? good
                  ? soulExamples[i]
                  : [soulExamples[4], soulExamples[5], soulExamples[1], soulExamples[3]][i]
                : undefined
            }
            alt="Reference example"
            className={`h-[150px] w-full object-cover ${good ? "rounded-xl" : "rounded-xl border border-red-500"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function AssetImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M11.875 5.833a1.667 1.667 0 1 0 0 3.334 1.667 1.667 0 0 0 0-3.334Z" fill="url(#asset-icon-a)" />
      <path fillRule="evenodd" clipRule="evenodd" d="M4.167 2.5A1.667 1.667 0 0 0 2.5 4.167v12.5c0 .46.373.833.833.833h13.334a.833.833 0 0 0 .76-1.176c.048-.155.073-.32.073-.49V4.166A1.667 1.667 0 0 0 15.833 2.5H4.167Zm8.089 8.577 3.577 3.578V4.167H4.167v7.154l1.91-1.91a.833.833 0 0 1 1.179 0L10 12.155l1.077-1.078a.833.833 0 0 1 1.179 0Z" fill="url(#asset-icon-b)" />
      <defs>
        <linearGradient id="asset-icon-a" x1="10" y1="2.5" x2="10" y2="17.5" gradientUnits="userSpaceOnUse"><stop stopColor="white" /><stop offset="1" stopColor="#EDEDED" stopOpacity=".3" /></linearGradient>
        <linearGradient id="asset-icon-b" x1="10" y1="2.5" x2="10" y2="17.5" gradientUnits="userSpaceOnUse"><stop stopColor="white" /><stop offset="1" stopColor="#EDEDED" stopOpacity=".3" /></linearGradient>
      </defs>
    </svg>
  );
}

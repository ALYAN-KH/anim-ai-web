"use client";

import { useEffect, useRef, useState } from "react";
import { editModels, type EditModelEntry } from "../../data";

// ── Provider icons ─────────────────────────────────────────────────────────

function SeedanceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
      <path d="m3.154 12.154-2.62.655V1.2l2.62.655v10.3Zm12.668.679-2.626.656V.519l2.627.65v11.664Zm-8.509-.325-2.622.656v-6.84l2.622.655v5.53ZM9.025 5.31l2.627-.656v6.84l-2.627-.656V5.31Z" />
    </svg>
  );
}

function GenjutsuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
      <path d="m13.514 7.896-.01-.115c-.1-1.103-.818-3.178-2.809-3.178-1.477 0-2.593 1.458-3.578 2.744-.786 1.03-1.466 1.913-2.216 1.913a.865.865 0 0 1-.613-.345c-.141-.204-.178-.465-.104-.779.115-.496.775-.956 1.472-1.448.382-.26.775-.538 1.047-.804.786-.758 1.184-1.307 1.184-2.19s-.487-1.322-.895-1.51c-.818-.377-2.017-.157-2.782.501-.115.105-.23.204-.335.298-.77.685-1.289 1.15-2.478.794V5.21c1.577.696 2.902-.632 3.405-1.243.388-.403.796-.638 1.1-.638h.016a.46.46 0 0 1 .335.152c.136.157.189.34.163.543-.058.429-.503.93-1.32 1.48-.96.642-2.562 1.719-2.688 3.072-.094.972.408 1.944 1.194 2.32 1.834.868 2.95-.627 4.134-2.205.906-1.218 1.765-2.373 2.96-2.373 1.073 0 1.472.889 1.472 1.448v.11l-.105.02c-2.604.46-4.024 2.896-4.024 4.02 0 1.123.954 2.085 2.127 2.085 1.373 0 3.07-1.17 3.342-4.463l.011-.12h1.084V7.896h-1.09Zm-1.42 1.688c-.21 1.97-1.22 2.89-1.833 2.89-.278 0-.666-.23-.666-.659 0-.48.718-1.939 2.331-2.372l.19-.047-.022.188Z" />
    </svg>
  );
}

function KlingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="m16.752 2.87.066.067.002-.001c1.267 1.318.904 3.968-.934 6.973l3.614 3.748-.155.313a11.1 11.1 0 0 1-2.426 3.246 10.437 10.437 0 0 1-4.605 2.488l-.062.016-.089.022-.064.014-.14.033-.117.024-.088.017c-.093.02-.19.037-.286.054l-.08.012-.06.008-.255.034a9.3 9.3 0 0 1-4.221-.486 9.575 9.575 0 0 1-3.609-2.323l-.06-.06c-1.269-1.319-.91-3.97.93-6.977L.5 6.344l.155-.313a10.97 10.97 0 0 1 2.428-3.244A10.61 10.61 0 0 1 6.57.64c.298-.111.61-.208.916-.29.252-.07.507-.13.765-.178.087-.018.185-.037.28-.053a9.271 9.271 0 0 1 4.425.362 9.542 9.542 0 0 1 3.795 2.389Zm-1.222.16h-.003l.003.003c-1.227-.394-3.176.243-5.236 1.65 1.567-.453 3.083-.219 4.063.798.928.964 1.182 2.427.83 3.964a2.92 2.92 0 0 1-.062.25c1.681-2.638 2.22-5.105 1.154-6.207a.64.64 0 0 0-.055-.056l-.009-.008-.011-.01-.036-.029a.83.83 0 0 0-.047-.037l-.027-.02a1.839 1.839 0 0 0-.564-.297Zm-.842 5.929c-.217 1.34-.932 2.696-2.016 3.818-1.08 1.123-2.39 1.865-3.685 2.092-1.212.212-2.257-.065-2.942-.773-.684-.71-.95-1.79-.746-3.052.217-1.34.93-2.695 2.01-3.816l.005-.007.004-.006c1.083-1.116 2.387-1.856 3.679-2.08 1.212-.212 2.255.064 2.942.773.683.709.95 1.79.745 3.051h.004ZM3.706 3.51a9.99 9.99 0 0 0-2.054 2.652l-.006.001 3.135 3.244c.26-.38.534-.749.82-1.107.102-.125.207-.255.315-.385l.04-.048.15-.173.028-.032.014-.018.077-.088c.04-.047.08-.093.122-.138l.067-.077.048-.051.005-.006.009-.012.008-.01.02-.022.013-.012.083-.089.05-.055.025-.027.016-.019.048-.049.093-.095.031-.034.035-.038a20.74 20.74 0 0 1 2.147-1.943l.1-.075.1-.077c.11-.086.223-.17.335-.253.12-.085.24-.168.36-.25 1.629-1.127 3.224-1.802 4.526-1.936a8.41 8.41 0 0 0-6.067-1.137l-.156.03-.03.007A9.626 9.626 0 0 0 3.706 3.51Zm.173 13.142c.174.138.372.242.594.313H4.47c1.236.392 3.177-.247 5.23-1.65-1.566.45-3.079.216-4.058-.8-.924-.96-1.178-2.428-.828-3.965a3.48 3.48 0 0 1 .062-.249c-1.681 2.638-2.218 5.104-1.155 6.207.05.051.103.1.159.144Zm14.467-2.814v.001a10.056 10.056 0 0 1-2.053 2.65 9.633 9.633 0 0 1-4.33 2.303l-.02.005-.054.013c-.06.017-.121.03-.183.041-.04.01-.08.017-.123.024a4.8 4.8 0 0 1-.26.045l-.073.013-.083.011a8.428 8.428 0 0 1-5.65-1.206c1.254-.128 2.78-.763 4.346-1.812l.09-.06.089-.061.121-.085.235-.166c.114-.083.226-.167.336-.254.069-.05.136-.102.202-.152a21.375 21.375 0 0 0 2.193-1.994l.02-.022a2.82 2.82 0 0 0 .092-.095l.047-.049.018-.018.007-.008.054-.056.042-.045a.797.797 0 0 0 .041-.043l.012-.013.02-.02.01-.012.008-.01.01-.01.017-.018.017-.019.016-.016.039-.042.08-.086.007-.006c.036-.04.071-.082.106-.123l.07-.08.022-.026.04-.05.01-.012c.048-.053.095-.108.142-.163l.048-.058c.078-.094.155-.188.232-.284l.094-.115.029-.037.11-.142a21.19 21.19 0 0 0 .669-.915l3.122 3.238Z" />
    </svg>
  );
}

function WanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M13.565 1.667c.963 0 1.744.772 1.744 1.725V13.81a.616.616 0 0 0 .62.59.616.616 0 0 0 .62-.59V7.582a1.716 1.716 0 0 1 1.725-1.708A1.717 1.717 0 0 1 20 7.584v5.467a.54.54 0 0 1-.75.498.542.542 0 0 1-.337-.498V7.584a.635.635 0 0 0-.639-.632.635.635 0 0 0-.638.632v6.226a1.698 1.698 0 0 1-1.707 1.689 1.697 1.697 0 0 1-1.707-1.689V3.394a.654.654 0 0 0-.656-.628.654.654 0 0 0-.658.627v13.253a1.697 1.697 0 0 1-1.707 1.688 1.698 1.698 0 0 1-1.707-1.689v-1.611a.54.54 0 0 1 .543-.538c.3 0 .544.241.544.538v1.611c0 .22.118.422.31.532a.628.628 0 0 0 .847-.224.612.612 0 0 0 .083-.308V3.392c0-.953.78-1.725 1.744-1.725Zm-4.728 0c.963 0 1.744.772 1.744 1.725v9.603a.539.539 0 0 1-.543.537.54.54 0 0 1-.544-.537V3.392a.654.654 0 0 0-.657-.65.654.654 0 0 0-.658.65V15.07a1.717 1.717 0 0 1-1.725 1.706 1.717 1.717 0 0 1-1.726-1.707V7.584a.635.635 0 0 0-.638-.632.635.635 0 0 0-.638.632v3.166a1.717 1.717 0 0 1-1.726 1.708A1.718 1.718 0 0 1 0 10.75V9.602a.54.54 0 0 1 .543-.538c.3 0 .544.241.544.538v1.148c0 .349.286.631.639.631a.635.635 0 0 0 .638-.63V7.582A1.717 1.717 0 0 1 4.09 5.876a1.717 1.717 0 0 1 1.726 1.707v7.486c0 .35.286.632.64.632a.635.635 0 0 0 .638-.632V3.393c0-.953.78-1.725 1.744-1.725Z" />
    </svg>
  );
}

/** MiniMax uses the same visual as Wan */
const MinimaxIcon = WanIcon;

function GeminiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
      <path d="M2.555 6.258A8.33 8.33 0 0 1 10 1.666c2.246 0 4.133.825 5.575 2.17l-2.389 2.39C12.322 5.401 11.224 4.98 10 4.98c-2.17 0-4.008 1.467-4.662 3.436a5.006 5.006 0 0 0-.262 1.583 5 5 0 0 0 .262 1.584c.655 1.97 2.491 3.435 4.662 3.435 1.121 0 2.075-.295 2.822-.795a3.834 3.834 0 0 0 1.663-2.515H10V8.484h7.849c.098.545.151 1.114.151 1.704 0 2.539-.908 4.675-2.485 6.126-1.378 1.273-3.265 2.019-5.515 2.019a8.33 8.33 0 0 1-8.333-8.334c0-1.345.322-2.616.887-3.741Z" />
    </svg>
  );
}

function FluxIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <defs><clipPath id="flux-pick-clip"><path d="M0 0h24v24H0z" /></clipPath></defs>
      <g clipPath="url(#flux-pick-clip)">
        <path d="M24 21h-2.122l-9.83-14.736-8.682 12.912h12.22L16.78 21H0L12.024 3 24 21Z" />
        <path d="M20.39 21h-2.122l-4.825-7.252-.906-1.436h2.122L20.39 21Zm-8.146-3.888H8l2.122-3.215 2.122 3.215Zm7.512-4.992 2.17-3.168L24 12.12h-4.244Z" />
      </g>
    </svg>
  );
}

function GrokIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <defs><clipPath id="grok-pick-clip"><rect width="24" height="24" /></clipPath></defs>
      <g clipPath="url(#grok-pick-clip)">
        <path d="M9.23842 15.4055L17.3051 9.26292C17.7006 8.9618 18.2658 9.07925 18.4543 9.54702C19.446 12.0138 19.0029 14.9784 17.0297 17.0138C15.0566 19.0492 12.3111 19.4955 9.80163 18.4789L7.06027 19.7882C10.9922 22.5604 15.7667 21.8748 18.7504 18.795C21.117 16.3538 21.8499 13.0262 21.1646 10.0254L21.1708 10.0318C20.1769 5.62354 21.4151 3.86151 23.9515 0.258408C23.9702 0.231693 23.9351 0.202703 23.9123 0.226139L20.7939 3.44289V3.43221L9.23842 15.4055Z" />
        <path d="M7.65167 7.33217C5.24368 9.81392 4.75711 14.1176 7.57924 16.8984L7.57713 16.9005L0.0792788 23.8097C0.0528384 23.834 0.0162235 23.8015 0.0377551 23.7728C0.487937 23.1707 1.01883 22.595 1.54932 22.0198L1.57777 21.9889C3.28214 20.1411 4.97141 18.3097 3.93926 15.7216C2.55615 12.2552 3.36158 8.19287 5.9228 5.55089C8.58547 2.80639 12.507 2.1144 15.7826 3.5048C16.5072 3.78245 17.1388 4.17758 17.6315 4.54493L14.8964 5.84777C12.3497 4.7457 9.43229 5.49537 7.65167 7.33217Z" />
      </g>
    </svg>
  );
}

function ProviderIcon({ provider }: { provider: EditModelEntry["provider"] }) {
  switch (provider) {
    case "seedance": return <SeedanceIcon />;
    case "genjutsu": return <GenjutsuIcon />;
    case "kling": return <KlingIcon />;
    case "wan": return <WanIcon />;
    case "minimax": return <MinimaxIcon />;
    case "gemini": return <GeminiIcon />;
    case "flux": return <FluxIcon />;
    case "grok": return <GrokIcon />;
  }
}

// ── Chip icons ─────────────────────────────────────────────────────────────

function ResolutionChipIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.56218 3.52331C6.89119 3.18855 7.34089 3 7.81027 3H16.186C16.6554 3 17.1051 3.18855 17.4341 3.52331L22.5881 8.76722C23.2614 9.45231 23.2567 10.5521 22.5774 11.2313L13.2356 20.5732C12.5521 21.2566 11.4441 21.2566 10.7607 20.5732L1.41881 11.2313C0.73957 10.5521 0.734815 9.45231 1.40816 8.76722L6.56218 3.52331ZM9.02845 7.21967C9.32135 7.51256 9.32135 7.98744 9.02845 8.28033L7.30878 10L9.02845 11.7197C9.32135 12.0126 9.32135 12.4874 9.02845 12.7803C8.73556 13.0732 8.26069 13.0732 7.96779 12.7803L5.71779 10.5303C5.4249 10.2374 5.4249 9.76256 5.71779 9.46967L7.96779 7.21967C8.26069 6.92678 8.73556 6.92678 9.02845 7.21967Z" />
    </svg>
  );
}

function ClockChipIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 7.75C12.75 7.33579 12.4142 7 12 7C11.5858 7 11.25 7.33579 11.25 7.75V12C11.25 12.1989 11.329 12.3897 11.4697 12.5303L14.2197 15.2803C14.5126 15.5732 14.9874 15.5732 15.2803 15.2803C15.5732 14.9874 15.5732 14.5126 15.2803 14.2197L12.75 11.6893V7.75Z" />
    </svg>
  );
}

/** Speaker/volume icon shown next to models that support audio */
function SoundIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5 shrink-0 text-white/40" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.2478 4.75195C21.1027 6.60684 22.25 9.16934 22.25 11.9998C22.25 14.8303 21.1027 17.3928 19.2478 19.2476M15.8891 8.11133C16.8844 9.10663 17.5 10.4816 17.5 12.0004C17.5 13.5192 16.8844 14.8942 15.8891 15.8895M2.75 7.75H5.7074C5.89846 7.75 6.08552 7.69526 6.24645 7.59227L12.25 3.75V20.25L6.24645 16.4077C6.08552 16.3047 5.89846 16.25 5.7074 16.25H2.75C2.19772 16.25 1.75 15.8023 1.75 15.25V8.75C1.75 8.19772 2.19772 7.75 2.75 7.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Sparkle heading icon ───────────────────────────────────────────────────

function SparkleIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-white/40">
      <path d="M12.7368 2.60967C12.6694 2.25593 12.3601 2 12 2C11.6399 2 11.3306 2.25593 11.2632 2.60967C10.7844 5.12353 9.83969 7.03715 8.43842 8.43842C7.03715 9.83969 5.12353 10.7844 2.60967 11.2632C2.25593 11.3306 2 11.6399 2 12C2 12.3601 2.25593 12.6694 2.60967 12.7368C5.12353 13.2156 7.03715 14.1603 8.43842 15.5616C9.83969 16.9629 10.7844 18.8765 11.2632 21.3903C11.3306 21.7441 11.6399 22 12 22C12.3601 22 12.6694 21.7441 12.7368 21.3903C13.2156 18.8765 14.1603 16.9629 15.5616 15.5616C16.9629 14.1603 18.8765 13.2156 21.3903 12.7368C21.7441 12.6694 22 12.3601 22 12C22 11.6399 21.7441 11.3306 21.3903 11.2632C18.8765 10.7844 16.9629 9.83969 15.5616 8.43842C14.1603 7.03715 13.2156 5.12353 12.7368 2.60967Z" />
    </svg>
  );
}

// ── Checkmark ─────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="size-full" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M17.7406 7.1827C18.0539 7.45363 18.0882 7.92725 17.8173 8.24057L10.4673 16.7406C10.3305 16.8988 10.1339 16.9926 9.92494 16.9996C9.71594 17.0066 9.51353 16.9259 9.36654 16.7772L6.21654 13.5897C5.92539 13.2951 5.9282 12.8202 6.22282 12.5291C6.51744 12.2379 6.9923 12.2407 7.28346 12.5353L9.86327 15.1458L16.6827 7.25945C16.9536 6.94613 17.4272 6.91177 17.7406 7.1827Z" />
    </svg>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────

function Badge({ type }: { type: "top" | "new" }) {
  if (type === "top") {
    return (
      <span
        className="inline-block whitespace-nowrap text-[10px] font-bold uppercase px-1.5 rounded-sm -skew-x-12 text-white font-grotesk"
        style={{ backgroundImage: "linear-gradient(90deg,rgb(50,89,180) 0%,rgb(60,140,255) 50%,rgb(0,200,210) 75%,rgb(120,201,230) 100%)" }}
      >
        Top
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center h-4 px-1 text-[0.625rem] font-bold uppercase rounded-sm -skew-x-12 bg-[#d1fe17] text-black font-grotesk leading-4">
      New
    </span>
  );
}

// ── Picker ─────────────────────────────────────────────────────────────────

export interface EditModelPickerProps {
  anchor: DOMRect;
  selectedId: string;
  onSelect: (model: EditModelEntry) => void;
  onClose: () => void;
}

export function EditModelPicker({ anchor, selectedId, onSelect, onClose }: EditModelPickerProps) {
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = search.trim()
    ? editModels.filter((m) => m.name.toLowerCase().includes(search.trim().toLowerCase()))
    : editModels;

  // Close on outside click or Escape
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Keep the menu beside the studio sidebar, as in the source interface.
  const menuWidth = typeof window !== "undefined" ? Math.min(500, window.innerWidth - 24) : 500;
  const menuHeight = typeof window !== "undefined" ? Math.min(800, window.innerHeight - 32) : 800;
  const pickerStyle: React.CSSProperties = {
    position: "fixed",
    top: typeof window !== "undefined" ? Math.max(16, Math.min(anchor.top - 550, window.innerHeight - menuHeight - 16)) : 16,
    left: typeof window !== "undefined" ? Math.max(8, Math.min(anchor.right + 10, window.innerWidth - menuWidth - 8)) : anchor.right + 10,
    width: menuWidth,
    maxHeight: menuHeight,
    zIndex: 2000,
  };

  return (
    <div
      ref={containerRef}
      style={pickerStyle}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#16181b] shadow-2xl"
    >
      {/* Search */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          autoFocus
          className="w-full rounded-xl border border-white/10 bg-white/[.06] px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-white/30"
        />
      </div>

      {/* Model list */}
      <section className="overflow-y-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Section heading */}
        <div className="flex items-center gap-1.5 px-3 pt-2 pb-2">
          <SparkleIcon />
          <p className="flex-1 text-xs font-medium text-white/40">Featured models</p>
        </div>

        {/* Items */}
        <div className="px-3 flex flex-col gap-1">
          {filtered.map((model) => {
            const isSelected = model.id === selectedId;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => { onSelect(model); onClose(); }}
                className={`w-full flex gap-0 items-center rounded-xl pl-1.5 py-1.5 pr-3 transition-colors cursor-pointer text-start ${isSelected ? "bg-white/5" : "hover:bg-white/5 focus-visible:bg-white/5"
                  }`}
              >
                {/* Provider icon */}
                <div
                  className={`size-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mr-2 [&>svg]:size-4 shadow-[inset_0px_2px_3px_0px_rgba(255,255,255,0.03)] ${isSelected ? "text-[#d1fe17]" : "text-white/40"
                    }`}
                >
                  <ProviderIcon provider={model.provider} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
                  {/* Name row */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-white">{model.name}</span>
                    {model.badge && <Badge type={model.badge} />}
                    {model.sound && <SoundIcon />}
                  </div>
                  {/* Chips row */}
                  <div className="flex gap-1 overflow-hidden">
                    {model.chips.map((chip, i) => (
                      <div key={i} className="flex items-center gap-0.5 px-1 py-0.5 rounded-sm bg-white/5 text-white/40 text-[10px] font-medium">
                        {chip.icon === "resolution" && <ResolutionChipIcon />}
                        {chip.icon === "clock" && <ClockChipIcon />}
                        <span>{chip.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkmark */}
                <div className={`size-5 shrink-0 ${isSelected ? "text-[#d1fe17]" : "text-transparent"}`}>
                  {isSelected && <CheckIcon />}
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <p className="px-2 py-4 text-xs text-white/40 text-center">No models found</p>
          )}
        </div>
      </section>
    </div>
  );
}

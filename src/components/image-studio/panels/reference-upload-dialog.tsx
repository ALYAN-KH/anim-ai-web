import { AuthDialog } from "@/components/auth/AuthDialog";
import type { AuthMode } from "@/components/auth/auth";
import {
  ArrowLeft,
  X
} from "lucide-react";
import { useState } from "react";
import { AssetImageIcon, ExampleStrip } from "../panels";

export const characterGuideImage = (type: "pos" | "neg", index: number) =>
  `https://static.higgsfield.ai/soul-character/guide-${type}-image-${index}.webp`;

export const characterGood = [0, 1, 2, 3].map((i) => characterGuideImage("pos", i));

export const characterBad = [0, 1, 2, 3].map((i) => characterGuideImage("neg", i));

export const guideImage = (type: "pos" | "neg", index: number) =>
  `https://static.higgsfield.ai/soul-moodboard/guide-${type}-image-${index}.webp`;

export const moodboardGood = [0, 1, 2, 3].map((i) => guideImage("pos", i));

export const moodboardBad = [0, 1, 2, 3].map((i) => guideImage("neg", i));

export function ReferenceUploadDialog({
  kind,
  onCancel,
}: {
  kind: "character" | "moodboard";
  onCancel: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const moodboard = kind === "moodboard";
  const title = moodboard ? "Build your moodboard" : "Make your own character";
  const subtitle = moodboard
    ? "Upload at least 5 photos to continue."
    : "Upload up to 5 photos to continue.";
  const good = moodboard ? moodboardGood : characterGood;
  const bad = moodboard ? moodboardBad : characterBad;

  const requestClose = () => setConfirming(true);

  return (
    <>
      {/* Keep the composer visually above the dimmer, as on the reference site. */}
      <div className="fixed inset-0 z-[35] bg-black/65 backdrop-blur-[1px]" aria-hidden />
      <div className="fixed inset-0 z-50" onMouseDown={requestClose} aria-hidden />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reference-dialog-title"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 150,
          width: "min(880px, calc(100vw - 24px))",
          height: "min(474px, calc(100dvh - 166px))",
        }}
        className="fixed z-[60] overflow-y-auto rounded-[22px] border border-white/10 bg-[#1d1f20] p-3 shadow-[0_30px_100px_#000] [scrollbar-width:none]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="relative flex h-11 items-start justify-center">
          <button
            type="button"
            onClick={requestClose}
            aria-label="Go back"
            className="absolute left-0 top-0 grid size-9 place-items-center rounded-full bg-white/[0.06] text-zinc-300 hover:bg-white/10"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="text-center">
            <h2 id="reference-dialog-title" className="text-[16px] font-bold leading-5">
              {title}
            </h2>
            <p className="text-xs text-zinc-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="absolute right-0 top-0 grid size-9 place-items-center rounded-full bg-white/[0.06] text-zinc-300 hover:bg-white/10"
          >
            <X size={17} />
          </button>
        </header>

        <div className="grid h-[198px] grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAuthMode("signup")}
            className="group grid place-items-center rounded-2xl bg-[linear-gradient(#292a2c_0%,#1f2124_100%)] hover:opacity-80"
          >
            <span className="flex flex-col items-center gap-4 text-[16px] font-semibold">
              <span className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-zinc-400 group-hover:text-white">
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill="currentColor" d="M9.166 9.166V4.166h1.667v5h5v1.667h-5v5H9.166v-5h-5V9.166h5Z" />
                </svg>
              </span>
              Upload from device
            </span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("signup")}
            className="group grid place-items-center rounded-2xl bg-[linear-gradient(#292a2c_0%,#1f2124_100%)] hover:opacity-80"
          >
            <span className="flex flex-col items-center gap-4 text-[16px] font-semibold">
              <span className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-zinc-400 group-hover:text-white">
                <AssetImageIcon />
              </span>
              Upload from assets
            </span>
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <ExampleStrip good images={good} label="20+ photos, one cohesive style, no faces." />
          <ExampleStrip images={bad} label="Faces, mixed styles, blurry or low-quality images." />
        </div>
      </section>

      {confirming && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/75 px-4">
          <section role="alertdialog" aria-modal="true" className="w-full max-w-[448px] rounded-[20px] border border-white/10 bg-[#181a1c] p-6 shadow-[0_24px_80px_#000]">
            <h3 className="text-[22px] font-bold">Are you sure?</h3>
            <p className="mt-2 text-[16px] text-zinc-400">Your uploaded photos will be lost.</p>
            <div className="mt-8 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirming(false)} className="h-12 min-w-[170px] rounded-xl bg-[#292c2f] px-5 text-[16px] font-bold">
                No, keep them
              </button>
              <button type="button" onClick={onCancel} className="h-12 min-w-[154px] rounded-xl bg-red-950 px-5 text-[16px] font-bold text-red-500">
                Yes, discard
              </button>
            </div>
          </section>
        </div>
      )}
      {authMode && (
        <AuthDialog
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
        />
      )}
    </>
  );
}

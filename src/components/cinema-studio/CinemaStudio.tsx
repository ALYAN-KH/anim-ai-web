"use client";
import { useCallback, useRef, useState } from "react";
import "./cinema-studio.css";
import { CameraModal } from "./CameraModal";
import { Carousel } from "./Carousel";
import { CharacterModal } from "./CharacterModal";
import { Composer } from "./Composer";
import type { Mode } from "./data";
import { FilmSetupModal } from "./FilmSetup";
import { LightingModal, PaletteModal } from "./GridModals";
import { Sidebar } from "./Sidebar";
import { DEFAULT_MODES, DEFAULT_SETUP, type ModalState, type ModeState, type Setup } from "./state";

export function CinemaStudio({ initialMode = "video" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [modes, setModes] = useState(DEFAULT_MODES);
  const [setup, setSetup] = useState<Setup>(DEFAULT_SETUP);
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState("");
  const refInput = useRef<HTMLInputElement>(null);

  const update = useCallback((p: Partial<Setup>) => setSetup((s) => ({ ...s, ...p })), []);
  const patch = useCallback((p: Partial<ModeState>) => setModes((m) => ({ ...m, [mode]: { ...m[mode], ...p } })), [mode]);
  const close = useCallback(() => setModal(null), []);
  const say = (t: string) => { setToast(t); window.setTimeout(() => setToast(""), 3200); };
  const ms = modes[mode];

  return (
    <div className="cs-scope cs-root fixed inset-0 flex gap-1 overflow-hidden p-1 max-md:p-0">
      <Sidebar />
      <section className="relative flex min-w-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#131416] px-4 pt-[84px]">
        <Carousel />
        <h1 className="cs-heading mb-[34px] mt-[30px] text-center text-[40px] leading-none">Bring your stories to life</h1>
        <Composer
          mode={mode} setMode={setMode} ms={ms} patch={patch} setup={setup} open={setModal} refInput={refInput}
          onGenerate={() => say("Generation needs the Higgsfield generation API, which isn't connected in this clone.")}
        />
        <input ref={refInput} type="file" accept="image/*,video/*" multiple hidden onChange={(e) => { patch({ refs: Math.min(50, ms.refs + (e.target.files?.length ?? 0)) }); e.target.value = ""; }} />
        {toast && <div role="status" className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-xl border border-white/10 bg-[#2a2b2e] px-4 py-2.5 text-sm text-white shadow-xl">{toast}</div>}
      </section>

      {modal?.kind === "film" && <FilmSetupModal tab={modal.tab} setTab={(tab) => setModal({ kind: "film", tab })} setup={setup} update={update} onClose={close} />}
      {modal?.kind === "camera" && (
        <CameraModal tab={modal.tab} setTab={(tab) => setModal({ kind: "camera", tab })} setup={setup} update={update} onClose={close}
          onPut={(n) => { patch({ prompt: `${ms.prompt}${ms.prompt && !ms.prompt.endsWith(" ") ? " " : ""}#${n.replace(/\s+/g, "")} ` }); close(); }} />
      )}
      {modal?.kind === "palette" && <PaletteModal value={setup.palette} onPick={(palette) => update({ palette })} onClose={close} />}
      {modal?.kind === "lighting" && <LightingModal value={setup.lighting} onPick={(lighting) => update({ lighting })} onClose={close} />}
      {modal?.kind === "character" && <CharacterModal onClose={close} />}
    </div>
  );
}

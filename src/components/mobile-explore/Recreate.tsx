"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, Info, Play, SlidersHorizontal, Volume2, VolumeX, X } from "lucide-react";
import { type Preset, source } from "./data";
import { ReferenceIcon } from "./ReferenceIcon";
import styles from "./mobile-explore.module.css";

export function Recreate({ preset, onClose, onLogin }: { preset: Preset; onClose: () => void; onLogin: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const urls = useRef<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [sheet, setSheet] = useState(true);
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [slot, setSlot] = useState(0);
  const [settings, setSettings] = useState(false);
  const [information, setInformation] = useState(false);
  const [model, setModel] = useState("Genjutsu Lite");
  const [resolution, setResolution] = useState("720p");
  const [ratio, setRatio] = useState("9:16");

  useEffect(() => () => urls.current.forEach(url => URL.revokeObjectURL(url)), []);
  const toggle = () => {
    const element = video.current;
    if (!element || !preset.video) return;
    if (element.paused) void element.play().catch(() => setPlaying(false));
    else element.pause();
  };

  return <section className={styles.recreate} aria-label="Recreate this video">
    {preset.video ? <video ref={video} src={source(preset.video)} poster={source(preset.poster)} muted={muted} loop playsInline preload="metadata" onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onClick={toggle} className={styles.recreateVideo} aria-label="Selected preset video" /> : <img src={source(preset.poster)} alt="Selected preset" className={styles.recreateVideo} />}
    {!playing && <div className={styles.videoShade} />}
    <div className={styles.previewHeader}>
      <button type="button" aria-label="Back to Explore" onClick={onClose}><ChevronLeft /></button>
      <a href="/pricing" className={styles.upgrade}><ReferenceIcon name="diamond" />Upgrade</a>
    </div>
    {preset.video && <>
      <button type="button" className={styles.mute} aria-label={muted ? "Unmute video" : "Mute video"} onClick={() => setMuted(value => !value)}>{muted ? <VolumeX /> : <Volume2 />}</button>
      {!playing && <button type="button" className={styles.play} aria-label="Play preset video" onClick={toggle}><Play fill="currentColor" /></button>}
    </>}
    <button type="button" className={styles.recreateTab} onClick={() => setSheet(true)}>Recreate this video</button>
    {sheet && <div className={styles.sheet} role="dialog" aria-label="Recreate this video settings">
      <div className={styles.handle} />
      <div className={styles.sheetHeader}>
        <button type="button" aria-label="Preset information" onClick={() => { setInformation(value => !value); setSettings(false); }}><Info /></button>
        <div><strong>Recreate this video</strong><button className={styles.modelSelect} type="button" aria-label="Choose model" onClick={() => { setSettings(value => !value); setInformation(false); }}>{model}<ChevronDown /></button></div>
        <button type="button" aria-label="Close recreate panel" onClick={() => setSheet(false)}><X /></button>
      </div>
      {information ? <div className={styles.sheetInformation}><strong>{preset.mode}</strong><p>Take the motion and recast it with your characters, locations, and products, or swap specific elements while keeping the rest untouched.</p></div> : settings ? <div className={styles.settings}>
        <label>Model<select aria-label="Model" value={model} onChange={event => setModel(event.target.value)}><option>Genjutsu Lite</option><option>Higgsfield Genjutsu</option></select></label>
        <label>Resolution<select aria-label="Resolution" value={resolution} onChange={event => setResolution(event.target.value)}><option>720p</option><option>1080p</option></select></label>
        <label>Aspect ratio<select aria-label="Aspect ratio" value={ratio} onChange={event => setRatio(event.target.value)}><option>9:16</option><option>16:9</option><option>1:1</option></select></label>
      </div> : <div className={styles.slots}>
        {slots.map((image, i) => <div key={i} className={styles.slot}>
          {!image && <div aria-hidden="true" className={`preload preload-transition preload-gradient preload-static preload-gradient-0 ${styles.placeholder}`} />}
          <button type="button" className={styles.upload} aria-label={`Upload reference image ${i + 1}`} onClick={() => { setSlot(i); input.current?.click(); }}>{image && <img src={image} alt={`Reference ${i + 1}`} />}</button>
          <button type="button" className={styles.removeSlot} aria-label={`Remove reference image ${i + 1}`} onClick={() => setSlots(items => items.filter((_, index) => index !== i))}><X /></button>
        </div>)}
        {slots.length < 3 && <button type="button" className={styles.addSlot} aria-label="Add reference image" onClick={() => setSlots(items => [...items, null])}>+</button>}
      </div>}
      <input ref={input} type="file" accept="image/*" hidden onChange={event => {
        const file = event.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        urls.current.push(url);
        setSlots(items => items.map((item, index) => index === slot ? url : item));
        event.target.value = "";
      }} />
      <div className={styles.generateRow}>
        <button type="button" className={styles.generate} aria-label="Generate video" onClick={onLogin}><span className={styles.generateMark} /></button>
        <button type="button" className={styles.settingsButton} aria-label="Generation settings" aria-expanded={settings} onClick={() => { setSettings(value => !value); setInformation(false); }}><SlidersHorizontal /></button>
      </div>
    </div>}
  </section>;
}

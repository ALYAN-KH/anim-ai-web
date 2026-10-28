"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, Maximize2, Minimize2, RotateCcw, Smartphone, RectangleHorizontal, Volume2, VolumeX } from "lucide-react";
import type { PlayableGame } from "./data";
import { PlayerDetails } from "./PlayerDetails";
import styles from "./player.module.css";

type Status = "loading" | "ready" | "error";

export default function PlayerDialog({ game, onClose }: { game: PlayableGame; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<Status>(game.playUrl || game.previewVideo ? "loading" : "ready");
  const [attempt, setAttempt] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [landscape, setLandscape] = useState(false);
  const [message, setMessage] = useState("");
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    closeButton.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const siblings = Array.from(document.body.children).filter(node => node !== dialog.current && node instanceof HTMLElement) as HTMLElement[];
    const previous = siblings.map(node => node.inert);
    siblings.forEach(node => { node.inert = true; });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.fullscreenElement) { event.preventDefault(); closeRef.current(); }
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], iframe, [tabindex='0']"));
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const onFullscreen = () => setFullscreen(document.fullscreenElement === stage.current);
    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      document.body.style.overflow = overflow;
      siblings.forEach((node, index) => { node.inert = previous[index]; });
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFullscreen);
      if (document.fullscreenElement === stage.current) document.exitFullscreen().catch(() => undefined);
    };
  }, []);

  const restart = () => { setStatus("loading"); setAttempt(value => value + 1); };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stage.current?.requestFullscreen();
    } catch { setMessage("Fullscreen is unavailable in this browser."); }
  };
  return createPortal(<div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="playable-player-title" className={styles.player}>
    <div ref={stage} className={styles.stage}>
      <div aria-hidden="true" className={styles.floor} />
      <div className={`${styles.viewport} ${landscape ? styles.landscape : ""}`}>
        {game.playUrl ? <iframe key={attempt} src={game.playUrl} title={game.title} allow="autoplay; fullscreen; gamepad" onLoad={() => setStatus("ready")} />
          : game.previewVideo ? <video key={attempt} ref={video} src={game.previewVideo} poster={game.image} autoPlay muted={muted} loop playsInline onCanPlay={() => setStatus("ready")} onError={() => setStatus("error")} />
          : <img src={game.image} alt={`${game.title} screenshot`} />}
        {status === "loading" && <div role="status" className={styles.overlay}><Loader2 className="size-8 animate-spin" /><span className="sr-only">Loading {game.title}</span></div>}
        {status === "error" && <div role="alert" className={styles.overlay}><p>The preview couldn’t be loaded.</p><button onClick={restart}>Try again</button></div>}
      </div>
      {!game.playUrl && <p className={styles.previewLabel}>{game.previewVideo ? "Gameplay preview · Interactive game files not supplied" : "Gameplay preview unavailable · Interactive game files not supplied"}</p>}
      <div className={styles.toolbar} role="toolbar" aria-label="Game controls">
        <button onClick={restart} disabled={!game.playUrl && !game.previewVideo} aria-label="Restart" title="Restart"><RotateCcw size={18} /></button>
        <button onClick={() => setMuted(value => !value)} disabled={!game.previewVideo || !!game.playUrl} aria-label={muted ? "Enable sound" : "Mute sound"} aria-pressed={!muted} title={muted ? "Enable sound" : "Mute sound"}>{muted ? <VolumeX size={19} /> : <Volume2 size={19} />}</button>
        <span className={styles.separator} />
        <button onClick={() => setLandscape(false)} aria-label="Portrait" aria-pressed={!landscape}><Smartphone size={19} /></button>
        <button onClick={() => setLandscape(true)} aria-label="Landscape" aria-pressed={landscape}><RectangleHorizontal size={19} /></button>
        <span className={styles.separator} />
        <button onClick={toggleFullscreen} disabled={!document.fullscreenEnabled} aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}>{fullscreen ? <Minimize2 size={19} /> : <Maximize2 size={19} />}</button>
      </div>
      <span role="status" className={styles.previewLabel}>{message}</span>
    </div>
    <PlayerDetails game={game} onClose={onClose} closeRef={closeButton} />
  </div>, document.body);
}

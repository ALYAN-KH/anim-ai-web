"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Instagram, Link2, Upload, X } from "lucide-react";
import type { ContentFactoryStyle } from "./data";
import styles from "./reference-picker.module.css";

export type FactoryReference = Pick<ContentFactoryStyle, "title" | "poster" | "video"> & { kind?: "image" | "video" | "link" };

export function useFactoryReference() {
  const [reference, setReference] = useState<FactoryReference | null>(null);
  useEffect(() => () => {
    if (reference?.video.startsWith("blob:")) URL.revokeObjectURL(reference.video);
  }, [reference]);
  return { reference, setReference };
}

export function ReferencePicker({ mode, reference, onChange, onClear, tall = false, inputId }: {
  inputId?: string;
  mode: "claude" | "here";
  reference: FactoryReference | null;
  onChange: (value: FactoryReference) => void;
  onClear: () => void;
  tall?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [linkForm, setLinkForm] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [tiktok, setTiktok] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const linkInput = useRef<HTMLInputElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    setTiktok(false);
    if (mode !== "here") return;
    const timer = setInterval(() => setTiktok(value => !value), 5000);
    return () => clearInterval(timer);
  }, [mode]);
  useEffect(() => {
    if (!open) return;
    if (linkForm) linkInput.current?.focus();
    else menu.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) { setOpen(false); setLinkForm(false); } };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, linkForm]);

  const dismiss = () => { setOpen(false); setLinkForm(false); trigger.current?.focus(); };
  const saveLink = () => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      if (parsed.protocol !== "https:" || !["instagram.com", "tiktok.com"].some(domain => host === domain || host.endsWith(`.${domain}`))) throw new Error();
      onChange({ title: parsed.hostname.includes("instagram") ? "Instagram reference" : "TikTok reference", poster: "", video: parsed.href, kind: "link" });
      setError(""); dismiss();
    } catch { setError("Enter a valid HTTPS TikTok or Instagram link."); }
  };
  return <div ref={root} className={styles.root} onBlur={event => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) { setOpen(false); setLinkForm(false); }
  }} onKeyDown={event => {
    if (event.key === "Escape") { event.stopPropagation(); dismiss(); }
  }}>
    <input ref={input} id={inputId} type="file" accept="image/*,video/*" className="hidden" onChange={event => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) { setError("Select an image or video file."); return; }
      const objectUrl = URL.createObjectURL(file);
      onChange({ title: file.name, poster: objectUrl, video: objectUrl, kind: file.type.startsWith("image/") ? "image" : "video" });
      setError(""); dismiss();
    }} />
    <button ref={trigger} type="button" aria-label={reference ? `Change reference: ${reference.title}` : "Add reference"} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => { setOpen(value => !value); setLinkForm(false); setError(""); }} className={styles.trigger}>
      <span className={`${styles.tile} ${tall ? styles.tall : ""}`}>
        {reference?.kind === "link" ? <Link2 size={20} /> : reference?.kind === "video" ? <video src={reference.video} muted playsInline preload="metadata" /> : reference ? <img src={reference.poster} alt={reference.title} /> : tiktok ? <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.715 10.213a8.2 8.2 0 0 1-4.772-1.526v6.986A6.33 6.33 0 0 1 9.612 22a6.3 6.3 0 0 1-3.524-1.07A6.329 6.329 0 0 1 10.48 9.405v3.499a2.895 2.895 0 1 0 2.017 2.769V2h3.445v.44q.018.198.052.393a4.79 4.79 0 0 0 4.72 3.957z" /></svg> : <Instagram aria-hidden="true" size={20} />}
      </span>
      <span className={styles.caption}>{reference ? reference.title : "Add reference"}</span>
    </button>
    {reference && <button type="button" aria-label="Remove reference" onClick={onClear} className={styles.remove}><X size={12} /></button>}
    {open && <div ref={menu} id={id} role="dialog" aria-label="Add reference options" className={styles.popup} onKeyDown={event => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const buttons = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>("button") || []);
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
      event.preventDefault(); buttons[(index + (event.key === "ArrowDown" ? 1 : buttons.length - 1)) % buttons.length]?.focus();
    }}>
      {linkForm ? <div className={styles.linkForm}>
        <label htmlFor={`${id}-url`}>Add TikTok or Instagram link</label>
        <input ref={linkInput} id={`${id}-url`} type="url" value={url} onChange={event => setUrl(event.target.value)} placeholder="https://www.instagram.com/reel/…" onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); saveLink(); } }} />
        <div><button type="button" onClick={() => setLinkForm(false)}>Back</button><button type="button" onClick={saveLink}>Add reference</button></div>
      </div> : <>
        <button type="button" className={styles.option} onClick={() => setLinkForm(true)}><span className={styles.circle}><Link2 size={20} /></span><span>Add TikTok<br />or Instagram link</span></button>
        <div className={styles.divider} />
        <button type="button" className={styles.option} onClick={() => input.current?.click()}><span className={styles.circle}><Upload size={20} /></span><span>Upload or select file</span></button>
      </>}
      {error && <p role="alert" className={styles.error}>{error}</p>}
    </div>}
    {!open && error && <p role="alert" className={styles.error}>{error}</p>}
  </div>;
}

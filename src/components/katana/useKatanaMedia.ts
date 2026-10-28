"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type KatanaAsset = { id: string; name: string; url: string; kind: "video" | "image"; createdAt: number; usedAt: number; source: "upload" | "generation"; file: File };
type StoredAsset = Omit<KatanaAsset, "url">;
const VIDEO = ["video/mp4", "video/quicktime", "video/webm"];
const IMAGE = ["image/png", "image/jpeg", "image/webp"];

function openLibrary() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("higgsfield-katana-media", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("assets", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function useKatanaMedia() {
  const [assets, setAssets] = useState<KatanaAsset[]>([]);
  const [reference, setReference] = useState<KatanaAsset | null>(null);
  const [images, setImages] = useState<KatanaAsset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [storageNotice, setStorageNotice] = useState<string | null>(null);
  const urls = useRef(new Set<string>());
  const database = useRef<IDBDatabase | null>(null);

  useEffect(() => {
    let active = true;
    openLibrary().then(db => {
      if (!active) { db.close(); return; }
      database.current = db;
      const request = db.transaction("assets").objectStore("assets").getAll();
      request.onsuccess = () => {
        if (!active) return;
        const restored = (request.result as StoredAsset[]).map(item => {
          const url = URL.createObjectURL(item.file); urls.current.add(url);
          return { ...item, url };
        });
        setAssets(current => [...current, ...restored.filter(item => !current.some(existing => existing.id === item.id))]);
      };
      request.onerror = () => setStorageNotice("Saved media could not be restored. You can still upload files.");
    }).catch(() => { if (active) setStorageNotice("Media is available for this visit only; browser storage is unavailable."); });
    const live = urls.current;
    return () => { active = false; database.current?.close(); live.forEach(url => URL.revokeObjectURL(url)); live.clear(); };
  }, []);

  const persist = (item: KatanaAsset) => {
    if (!database.current) { setStorageNotice("Media is available for this visit only until browser storage is ready."); return; }
    const { url: _url, ...stored } = item;
    try {
      const transaction = database.current.transaction("assets", "readwrite");
      transaction.objectStore("assets").put(stored);
      transaction.onerror = () => setStorageNotice("Browser storage is full or unavailable. New media is available for this visit only.");
    } catch { setStorageNotice("Media is available for this visit only; browser storage is unavailable."); }
  };

  const select = (item: KatanaAsset) => {
    const used = { ...item, usedAt: Date.now() };
    setAssets(current => current.map(asset => asset.id === item.id ? used : asset));
    persist(used);
    if (item.kind === "video") setReference(used);
    else setImages(current => current.some(asset => asset.id === item.id) ? current : [...current, used]);
    setError(null);
  };

  const upload = (files: FileList | File[], kind: "video" | "image") => {
    const picked = Array.from(files);
    const allowed = kind === "video" ? VIDEO : IMAGE;
    const valid = picked.filter(file => allowed.includes(file.type) && file.size > 0);
    const chosen = kind === "video" ? valid.slice(0, 1) : valid;
    const added = chosen.map(file => {
      const url = URL.createObjectURL(file); urls.current.add(url);
      const asset: KatanaAsset = { id: crypto.randomUUID(), name: file.name, url, kind, createdAt: Date.now(), usedAt: Date.now(), source: "upload", file };
      persist(asset);
      return asset;
    });
    setAssets(current => [...current, ...added]);
    if (kind === "video" && added[0]) setReference(added[0]);
    if (kind === "image") setImages(current => [...current, ...added]);
    setError(valid.length !== picked.length ? (kind === "video" ? "Choose a non-empty MP4, MOV or WebM video." : "Choose non-empty PNG, JPG or WebP images.") : null);
    return added.length > 0;
  };

  const clearReference = useCallback(() => setReference(null), []);
  const removeImage = (id: string) => setImages(current => current.filter(item => item.id !== id));
  return { assets, reference, images, error, storageNotice, select, upload, clearReference, removeImage };
}

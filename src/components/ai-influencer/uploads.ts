"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type UploadKind = "image" | "video";
export type UploadedFile = { id: string; file: File; url: string; kind: UploadKind };

const LIMITS: Record<UploadKind, { types: string[]; maxBytes: number; label: string }> = {
  image: { types: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"], maxBytes: 20 * 1024 * 1024, label: "JPG, PNG, WEBP or HEIC up to 20 MB" },
  video: { types: ["video/mp4", "video/quicktime", "video/webm"], maxBytes: 200 * 1024 * 1024, label: "MP4, MOV or WEBM up to 200 MB" },
};

export const ACCEPT: Record<UploadKind, string> = {
  image: LIMITS.image.types.join(","),
  video: LIMITS.video.types.join(","),
};

function videoDuration(url: string) {
  return new Promise<number>((resolve, reject) => {
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.onloadedmetadata = () => resolve(probe.duration);
    probe.onerror = () => reject(new Error("unreadable"));
    probe.src = url;
  });
}

type Options = { kind: UploadKind; max: number; minSeconds?: number; maxSeconds?: number };

/** A validated list of local files with object-URL previews; revokes URLs it no longer needs. */
export function useUploads({ kind, max, minSeconds, maxSeconds }: Options) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const live = useRef<UploadedFile[]>([]);
  live.current = files;

  useEffect(() => () => live.current.forEach((f) => URL.revokeObjectURL(f.url)), []);

  const validate = useCallback(async (file: File) => {
    const limit = LIMITS[kind];
    if (!limit.types.includes(file.type)) return `Unsupported file. Use ${limit.label}.`;
    if (file.size > limit.maxBytes) return `File is too large. Use ${limit.label}.`;
    if (kind === "video" && (minSeconds || maxSeconds)) {
      const url = URL.createObjectURL(file);
      try {
        const seconds = await videoDuration(url);
        if ((minSeconds && seconds < minSeconds) || (maxSeconds && seconds > maxSeconds))
          return `Video duration must be ${minSeconds} to ${maxSeconds} seconds.`;
      } catch {
        return "This video could not be read.";
      } finally {
        URL.revokeObjectURL(url);
      }
    }
    return null;
  }, [kind, minSeconds, maxSeconds]);

  /** Adds files; with replace=true the list is swapped (single-slot pickers). */
  const add = useCallback(async (list: FileList | File[], replace = false) => {
    const incoming = Array.from(list);
    if (!incoming.length) return;
    setBusy(true);
    setError(null);
    const accepted: UploadedFile[] = [];
    for (const file of incoming) {
      const problem = await validate(file);
      if (problem) { setError(problem); continue; }
      accepted.push({ id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`, file, url: URL.createObjectURL(file), kind });
    }
    setFiles((current) => {
      const base = replace ? [] : current;
      if (replace) current.forEach((f) => URL.revokeObjectURL(f.url));
      const room = Math.max(0, max - base.length);
      if (accepted.length > room) setError(`You can add up to ${max} ${kind === "image" ? "images" : "videos"}.`);
      accepted.slice(room).forEach((f) => URL.revokeObjectURL(f.url));
      return [...base, ...accepted.slice(0, room)];
    });
    setBusy(false);
  }, [kind, max, validate]);

  const remove = useCallback((id: string) => {
    setFiles((current) => {
      current.filter((f) => f.id === id).forEach((f) => URL.revokeObjectURL(f.url));
      return current.filter((f) => f.id !== id);
    });
    setError(null);
  }, []);

  const clear = useCallback(() => {
    setFiles((current) => { current.forEach((f) => URL.revokeObjectURL(f.url)); return []; });
    setError(null);
  }, []);

  return { files, error, busy, add, remove, clear, setError };
}

export type Uploads = ReturnType<typeof useUploads>;

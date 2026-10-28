"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { VideoSelection } from "../../assets/preset-videos";
import { CloseIcon, VideoPreviewDialog } from "../../assets/video-preview-dialog";
import { ExpandIcon } from "../../shared/icons";
import { pendingToolVideo } from "../../assets/video-tool-handoff";

export function UploadCircle({ children }: { children: ReactNode }) {
  return (
    <span
      className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[.04] text-white/65 backdrop-blur-sm"
      style={{ boxShadow: "0 128.852px 36.007px transparent, 0 82.429px 33.031px rgba(0,0,0,.01), 0 46.422px 27.972px rgba(0,0,0,.05), 0 20.533px 20.533px rgba(0,0,0,.09), 0 5.059px 11.308px rgba(0,0,0,.1), inset 0 -.298px 5.356px rgba(185,185,185,.35)" }}
    >
      {children}
    </span>
  );
}

export type VideoSource = VideoSelection | null;

/** Keeps a selected local video alive until it is replaced or the form unmounts. */
export function useVideoSource() {
  const [video, setVideo] = useState<VideoSource>(pendingToolVideo);

  useEffect(() => {
    return () => {
      if (video?.url.startsWith("blob:")) URL.revokeObjectURL(video.url);
    };
  }, [video]);

  const select = (files: FileList) => {
    const file = files[0];
    if (file && file.type.startsWith("video/")) {
      setVideo({ name: file.name, url: URL.createObjectURL(file) });
    }
  };

  return { video, select, set: setVideo, clear: () => setVideo(null) };
}

export function VideoSourceArea({
  video,
  label,
  duration,
  onOpen,
  onRemove,
  compact = false,
  emphasizeLabel = false,
  wrapLabel = false,
  accent = false,
}: {
  video: VideoSource;
  label: string;
  duration: string;
  onOpen: (anchor: DOMRect) => void;
  onRemove: () => void;
  compact?: boolean;
  emphasizeLabel?: boolean;
  wrapLabel?: boolean;
  accent?: boolean;
}) {
  const [preview, setPreview] = useState(false);
  const [stage, setStage] = useState({ width: 300, height: 160 });
  const stageRef = useRef<HTMLDivElement>(null);
  const crop = video?.crop ?? { x: 0, y: 0, width: 1, height: 1 };
  useEffect(() => { setPreview(false); }, [video?.url]);
  useEffect(() => {
    if (!stageRef.current) return;
    const observer = new ResizeObserver(() => {
      const element = stageRef.current;
      if (element) setStage({ width: element.clientWidth, height: element.clientHeight });
    });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={stageRef} className={`group relative flex shrink-0 flex-col items-center justify-center rounded-xl bg-white/[.05] p-4 ${accent && !video ? "border border-lime" : ""} ${compact ? "aspect-[3/4] w-full" : "h-40"}`}>
      {video && (
        <div className="relative -rotate-[4deg] rounded-xl border border-white/70 shadow-lg" style={{ width: stage.width * .85, height: stage.height * .85 }}>
          <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
            <video
              key={`${video.url}:${video.start ?? 0}:${video.end ?? ""}`}
              src={video.url}
              poster={video.poster}
              muted
              loop
              autoPlay
              playsInline
              onLoadedMetadata={(event) => {
                if (video.start) event.currentTarget.currentTime = video.start;
              }}
              onTimeUpdate={(event) => {
                if (video.end && event.currentTarget.currentTime >= video.end) {
                  event.currentTarget.currentTime = video.start ?? 0;
                }
              }}
              className="absolute max-w-none object-cover"
              style={{ width: `${100 / crop.width}%`, height: `${100 / crop.height}%`, left: `${-crop.x / crop.width * 100}%`, top: `${-crop.y / crop.height * 100}%` }}
            />
          </div>
          <button type="button" aria-label="Expand selected video" onClick={() => setPreview(true)} className="absolute inset-0 z-10 grid place-items-center rounded-[inherit] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100"><span className="grid size-6 rotate-[4deg] place-items-center rounded-full bg-[#333739]/60 text-white/90 backdrop-blur-sm hover:bg-[#55595b]/75"><ExpandIcon /></span></button>
          <button type="button" aria-label="Remove selected video" onClick={onRemove} className="absolute -right-2.5 -top-2.5 z-20 grid size-7 rotate-[4deg] place-items-center rounded-full bg-[#525557]/90 text-white/75 opacity-0 backdrop-blur-sm transition-opacity hover:bg-[#66696b] hover:text-white group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100"><CloseIcon /></button>
        </div>
      )}
      {!video && <span aria-hidden="true" className="pointer-events-none absolute inset-1 rounded-lg border border-dashed border-white/10" />}
      {!video && <button
        type="button"
        aria-label={label}
        onClick={(event) => onOpen(event.currentTarget.getBoundingClientRect())}
        className="absolute inset-0 z-10 rounded-[inherit]"
      />}
      {!video && <><UploadCircle>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M2 5.75A1.75 1.75 0 0 1 3.75 4h10.5A1.75 1.75 0 0 1 16 5.75v3.037l4.191-2.096A1.25 1.25 0 0 1 22 7.809v8.382a1.25 1.25 0 0 1-1.809 1.118L16 15.214v3.036A1.75 1.75 0 0 1 14.25 20H3.75A1.75 1.75 0 0 1 2 18.25V5.75Zm14 7.787 4.5 2.25V8.214l-4.5 2.25v3.073Z" />
        </svg>
      </UploadCircle>
        <div className="relative mt-3 text-center text-sm font-medium text-white">
          <p className={`max-w-[245px] ${wrapLabel ? "" : "truncate"} ${emphasizeLabel ? "font-semibold" : ""}`}>{label}</p>
          <p className="mt-0.5 text-xs text-white/45">{duration}</p>
        </div></>}
      {preview && video && <VideoPreviewDialog preset={video} onClose={() => setPreview(false)} />}
    </div>
  );
}

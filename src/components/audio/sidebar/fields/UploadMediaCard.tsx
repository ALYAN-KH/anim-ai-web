"use client";
import { useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import { formatBytes } from "../../lib/format";
import { CloseIcon } from "../../ui/Icons";

interface UploadMediaCardProps {
  files: File[];
  max: number;
  accept: string;
  title: string;
  hint: string;
  badge?: string;
  icons: ReactNode;
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  onOpen?: (anchor: DOMRect) => void;
}

export function UploadMediaCard({
  files,
  max,
  accept,
  title,
  hint,
  badge,
  icons,
  onAdd,
  onRemove,
  onOpen,
}: UploadMediaCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const full = files.length >= max;

  const pick = () => { if (onOpen && cardRef.current) onOpen(cardRef.current.getBoundingClientRect()); else inputRef.current?.click(); };

  const handleList = (list: FileList | null) => {
    if (list && list.length > 0) onAdd(Array.from(list));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    handleList(event.dataTransfer.files);
  };

  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {!full && (
        <div
          ref={cardRef}
          role="button"
          tabIndex={0}
          aria-label={title}
          onClick={pick}
          onKeyDown={handleKey}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-4 pb-5 pt-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
            dragging
              ? "border-white/30 bg-white/10"
              : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
          }`}
        >
          <div className="flex items-start">{icons}</div>
          <div className="flex w-full flex-col items-center gap-1 text-center">
            <span className="text-base font-medium text-white">{title}</span>
            <span className="w-full truncate text-sm font-medium text-white/50">{hint}</span>
          </div>
          {badge && (
            <span className="pointer-events-none absolute right-1.5 top-1.5 rounded-xl bg-white/5 px-2 py-1 text-[11px] font-medium text-white/50">
              {badge}
            </span>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={max > 1}
        className="hidden"
        onChange={(event) => {
          handleList(event.target.files);
          event.target.value = "";
        }}
      />
      {files.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-white">{file.name}</span>
                <span className="block text-xs text-white/50">{formatBytes(file.size)}</span>
              </span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => onRemove(index)}
                className="grid size-7 shrink-0 place-items-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <CloseIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

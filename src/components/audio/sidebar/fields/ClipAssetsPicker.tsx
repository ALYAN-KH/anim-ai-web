"use client";
import { AssetsPicker, type AssetsPickerTabId } from "../../../video-studio/assets/assets-picker";

const CLIP_TABS: readonly AssetsPickerTabId[] = ["uploads", "videos", "liked"];

interface ClipAssetsPickerProps {
  anchor: DOMRect;
  accept: string;
  onClose: () => void;
  onFiles: (files: File[]) => void;
}

// The same assets window the video studio uses, limited to clip sources.
export function ClipAssetsPicker({ anchor, accept, onClose, onFiles }: ClipAssetsPickerProps) {
  return (
    <AssetsPicker
      anchor={anchor}
      onClose={onClose}
      tabs={CLIP_TABS}
      initialTab="uploads"
      accept={accept}
      multiple={false}
      motionUploadStyle
      pickerWidth={820}
      onFilesSelected={(files) => onFiles(Array.from(files))}
    />
  );
}

import { ImageIcon, MusicIcon, UploadIcon, VideoIcon, VideoPlusIcon, VoiceBarsIcon, WaveformIcon } from "../../ui/Icons";

export const bubbleClass =
  "flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2a2c2f] text-white shadow-[0_5px_6px_rgba(0,0,0,0.1),0_20px_10px_rgba(0,0,0,0.09),inset_0_-0.3px_5px_rgba(185,185,185,0.35)]";

export function TtsUploadIcons() {
  return (
    <>
      <span className={`${bubbleClass} -mr-2`}>
        <WaveformIcon className="size-4 -rotate-3" />
      </span>
      <span className={`${bubbleClass} -mr-2`}>
        <MusicIcon className="size-4" />
      </span>
      <span className={bubbleClass}>
        <ImageIcon className="size-4 rotate-3" />
      </span>
    </>
  );
}

export function ClipUploadIcons() {
  return (
    <>
      <span className={bubbleClass}>
        <VideoPlusIcon className="size-4" />
      </span>
      <span className={`${bubbleClass} -ml-2`}>
        <UploadIcon className="size-5" />
      </span>
    </>
  );
}

export function VideoUploadIcons() {
  return (
    <span className={bubbleClass}>
      <VideoIcon className="size-4" />
    </span>
  );
}

export function VoicePickIcon() {
  return (
    <span className={bubbleClass}>
      <VoiceBarsIcon className="size-10" />
    </span>
  );
}

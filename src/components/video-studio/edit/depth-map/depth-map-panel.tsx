"use client";
import { useDepthMap } from "./use-depth-map";

import { createPortal } from "react-dom";
import { ChangeButton } from "../../shared/change-button";
import { ToolToggle } from "../../shared/tool-toggle";
import { ChevronIcon, CloseIcon, VideoPlusIcon } from "../../shared/media-icons";
import { MediaPicker } from "../../shared/media-picker";
import { COLOR_MAPS, COLOR_MAP_BASE, CheckIcon, DEFAULT_FRAMES, DepthMapPanelProps, FIELD_CLASS, HERO_POSTER, HERO_VIDEO, InfoIcon, POPOVER_CLASS, RESOLUTIONS } from "./settings-helpers";
export { type DepthMapColorMap, type DepthMapPanelProps, type DepthMapParams, type DepthMapResolution } from "./settings-helpers";

export function DepthMapPanel({
  onGenerate,
  onChangeTool,
}: DepthMapPanelProps) {
  const {
    titleId,
    colorLabelId,
    radioName,
    toast,
    previewUrl,
    duration,
    setDuration,
    error,
    dragging,
    pickerOpen,
    setPickerOpen,
    anchor,
    colorMap,
    setColorMap,
    resolution,
    framesText,
    setFramesText,
    sideBySide,
    setSideBySide,
    resOpen,
    resPlacement,
    framesOpen,
    framesPlacement,
    dropRef,
    inputRef,
    resTriggerRef,
    resPopRef,
    optionRefs,
    framesTriggerRef,
    framesPopRef,
    framesInputRef,
    closeResolution,
    closeFrames,
    handleFile,
    removeFile,
    openPicker,
    onDragOver,
    onDragLeave,
    onDrop,
    openResolution,
    openFrames,
    chooseResolution,
    onResTriggerKeyDown,
    onOptionKeyDown,
    onFramesKeyDown,
    handleGenerate,
    resolutionLabel,
  } = useDepthMap({ onGenerate, onChangeTool });
  return (
    <section
      aria-labelledby={titleId}
      className="flex min-h-0 flex-1 flex-col gap-3 px-2 pt-2"
    >
      <figure className="relative h-[130px] w-full shrink-0 select-none overflow-hidden rounded-xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          preload="auto"
          poster={HERO_POSTER}
          src={HERO_VIDEO}
          className="pointer-events-none absolute inset-0 size-full object-cover"
        >
          Your browser does not support the video.
        </video>
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/60 ring-1 ring-inset ring-white/10" />
        <figcaption className="absolute bottom-0 left-0 z-10 w-full pb-3 pl-3 pr-1.5">
          <h2
            id={titleId}
            className="w-full truncate text-lg font-bold uppercase leading-tight tracking-wide text-[#EFFE17]"
          >
            Depth Map
          </h2>
          <p className="text-xs text-white/80">Make depth map from video</p>
        </figcaption>
        <div className="absolute right-1.5 top-1.5 z-20 flex gap-1">
          <ChangeButton onClick={onChangeTool} />
        </div>
      </figure>

      <div className="flex min-h-0 flex-1 flex-col pb-4">
        <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          <div className="shrink-0">
            <div
              ref={dropRef}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className="relative flex flex-col items-center justify-center rounded-xl bg-white/[.05] p-1"
            >
              <div
                className={`relative flex h-40 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-dashed p-4 transition motion-reduce:transition-none ${dragging ? "border-[#EFFE17]/70" : "border-white/10"
                  }`}
              >
                {previewUrl ? (
                  <>
                    <video
                      key={previewUrl}
                      src={previewUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      onLoadedMetadata={(event) =>
                        setDuration(event.currentTarget.duration)
                      }
                      className="absolute inset-0 size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      aria-label="Remove video"
                      className="absolute right-1.5 top-1.5 z-20 inline-flex size-6 items-center justify-center rounded-lg border border-white/10 bg-black/70 text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17] motion-reduce:transition-none"
                    >
                      <CloseIcon />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={openPicker}
                      aria-label="Add a video to create a depth map"
                      className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EFFE17]"
                    />
                    <div className="pointer-events-none flex w-full flex-col items-center">
                      <div
                        aria-hidden="true"
                        className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[.04] text-white/60"
                      >
                        <VideoPlusIcon className="size-4" />
                      </div>
                      <div className="mt-3 text-center">
                        <p className="whitespace-nowrap text-sm font-medium text-white">
                          Add a video to create a depth map
                        </p>
                        <p className="mt-0.5 hidden text-xs font-medium text-white/50 md:block">
                          Up to 200 MB
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {error && (
              <p role="alert" className="mt-1.5 text-xs text-red-400">
                {error}
              </p>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              className="sr-only"
              tabIndex={-1}
              onChange={(event) => {
                handleFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div
              role="radiogroup"
              aria-labelledby={colorLabelId}
              className="w-full rounded-xl border border-white/10 bg-white/[.03] p-2"
            >
              <p
                id={colorLabelId}
                className="p-1 text-sm font-medium text-white"
              >
                Color map
              </p>
              <div className="grid grid-cols-3 gap-x-3 gap-y-4 px-2 pb-1 pt-2">
                {COLOR_MAPS.map((item) => {
                  const selected = colorMap === item.value;
                  return (
                    <label
                      key={item.value}
                      className="flex cursor-pointer flex-col items-center gap-1.5"
                    >
                      <input
                        type="radio"
                        name={radioName}
                        value={item.value}
                        checked={selected}
                        onChange={() => setColorMap(item.value)}
                        className="peer sr-only"
                      />
                      <span
                        className={`aspect-[3/2] w-full overflow-hidden rounded-xl border-2 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#EFFE17] motion-reduce:transition-none ${selected ? "border-[#EFFE17]" : "border-transparent"
                          }`}
                      >
                        <img
                          alt=""
                          loading="lazy"
                          decoding="async"
                          src={`${COLOR_MAP_BASE}/${item.value}.webp`}
                          className="size-full object-cover"
                        />
                      </span>
                      <span
                        className={`text-xs font-medium ${selected ? "text-[#EFFE17]" : "text-white"
                          }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                ref={resTriggerRef}
                type="button"
                role="combobox"
                aria-label="Resolution"
                aria-expanded={resOpen}
                aria-haspopup="listbox"
                onClick={() => (resOpen ? closeResolution() : openResolution())}
                onKeyDown={onResTriggerKeyDown}
                className={FIELD_CLASS}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[11px] font-medium text-white/50">
                    Resolution
                  </span>
                  <span className="text-sm font-medium text-white">
                    {resolutionLabel}
                  </span>
                </span>
                <ChevronIcon className="shrink-0 text-white/50" />
              </button>

              <button
                ref={framesTriggerRef}
                type="button"
                aria-label="Max frames"
                aria-expanded={framesOpen}
                aria-haspopup="dialog"
                onClick={() => (framesOpen ? closeFrames() : openFrames())}
                className={FIELD_CLASS}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[11px] font-medium text-white/50">
                    Max frames
                  </span>
                  <span
                    className="text-sm font-medium text-white"
                    translate="no"
                  >
                    {framesText || DEFAULT_FRAMES}
                  </span>
                </span>
                <ChevronIcon className="shrink-0 text-white/50" />
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] p-3">
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate text-sm font-medium text-white">
                  Side by side
                </span>
                <button
                  type="button"
                  aria-label="About Side by side"
                  title="Show the original video and the depth map next to each other"
                  className="flex shrink-0 rounded-full text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17]"
                >
                  <InfoIcon />
                </button>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={sideBySide}
                aria-label="Side by side"
                onClick={() => setSideBySide((value) => !value)}
                className="flex shrink-0 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
              >
                <ToolToggle checked={sideBySide} />
              </button>
            </div>
          </div>
        </div>

        <div className="shrink-0 pt-6">
          <button
            type="button"
            onClick={handleGenerate}
            className="h-14 w-full rounded-xl bg-[radial-gradient(circle_at_center,#EFFE17_40%,#CFE000_100%)] text-base font-semibold text-black shadow-[inset_0px_-3px_rgba(0,0,0,0.43)] transition hover:opacity-80 active:scale-[.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFFE17] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1113] motion-reduce:transition-none"
          >
            Generate
          </button>
        </div>
      </div>

      {resOpen &&
        resPlacement &&
        createPortal(
          <div
            ref={resPopRef}
            role="listbox"
            aria-label="Resolution"
            style={resPlacement}
            className={`${POPOVER_CLASS} flex flex-col gap-1 p-1.5`}
          >
            {RESOLUTIONS.map((item, index) => {
              const selected = item.value === resolution;
              return (
                <button
                  key={item.value}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => chooseResolution(item.value)}
                  onKeyDown={(event) => onOptionKeyDown(event, index)}
                  className={`flex h-10 w-full items-center justify-between rounded-lg border px-3 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EFFE17] motion-reduce:transition-none ${selected
                      ? "border-[#EFFE17] bg-white/[.06]"
                      : "border-transparent hover:bg-white/[.06]"
                    }`}
                >
                  {item.label}
                  {selected && <CheckIcon className="text-[#EFFE17]" />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}

      {framesOpen &&
        framesPlacement &&
        createPortal(
          <div
            ref={framesPopRef}
            role="dialog"
            aria-label="Frames to process"
            style={framesPlacement}
            className={`${POPOVER_CLASS} p-4`}
          >
            <label
              htmlFor={`${radioName}-frames`}
              className="mb-1.5 block text-sm font-medium leading-5 text-white/60"
            >
              Frames to process
            </label>
            <input
              id={`${radioName}-frames`}
              ref={framesInputRef}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={framesText}
              onChange={(event) =>
                setFramesText(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              onKeyDown={onFramesKeyDown}
              className="h-9 w-full rounded-lg border border-white/10 bg-[#0f1113] px-3 text-sm font-medium text-white focus-visible:border-white/30 focus-visible:outline-none"
            />
          </div>,
          document.body,
        )}

      {pickerOpen && (
        <MediaPicker
          anchor={anchor}
          onClose={() => setPickerOpen(false)}
          onUploadClick={() => inputRef.current?.click()}
        />
      )}
      {toast}
    </section>
  );
}

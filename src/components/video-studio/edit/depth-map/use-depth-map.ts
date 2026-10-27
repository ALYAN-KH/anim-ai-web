"use client";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent
} from "react";
import { useToast } from "../../shared/tool-toast";
import { DEFAULT_FRAMES, DepthMapColorMap, DepthMapPanelProps, DepthMapResolution, MAX_BYTES, PickerAnchor, Placement, RESOLUTIONS, normalizeFrames, placePopover, useDismiss } from "./settings-helpers";

export function useDepthMap({
  onGenerate,
  onChangeTool,
}: DepthMapPanelProps) {
  const titleId = useId();
  const colorLabelId = useId();
  const radioName = useId();
  const { showToast, toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [anchor, setAnchor] = useState<PickerAnchor | null>(null);
  const [colorMap, setColorMap] = useState<DepthMapColorMap>("viridis");
  const [resolution, setResolution] = useState<DepthMapResolution>("auto");
  const [framesText, setFramesText] = useState(DEFAULT_FRAMES);
  const [sideBySide, setSideBySide] = useState(false);
  const [resOpen, setResOpen] = useState(false);
  const [resPlacement, setResPlacement] = useState<Placement | null>(null);
  const [framesOpen, setFramesOpen] = useState(false);
  const [framesPlacement, setFramesPlacement] = useState<Placement | null>(
    null,
  );
  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resTriggerRef = useRef<HTMLButtonElement>(null);
  const resPopRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const framesTriggerRef = useRef<HTMLButtonElement>(null);
  const framesPopRef = useRef<HTMLDivElement>(null);
  const framesInputRef = useRef<HTMLInputElement>(null);
  const closeResolution = useCallback(() => setResOpen(false), []);
  const closeFrames = useCallback(() => {
    setFramesOpen(false);
    setFramesText((text) => normalizeFrames(text));
  }, []);
  useDismiss(resOpen, closeResolution, resTriggerRef, resPopRef);
  useDismiss(framesOpen, closeFrames, framesTriggerRef, framesPopRef);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);
  useEffect(() => {
    if (!resOpen) return;
    const index = RESOLUTIONS.findIndex((item) => item.value === resolution);
    optionRefs.current[index]?.focus();
  }, [resOpen, resolution]);
  useEffect(() => {
    if (!framesOpen) return;
    framesInputRef.current?.focus();
    framesInputRef.current?.select();
  }, [framesOpen]);
  const handleFile = (next: File | undefined) => {
    setPickerOpen(false);
    if (!next) return;
    if (!next.type.startsWith("video/")) {
      setError("Please choose a video file");
      return;
    }
    if (next.size > MAX_BYTES) {
      setError("Video must be 200 MB or smaller");
      return;
    }
    setError("");
    setDuration(0);
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
  };
  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setDuration(0);
    setError("");
  };
  const openPicker = () => {
    const drop = dropRef.current;
    const aside = drop?.closest("aside");
    if (drop && aside && window.innerWidth >= 1024) {
      const dropRect = drop.getBoundingClientRect();
      const asideRect = aside.getBoundingClientRect();
      setAnchor({ top: dropRect.top, left: asideRect.right });
    } else {
      setAnchor(null);
    }
    setPickerOpen(true);
  };
  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };
  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null))
      return;
    setDragging(false);
  };
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files[0]);
  };
  const openResolution = () => {
    const trigger = resTriggerRef.current;
    if (!trigger) return;
    setResPlacement(
      placePopover(trigger, trigger.getBoundingClientRect().width, 232),
    );
    setResOpen(true);
  };
  const openFrames = () => {
    const trigger = framesTriggerRef.current;
    if (!trigger) return;
    setFramesPlacement(placePopover(trigger, 320, 96));
    setFramesOpen(true);
  };
  const chooseResolution = (value: DepthMapResolution) => {
    setResolution(value);
    setResOpen(false);
    resTriggerRef.current?.focus();
  };
  const onResTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (resOpen) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openResolution();
    }
  };
  const onOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const last = RESOLUTIONS.length - 1;
    let next = -1;
    if (event.key === "ArrowDown") next = Math.min(index + 1, last);
    else if (event.key === "ArrowUp") next = Math.max(index - 1, 0);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next < 0) return;
    event.preventDefault();
    optionRefs.current[next]?.focus();
  };
  const onFramesKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    closeFrames();
    framesTriggerRef.current?.focus();
  };
  const handleGenerate = () => {
    if (!file) {
      showToast("Video is required");
      return;
    }
    onGenerate({
      file,
      colorMap,
      resolution,
      maxFrames: parseInt(normalizeFrames(framesText), 10),
      sideBySide,
      duration,
    });
  };
  const resolutionLabel =
    RESOLUTIONS.find((item) => item.value === resolution)?.label ?? "Auto";
  return {
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
  };
}

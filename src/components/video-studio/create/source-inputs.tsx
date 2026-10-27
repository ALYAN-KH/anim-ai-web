import {
  GlassBadge,
  SourceFramesIcon,
  SourceReferencesIcon,
} from "./panel-icons";
import {
  DASHED_BORDER_BG_CLASS,
  DASHED_BORDER_VAR_CLASS,
  FRAME_SLOT_CLASS,
  OPTIONAL_PILL_CLASS,
  TAB_ACTIVE_CLASS,
  TAB_BASE_CLASS,
  TAB_INACTIVE_CLASS,
  TAB_INDICATOR_CLASS,
} from "./panel-styles";

export type InputMode = "frames" | "references";

export type FrameSlotId = "start" | "end";

export function InputModeTabs({
  value,
  onChange,
}: {
  value: InputMode;
  onChange: (mode: InputMode) => void;
}) {
  const direction = value === "frames" ? "left" : "right";
  const tabClass = (active: boolean) =>
    `${TAB_BASE_CLASS} ${active ? TAB_ACTIVE_CLASS : TAB_INACTIVE_CLASS}`;

  return (
    <div
      data-orientation="horizontal"
      data-activation-direction={direction}
      className="h-10 rounded-xl border border-white/10 bg-white/5"
    >
      <div
        data-orientation="horizontal"
        data-activation-direction={direction}
        role="tablist"
        className="relative flex h-full"
      >
        <button
          type="button"
          data-orientation="horizontal"
          aria-disabled="false"
          tabIndex={value === "frames" ? 0 : -1}
          role="tab"
          aria-selected={value === "frames"}
          id="base-ui-_r_0_"
          className={tabClass(value === "frames")}
          data-active={value === "frames" ? "" : undefined}
          data-composite-item-active={value === "frames" ? "" : undefined}
          onClick={() => onChange("frames")}
        >
          <SourceFramesIcon className="size-3.25" />
          <span>Frames</span>
        </button>
        <button
          type="button"
          data-orientation="horizontal"
          aria-disabled="false"
          tabIndex={value === "references" ? 0 : -1}
          role="tab"
          aria-selected={value === "references"}
          id="base-ui-_r_1_"
          className={tabClass(value === "references")}
          data-active={value === "references" ? "" : undefined}
          data-composite-item-active={value === "references" ? "" : undefined}
          onClick={() => onChange("references")}
        >
          <SourceReferencesIcon className="size-3.25" />
          <span>References</span>
        </button>
        <span
          data-orientation="horizontal"
          data-activation-direction={direction}
          role="presentation"
          className={`${TAB_INDICATOR_CLASS} ${value === "frames" ? "left-[3.8px]" : "left-1/2"
            }`}
        />
      </div>
    </div>
  );
}

interface FrameSlotProps {
  label: string;
  gradientId: string;
  src?: string;
  disabled?: boolean;
  onPick: () => void;
  onRemove: () => void;
}

function FrameSlot({
  label,
  gradientId,
  src,
  disabled,
  onPick,
  onRemove,
}: FrameSlotProps) {
  return (
    <div
      data-disabled={disabled ? "true" : undefined}
      className={`group relative ${disabled ? "pointer-events-none opacity-50" : ""
        }`}
    >
      <div data-state={src ? "filled" : "empty"} className={FRAME_SLOT_CLASS}>
        {src ? (
          <>
            <img
              src={src}
              alt={label}
              className="absolute inset-0 size-full rounded object-cover"
            />
            <button
              type="button"
              aria-label={`Replace ${label.toLowerCase()}`}
              onClick={onPick}
              className="absolute inset-0 z-10 rounded outline-none focus-visible:ring-1 focus-visible:ring-q-border-focus"
            />
            <button
              type="button"
              aria-label={`Remove ${label.toLowerCase()}`}
              onClick={onRemove}
              className="absolute right-1.5 top-1.5 z-20 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 outline-none backdrop-blur-sm transition-opacity hover:bg-black/80 focus-visible:opacity-100 group-hover:opacity-100"
            >
              <svg
                className="size-3.5"
                aria-hidden="true"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </>
        ) : (
          <>
            <span className={OPTIONAL_PILL_CLASS}>
              <span className="truncate">Optional</span>
            </span>
            <button
              type="button"
              onClick={onPick}
              disabled={disabled}
              className="flex size-full min-h-0 cursor-pointer flex-col items-center justify-center rounded outline-none focus-visible:ring-1 focus-visible:ring-q-border-focus"
            >
              <span className="isolate flex items-center">
                <GlassBadge kind="image" gradientId={gradientId} />
              </span>
              <div className="mt-2 text-center text-caption-m text-white-60">
                <p className="text-q-label-sm-semi-bold text-q-text-primary">
                  {label}
                </p>
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function FramesDropzone({
  start,
  end,
  onPick,
  onRemove,
}: {
  start?: string;
  end?: string;
  onPick: (slot: FrameSlotId) => void;
  onRemove: (slot: FrameSlotId) => void;
}) {
  return (
    <div className={`contents ${DASHED_BORDER_VAR_CLASS}`}>
      <div
        className="relative grid h-[168px] rounded-xl! border-0! bg-white-5 p-1 shadow-none!"
        id="form-video-dropzones"
      >
        <div className="relative grid size-full select-none grid-cols-2 gap-1">
          <FrameSlot
            label="Start frame"
            gradientId="gradient-badge-image-start"
            src={start}
            onPick={() => onPick("start")}
            onRemove={() => onRemove("start")}
          />
          <FrameSlot
            label="End frame"
            gradientId="gradient-badge-image-end"
            src={end}
            disabled={!start}
            onPick={() => onPick("end")}
            onRemove={() => onRemove("end")}
          />
        </div>
      </div>
    </div>
  );
}

export function ReferencesDropzone({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-3 self-stretch rounded-xl bg-white-5 p-1">
      <div className="relative flex h-37 flex-col items-center justify-center gap-3 self-stretch rounded-lg p-4 md:h-40">
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-lg ${DASHED_BORDER_BG_CLASS}`}
        />
        <button
          type="button"
          aria-label="Add references"
          onClick={onAdd}
          className="absolute inset-0 z-10 rounded-[inherit] outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-q-border-focus"
        />
        <span className="isolate flex items-center">
          <GlassBadge kind="image" gradientId="gradient-badge-image" />
          <GlassBadge kind="video" gradientId="gradient-badge-video" overlap />
          <GlassBadge kind="audio" gradientId="gradient-badge-audio" overlap />
        </span>
        <span className="pointer-events-none flex w-full flex-col items-center gap-1.5 text-center">
          <span className="text-center text-q-label-sm-semi-bold text-q-text-primary">
            Add references
          </span>
          <span className="text-q-label-xs-regular text-q-text-secondary">
            Up to 10 images, 5 videos, and 5 audio files
          </span>
        </span>
      </div>
    </div>
  );
}

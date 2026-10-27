import type { RefObject } from "react";
import { ChevronIcon, WanSvg } from "./panel-icons";
import { SETTING_BUTTON_CLASS, SETTING_LABEL_CLASS } from "./panel-styles";
import type { Quality } from "./settings-popovers";

export type SettingKind = "duration" | "quality";

export function ModelField({
  model,
  open,
  buttonRef,
  onToggle,
}: {
  model: string;
  open: boolean;
  buttonRef: RefObject<HTMLButtonElement>;
  onToggle: () => void;
}) {
  return (
    <div className="mt-2 [&_[data-model-select-trigger]]:min-h-13.5! [&_[data-model-select-trigger]]:rounded-xl! [&_[data-model-select-trigger]]:bg-white-5! [&_[data-model-select-trigger]]:px-3! [&_[data-model-select-trigger]]:py-2! [&_[data-model-select-trigger]:focus-visible]:ring-1 [&_[data-model-select-trigger]:focus-visible]:ring-inset [&_[data-model-select-trigger]:focus-visible]:ring-q-border-focus [&_[data-model-select-trigger]:hover]:bg-white-8! [&_[data-model-select-trigger]]:outline-none">
      <div
        className="relative w-full flex-1"
        data-tour-anchor="tour-video-model"
      >
        <button
          ref={buttonRef}
          type="button"
          aria-label="Model"
          data-model-select-trigger="true"
          onClick={onToggle}
          className="grid w-full flex-1 grid-cols-[1fr_auto] items-center gap-2 rounded-md bg-neutral-surface-subtle px-3 py-1.5 text-left transition hover:bg-white-8 active:bg-white-8"
          data-state={open ? "open" : "closed"}
        >
          <div className="grid min-w-0 grid-flow-row-dense auto-rows-min items-center text-left">
            <span className={SETTING_LABEL_CLASS}>Model</span>
            <div className="flex flex-col gap-1">
              <div className="flex min-w-0 items-center gap-1">
                <p className="min-w-0 truncate rounded-lg text-caption-l font-medium">
                  {model}
                </p>
                <span className="size-4 shrink-0 text-primary [&_svg]:size-full">
                  <WanSvg />
                </span>
              </div>
            </div>
          </div>
          <ChevronIcon className="size-4! text-text-secondary" />
        </button>
      </div>
    </div>
  );
}

export function SettingsFields({
  duration,
  quality,
  activeKind,
  onOpen,
}: {
  duration: number;
  quality: Quality;
  activeKind: SettingKind | undefined;
  onOpen: (kind: SettingKind, el: HTMLElement) => void;
}) {
  return (
    <fieldset className="mt-2 grid grid-cols-2 gap-2">
      <button
        type="button"
        translate="no"
        aria-label="Duration"
        aria-haspopup="dialog"
        aria-expanded={activeKind === "duration"}
        onClick={(e) => onOpen("duration", e.currentTarget)}
        className={SETTING_BUTTON_CLASS}
      >
        <span className="flex min-w-0 flex-col items-start gap-1 text-left">
          <span className={SETTING_LABEL_CLASS}>Duration</span>
          <span className="text-caption-l font-medium text-font-primary">
            {duration}s
          </span>
        </span>
        <ChevronIcon className="size-4! shrink-0 text-text-secondary" />
      </button>

      <button
        type="button"
        aria-label="Quality"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={activeKind === "quality"}
        onClick={(e) => onOpen("quality", e.currentTarget)}
        className={`${SETTING_BUTTON_CLASS} q-dropdown-trigger`}
      >
        <span className="flex min-w-0 flex-col items-start gap-1 text-left">
          <span className={SETTING_LABEL_CLASS}>Quality</span>
          <span className="text-caption-l font-medium text-font-primary">
            {quality}
          </span>
        </span>
        <ChevronIcon className="size-4! shrink-0 text-text-secondary" />
      </button>
    </fieldset>
  );
}

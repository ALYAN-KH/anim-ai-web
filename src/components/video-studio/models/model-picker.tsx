"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  FEATURED_MODELS,
  MODEL_GROUPS,
  type ModelBadgeKind,
  type ModelGroup,
  type ModelIconKey,
  type ModelOption,
} from "./model-data";
import {
  ChevronRightIcon,
  ClockIcon,
  InfoIcon,
  MODEL_ICONS,
  ResolutionIcon,
  SearchIcon,
  SoundIcon,
  SparkleIcon,
  VideoCameraIcon,
} from "./model-icons";

const PANEL_WIDTH = 400;
const PANEL_HEIGHT = 400;
const FLYOUT_WIDTH = 420;
const FLYOUT_GAP = 4;
const EDGE = 8;

const ICON_BOX_CLASS =
  "mr-2 flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-icon-secondary shadow-[inset_0px_2px_3px_0px_rgba(255,255,255,0.03)]";

const BADGE_CLASS: Record<ModelBadgeKind, string> = {
  TOP: "bg-gradient-to-r from-[#2d8cff] to-[#7a4dff] text-white",
  NEW: "bg-[#d6ff3a] text-black",
  EXCLUSIVE: "bg-[#d6ff3a] text-black",
  PREMIUM: "bg-gradient-to-r from-[#ffb23a] to-[#ff5fa2] text-black",
};

type IconModel = ModelOption & { icon: ModelIconKey };

function Badge({ kind }: { kind: ModelBadgeKind }) {
  return (
    <span
      className={`rounded px-1.5 text-[10px] font-extrabold italic leading-4 ${BADGE_CLASS[kind]}`}
    >
      {kind}
    </span>
  );
}

function Tag({
  label,
  icon,
}: {
  label: string;
  icon?: "resolution" | "duration";
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-sm bg-white/5 px-1 py-0.5 text-xxs-medium text-icon-secondary">
      {icon === "resolution" && <ResolutionIcon className="size-3.5" />}
      {icon === "duration" && <ClockIcon className="size-3.5" />}
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}

function ModelText({ model }: { model: ModelOption }) {
  const hasTags = model.resolution || model.duration || model.extras?.length;
  return (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs-medium text-white">{model.name}</span>
        {model.info &&
          (model.info.text ? (
            <span
              title={model.info.text}
              className="flex items-center gap-1 rounded-md bg-white/10 px-1.5 py-0.5 text-xxs text-white/70"
            >
              <InfoIcon className="size-3.5 shrink-0" />
              {model.info.text}
            </span>
          ) : (
            <InfoIcon className="size-3.5 text-icon-secondary" />
          ))}
        {model.badge && <Badge kind={model.badge} />}
        {model.sound && <SoundIcon className="size-3.5 text-icon-secondary" />}
      </div>
      {hasTags && (
        <div className="flex gap-1 overflow-hidden">
          {model.resolution && (
            <Tag
              label={model.resolution}
              icon={model.tagIcons ? "resolution" : undefined}
            />
          )}
          {model.duration && (
            <Tag
              label={model.duration}
              icon={model.tagIcons ? "duration" : undefined}
            />
          )}
          {model.extras?.map((extra) => (
            <Tag key={extra} label={extra} />
          ))}
        </div>
      )}
    </div>
  );
}

function ModelButton({
  model,
  selected,
  showIcon,
  onSelect,
  onHover,
}: {
  model: ModelOption;
  selected: boolean;
  showIcon: boolean;
  onSelect: () => void;
  onHover?: () => void;
}) {
  const Icon = model.icon ? MODEL_ICONS[model.icon] : null;
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`flex w-full cursor-pointer items-center rounded-xl py-1.5 pr-3 text-start transition-colors hover:bg-white/5 focus-visible:bg-white/5 ${showIcon ? "pl-1.5" : "pl-2"
        } ${selected ? "bg-white/10" : ""}`}
    >
      {showIcon && Icon && (
        <div className={ICON_BOX_CLASS}>
          <Icon className="size-4" />
        </div>
      )}
      <ModelText model={model} />
    </button>
  );
}

function SectionHeading({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 px-3 pb-2 pt-2 text-icon-secondary">
      {icon}
      <p className="flex-1 text-xs-medium text-icon-secondary">{children}</p>
    </div>
  );
}

export interface ModelPickerProps {
  anchor: DOMRect;
  selected: string;
  onSelect: (model: string) => void;
  onClose: () => void;
  groups?: readonly ModelGroup[];
  featured?: readonly ModelOption[];
}

export function ModelPicker({
  anchor,
  selected,
  onSelect,
  onClose,
  groups = MODEL_GROUPS,
  featured = FEATURED_MODELS,
}: ModelPickerProps) {
  const [query, setQuery] = useState("");
  const [flyout, setFlyout] = useState<{
    group: ModelGroup;
    top: number;
  } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (flyoutRef.current?.contains(target)) return;
      const insideAnchor =
        e.clientX >= anchor.left &&
        e.clientX <= anchor.right &&
        e.clientY >= anchor.top &&
        e.clientY <= anchor.bottom;
      if (insideAnchor) return;
      onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onClose, anchor]);

  const allModels = useMemo(() => {
    const map = new Map<string, IconModel>();
    featured.forEach((m) => {
      if (m.icon) map.set(m.name, m as IconModel);
    });
    groups.forEach((group) => {
      group.models.forEach((m) => {
        if (!map.has(m.name)) {
          map.set(m.name, { ...m, icon: m.icon ?? group.icon });
        }
      });
    });
    return Array.from(map.values());
  }, [featured, groups]);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? allModels.filter((m) => m.name.toLowerCase().includes(trimmed))
    : [];

  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const height = Math.min(PANEL_HEIGHT, viewportH - EDGE * 2);
  const width = Math.min(PANEL_WIDTH, viewportW - EDGE * 2);
  const left = Math.max(
    EDGE,
    Math.min(anchor.right + EDGE, viewportW - width - EDGE),
  );
  const top = Math.max(
    EDGE,
    Math.min(anchor.bottom - height, viewportH - height - EDGE),
  );

  const choose = (name: string) => {
    onSelect(name);
    onClose();
  };

  const openGroup = (group: ModelGroup, el: HTMLElement) => {
    setFlyout({ group, top: el.getBoundingClientRect().top });
  };

  const flyoutHeight = Math.min(PANEL_HEIGHT, viewportH - EDGE * 2);
  const flyoutLeft =
    left + width + FLYOUT_GAP + FLYOUT_WIDTH <= viewportW - EDGE
      ? left + width + FLYOUT_GAP
      : Math.max(EDGE, left - FLYOUT_GAP - FLYOUT_WIDTH);
  const flyoutTop = flyout
    ? Math.max(EDGE, Math.min(flyout.top - 20, viewportH - flyoutHeight - EDGE))
    : 0;

  return createPortal(
    <>
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Select model"
        style={{ left, top, width, height }}
        className="fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1b1d1f]/95 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-white/5 bg-white/5 px-3">
          <SearchIcon className="size-5 shrink-0 text-icon-secondary" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFlyout(null);
            }}
            placeholder="Search..."
            aria-label="Search models"
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-font-secondary"
          />
        </div>

        <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto pb-1">
          {trimmed ? (
            results.length > 0 ? (
              <div className="flex flex-col gap-1 p-3">
                {results.map((model) => (
                  <ModelButton
                    key={model.name}
                    model={model}
                    selected={selected === model.name}
                    showIcon
                    onSelect={() => choose(model.name)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                <p className="text-sm-medium text-font-secondary">
                  No models found
                </p>
              </div>
            )
          ) : (
            <>
              <section className="pb-1">
                <SectionHeading icon={<SparkleIcon className="size-3.5" />}>
                  Featured models
                </SectionHeading>
                <div className="flex flex-col gap-1 px-3">
                  {featured.map((model) => (
                    <ModelButton
                      key={model.name}
                      model={model}
                      selected={selected === model.name}
                      showIcon
                      onSelect={() => choose(model.name)}
                      onHover={() => setFlyout(null)}
                    />
                  ))}
                </div>
              </section>

              <section className="pb-1">
                <SectionHeading icon={<VideoCameraIcon className="size-3.5" />}>
                  All models
                </SectionHeading>
                <div className="flex flex-col gap-1 px-3">
                  {groups.map((group) => {
                    const Icon = MODEL_ICONS[group.icon];
                    if (group.direct) {
                      const model = group.models[0];
                      return (
                        <div key={group.id}>
                          <button
                            type="button"
                            onClick={() => choose(model.name)}
                            onMouseEnter={() => setFlyout(null)}
                            className={`flex w-full cursor-pointer items-center rounded-xl py-1.5 pl-1.5 pr-3 text-start transition-colors hover:bg-white/5 focus-visible:bg-white/5 ${selected === model.name ? "bg-white/10" : ""
                              }`}
                          >
                            <div className={ICON_BOX_CLASS}>
                              <Icon className="size-4.5" />
                            </div>
                            <ModelText model={model} />
                            <div className="size-5 shrink-0" />
                          </button>
                        </div>
                      );
                    }
                    const active = flyout?.group.id === group.id;
                    return (
                      <div key={group.id}>
                        <button
                          type="button"
                          onClick={(e) => openGroup(group, e.currentTarget)}
                          onMouseEnter={(e) =>
                            openGroup(group, e.currentTarget)
                          }
                          aria-haspopup="menu"
                          aria-expanded={active}
                          className={`flex w-full cursor-pointer items-center rounded-xl py-1.5 pl-1.5 pr-3 text-start transition-colors hover:bg-white/5 focus-visible:bg-white/5 ${active ? "bg-white/5" : ""
                            }`}
                        >
                          <div className={ICON_BOX_CLASS}>
                            <Icon className="size-4" />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                            <span className="text-xs-medium text-white">
                              {group.name}
                            </span>
                            <p className="text-xxs text-font-secondary">
                              {group.description}
                            </p>
                          </div>
                          <div className="size-5 shrink-0">
                            <ChevronRightIcon className="size-full text-icon-secondary" />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      {flyout && !trimmed && (
        <div
          ref={flyoutRef}
          role="menu"
          aria-label={flyout.group.name}
          style={{
            left: flyoutLeft,
            top: flyoutTop,
            width: FLYOUT_WIDTH,
            maxHeight: flyoutHeight,
          }}
          className="hide-scrollbar fixed z-50 flex max-w-[calc(100vw-16px)] flex-col gap-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#1b1d1f]/95 p-2 shadow-2xl backdrop-blur-2xl"
        >
          {flyout.group.models.map((model) => (
            <ModelButton
              key={model.name}
              model={model}
              selected={selected === model.name}
              showIcon={false}
              onSelect={() => choose(model.name)}
            />
          ))}
        </div>
      )}
    </>,
    document.body,
  );
}

"use client";
import { useState } from "react";
import { FORMAT_OPTIONS, SAMPLE_RATE_OPTIONS, TILES } from "../../config";
import { roundTo } from "../../lib/format";
import type { AdvancedSettings as Settings, AudioModel, TileKey } from "../../types";
import { ChevronIcon, RightChevronIcon, FileDownIcon, ResetIcon, SlidersIcon } from "../../ui/Icons";
import { RangeBar } from "../../ui/RangeBar";
import { MoodSlider } from "./MoodSlider";
import { SelectRow } from "./SelectRow";
import { ToggleRow } from "./ToggleRow";
import { FieldPopover } from "../../ui/FieldPopover";
import { Volume2, Gauge, SlidersHorizontal } from "lucide-react";

interface AdvancedSettingsProps {
  model: AudioModel;
  value: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onReset: () => void;
}

export function AdvancedSettings({ model, value, onChange, onReset }: AdvancedSettingsProps) {
  const [open, setOpen] = useState(false);
  const [activeTile, setActiveTile] = useState<TileKey | null>(null);
  const [tileAnchor, setTileAnchor] = useState<DOMRect | null>(null);
  const tile = TILES.find((item) => item.key === activeTile);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full shrink-0 items-center gap-2 rounded-xl p-1.5 text-left"
      >
        <SlidersIcon className="size-4 shrink-0 text-white" />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">Advanced settings</span>
        <ChevronIcon
          className={`size-4 shrink-0 text-white opacity-60 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="flex flex-col gap-2.5 rounded-xl bg-white/[0.04] p-2.5">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-xs font-medium text-white/50">{model.name} controls</span>
            <button
              type="button"
              onClick={() => {
                onReset();
                setActiveTile(null);
              }}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              <ResetIcon className="size-3.5" />
              Reset
            </button>
          </div>

          {model.expressive && (
            <>
              <RangeBar
                label="Expression intensity"
                value={value.expression}
                min={0}
                max={10}
                step={1}
                onChange={(expression) => onChange({ expression })}
              />
              <MoodSlider value={value.mood} onChange={(mood) => onChange({ mood })} />
            </>
          )}

          <div className="grid grid-cols-3 gap-2">
            {TILES.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-expanded={activeTile === item.key}
                onClick={event => { setTileAnchor(event.currentTarget.getBoundingClientRect()); setActiveTile(current => current === item.key ? null : item.key); }}
                className={`flex h-16 items-center justify-between rounded-xl px-3 text-left transition-colors ${
                  activeTile === item.key ? "bg-white/10" : "bg-white/5 hover:bg-white/[0.08]"
                }`}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="text-xs font-medium text-white/50">{item.label}</span>
                  <span className="truncate text-sm font-semibold text-white">
                    {item.format(value[item.key])}
                  </span>
                </span>
                <RightChevronIcon className="size-3.5 shrink-0 text-white/60" />
              </button>
            ))}
          </div>

          {tile && tileAnchor && (
            <FieldPopover anchor={tileAnchor} label={tile.label} onClose={() => setActiveTile(null)} width={244}>
            <div className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white/45">{tile.key === "volume" ? <Volume2 className="size-4" /> : tile.key === "speed" ? <Gauge className="size-4" /> : <SlidersHorizontal className="size-4" />}{tile.label}<span className="ml-auto text-white">{tile.format(value[tile.key])}</span></div>
            <div className="px-2 pb-2"><RangeBar compact
              label={tile.label}
              value={value[tile.key]}
              min={tile.min}
              max={tile.max}
              step={tile.step}
              format={tile.format}
              onChange={(next) =>
                onChange({ [tile.key]: roundTo(next, tile.step) } as Partial<Settings>)
              }
            /></div>
            </FieldPopover>
          )}

          <SelectRow
            label="Output format"
            value={value.format}
            options={FORMAT_OPTIONS}
            onChange={(format) => onChange({ format })}
            icon={<FileDownIcon className="size-4" />}
          />
          <SelectRow
            label="Sample Rate"
            value={value.sampleRate}
            options={SAMPLE_RATE_OPTIONS}
            onChange={(sampleRate) => onChange({ sampleRate })}
          />
          <ToggleRow
            label="Save settings"
            checked={value.saveSettings}
            onChange={(saveSettings) => onChange({ saveSettings })}
            muted
          />
        </div>
      )}
    </div>
  );
}

"use client";

import { type ReactNode } from "react";
import { BORDER, LIME, Row, SevenRow, Tag } from "./plan-data";
import { Check, Cross, GenjutsuIcon, InfoBtn, Lock } from "./plan-icons";

export function Label({ text, info }: { text: string; info?: boolean }) {
  if (!info) return <>{text}</>;
  const w = text.split(" ");
  const tail = w.splice(-2).join(" ");
  return (
    <>
      {w.length > 0 && `${w.join(" ")} `}
      <span className="whitespace-nowrap">
        {tail}
        <InfoBtn />
      </span>
    </>
  );
}

export function Chip({ t, k, round = "rounded-md" }: Tag & { round?: string }) {
  if (k === "new") {
    return (
      <span className="relative flex h-4 shrink-0 items-center justify-center overflow-hidden rounded border border-white/5 px-1">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background:
              "radial-gradient(55% 95% at 73% 50%, rgba(239,29,186,0.6) 0%, rgba(237,21,114,0) 100%), radial-gradient(25% 42% at 85% 37%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%), radial-gradient(33% 70% at 12% 76%, rgba(176,29,239,0.6) 0%, rgba(206,25,176,0.3) 50%, rgba(237,21,114,0) 100%), linear-gradient(90deg, rgb(255,0,91) 0%, rgb(255,0,91) 100%)",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_-2px_2px_0_rgba(255,255,255,0.4),inset_0_2px_2px_0_rgba(255,255,255,0.4)]"
        />
        <span
          className="relative whitespace-nowrap text-[10px] font-semibold leading-[14px]"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.8))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "#fff",
          }}
        >
          {t}
        </span>
      </span>
    );
  }
  const tone =
    k === "lime"
      ? "text-black"
      : k === "white"
        ? "bg-white text-black"
        : k === "off"
          ? "bg-white/5 text-white/30"
          : "bg-white/10 text-white";
  return (
    <span
      className={`min-w-[18px] whitespace-nowrap px-1 py-0.5 text-center text-[10px] font-semibold uppercase leading-[14px] tracking-[-0.3px] ${round} ${tone}`}
      style={k === "lime" ? { background: LIME } : undefined}
    >
      {t}
    </span>
  );
}

export function FeatList({ rows, round }: { rows: Row[]; round?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {rows.map((r) => (
        <div key={r.label} className="flex w-full items-center gap-1">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {r.on ? <Check /> : <Cross />}
            <span
              className={`text-[12px] font-medium leading-[18px] ${r.on ? "text-white" : "text-white/30"}`}
            >
              <Label text={r.label} info={r.info} />
            </span>
          </div>
          {r.tags?.map((t) => (
            <Chip key={t.t} {...t} round={round} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SevenDay({ rows }: { rows: SevenRow[] }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white/5 px-3 pb-1 pt-3 ${BORDER}`}
    >
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Lock />
          <span className="font-grotesk text-sm font-bold uppercase leading-5 tracking-[-0.035rem] text-white">
            7-Day Unlimited
          </span>
        </div>
        <button
          type="button"
          className="text-xs font-medium leading-4 text-white/40 underline decoration-dotted"
        >
          Learn more
        </button>
      </div>
      <div className="flex flex-col">
        {rows.map((r, i) => {
          if (r.gen) {
            const on = r.on;
            return (
              <div
                key={r.label}
                className={`relative flex min-h-[36px] w-full items-center gap-1.5 py-2.5 ${on
                    ? "before:pointer-events-none before:absolute before:inset-y-0 before:-inset-x-1.5 before:rounded-md before:bg-[rgba(209,254,23,0.05)]"
                    : ""
                  }`}
              >
                {on ? (
                  <GenjutsuIcon cls="text-[#D1FE17]" />
                ) : (
                  <Cross cls="text-white/30" />
                )}
                <span
                  className={`min-w-0 flex-1 text-xs leading-4 ${on ? "font-medium" : "font-normal text-white/30"}`}
                  style={on ? { color: LIME } : undefined}
                >
                  {r.label}
                </span>
                <div className="flex shrink-0 items-center gap-1">
                  {r.tags?.map((t) => (
                    <span
                      key={t.t}
                      className={`whitespace-nowrap rounded px-1 text-[0.625rem] font-semibold leading-[14px] tracking-[0.0125rem] ${t.k === "lime"
                          ? "text-black"
                          : t.k === "off"
                            ? "bg-white/10 text-white/50"
                            : "bg-white/20 text-white"
                        }`}
                      style={t.k === "lime" ? { background: LIME } : undefined}
                    >
                      {t.t}
                    </span>
                  ))}
                </div>
              </div>
            );
          }
          const border = i < rows.length - 1 ? "border-b border-white/5" : "";
          return (
            <div
              key={r.label}
              className={`flex items-center gap-1.5 py-2.5 ${border}`}
            >
              {r.on ? <Check /> : <Cross />}
              <span
                className={`flex-1 text-xs font-medium ${r.on ? "text-white" : "text-white/40"}`}
              >
                <Label text={r.label} info={r.info} />
              </span>
              {r.tags && (
                <div className="flex items-center gap-1">
                  {r.tags.map((t) => (
                    <Chip key={t.t} {...t} round="rounded" />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const Skewed = ({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <p
    className={`inline-block -skew-x-12 whitespace-nowrap rounded-sm px-1.5 font-grotesk text-xs font-bold uppercase ${className}`}
    style={style}
  >
    {children}
  </p>
);

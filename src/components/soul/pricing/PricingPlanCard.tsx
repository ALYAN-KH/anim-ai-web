"use client";

import { useState } from "react";
import { BORDER, BTN, BTN_BG, FEATS, FRAME, Id, META, PINK, PRICE, ROWS365, SEVEN, STEPS, SURFACE, TEAM, fmt } from "./plan-data";
import { FeatList, SevenDay, Skewed } from "./plan-features";
import { Check, Diamond, SeedIcon, Sparkle } from "./plan-icons";
import { Slider } from "./plan-slider";
export { type PricingPlanId } from "./plan-data";

export function PricingPlanCard({
  id,
  annual,
  onToggle,
  onGetPlan,
}: {
  id: Id;
  annual: boolean;
  onToggle: () => void;
  onGetPlan: () => void;
}) {
  const m = META[id];
  const p = PRICE[id];
  const steps = STEPS[id];
  const [si, setSi] = useState(0);
  const [seats, setSeats] = useState(2);

  const isTeam = id === "team";
  const hl = id === "max" || isTeam;
  const credits = isTeam ? seats * 1000 : steps ? steps[si] : 120;
  const now = annual ? p.a : p.m;
  const btn = BTN[id];

  const bold = (s: string) => <span className="font-bold">{s}</span>;
  const dotted = "underline decoration-dotted underline-offset-2";

  return (
    <div className="flex h-full w-full flex-col md:w-auto">
      <div
        className={`relative flex h-full flex-col rounded-2xl p-0.5 transition-all duration-500 ease-out ${hl ? "" : "border border-transparent"}`}
        style={FRAME[id] ? { background: FRAME[id] } : undefined}
      >
        {id === "max" && (
          <div className="flex h-8 items-center justify-center gap-1 pb-0.5 font-grotesk text-xs font-bold uppercase text-white">
            <Diamond />
            <span>Most popular</span>
          </div>
        )}
        {isTeam && (
          <div className="flex h-[34px] w-full items-center justify-center gap-1.5 rounded-t-[14px] px-4 py-2 font-grotesk text-xs font-bold uppercase text-white">
            <Diamond size={14} />
            <span>Best value</span>
          </div>
        )}
        {!hl && <div className="hidden h-8 xl:block" />}

        <div
          className={`relative flex flex-1 flex-col overflow-hidden rounded-2xl ${id === "pro" ? "" : `border ${BORDER}`}`}
          style={{ background: SURFACE[id] }}
        >
          <div className="flex flex-col gap-3 px-4 pt-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {isTeam ? (
                  <span className="text-2xl font-semibold leading-7 tracking-[-0.4px] text-white">
                    {m.name}
                  </span>
                ) : (
                  <span className="font-grotesk text-2xl font-bold uppercase tracking-[-0.24px] text-white">
                    {m.name}
                  </span>
                )}
                {m.off && (
                  <Skewed className="text-white" style={{ background: PINK }}>
                    {m.off}
                  </Skewed>
                )}
                {m.seed && (
                  <Skewed
                    className="text-white"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, rgb(50,89,180) 0%, rgb(60,140,255) 50%, rgb(0,200,210) 75%, rgb(120,201,230) 100%)",
                    }}
                  >
                    <span className="inline-flex items-center gap-1 leading-4">
                      <SeedIcon />
                      Seedance 2.0
                    </span>
                  </Skewed>
                )}
              </div>
              <p className="text-xs text-white/50">{m.sub}</p>
            </div>

            <div className="flex flex-col gap-0.5">
              {isTeam ? (
                <div className="flex flex-col gap-2 rounded-xl bg-white/5 p-3">
                  <div className="flex items-center gap-1 text-white">
                    <Sparkle size={20} />
                    <span className="h-5 text-sm font-semibold">
                      {fmt(credits)} credits in total/mo
                    </span>
                  </div>
                  <ul className="flex flex-col pl-6 text-xs text-white/50">
                    <li>{bold("= 1,000")} credits per seat/mo</li>
                    <li>
                      {bold(`= ${fmt(seats * 500)}`)} Nano Banana Pro images
                    </li>
                    <li>
                      {bold(`~ ${fmt(Math.floor(credits / 15))}`)}{" "}
                      <button
                        type="button"
                        className={`inline cursor-help text-left ${dotted}`}
                      >
                        Seedance 2.5 videos
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div
                  className={`flex h-[140px] flex-col justify-between rounded-xl border bg-white/5 p-3 ${BORDER}`}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-white">
                      <Sparkle />
                      <span className="h-5 text-sm font-semibold">
                        {fmt(credits)} credits/mo.
                      </span>
                    </div>
                    <div className="flex flex-col">
                      {id === "basic" ? (
                        <>
                          <div className="pl-6 text-xs text-white/50">
                            {bold("= 60")} Nano Banana Pro Generations
                          </div>
                          <div className="pl-6 text-xs text-white/50">
                            {bold("~ 7")} Seedance 2.0 Fast videos
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="pl-6 text-xs text-white/50">
                            {bold(`= ${fmt(credits / 2)}`)} Nano Banana Pro
                            Generations
                          </div>
                          <div className="pl-6 text-xs text-white/50">
                            <span className={dotted}>
                              <button
                                type="button"
                                className="inline cursor-help text-left"
                              >
                                ~ {fmt(Math.floor(credits / 15))} Seedance 2.5
                                videos
                              </button>
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {id === "basic" ? (
                    <div className="flex items-center justify-center gap-1 rounded-lg bg-white/5 p-2">
                      <Check cls="!h-5 !w-5 text-white/50" />
                      <span className="text-xs font-medium text-white/50">
                        Fixed amount of 120 credits/mo
                      </span>
                    </div>
                  ) : (
                    steps && <Slider steps={steps} si={si} setSi={setSi} />
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-end gap-2 font-grotesk text-[28px] font-bold uppercase leading-9 tracking-[-0.56px]">
                {id !== "basic" && annual && (
                  <span className="relative" style={{ color: PINK }}>
                    ${p.m}
                    <span
                      className="absolute left-0 right-0 top-1/2 h-0.5 -rotate-[8deg]"
                      style={{ background: PINK }}
                    />
                  </span>
                )}
                <span className="text-white">${now}</span>
                <span className="mb-1 font-sans text-xs font-normal normal-case leading-4 tracking-normal text-white/50">
                  {isTeam ? "per seat/mo" : "per month"}, billed{" "}
                  {annual ? "annually" : "monthly"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-3 pb-3 pt-4">
            <div className={`relative rounded-xl border bg-white/5 ${BORDER}`}>
              <button
                type="button"
                onClick={onGetPlan}
                className={`relative flex h-[52px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl text-sm font-semibold transition-all hover:brightness-110 ${btn.cls}`}
                style={{ background: BTN_BG[id], boxShadow: btn.shadow }}
              >
                Get Plan
              </button>
              <div className="flex w-full items-center justify-center px-3 py-2">
                <span className="text-xs text-white/50">
                  {id === "basic" ? (
                    "No difference compared to monthly"
                  ) : annual ? (
                    <>
                      <span className="font-semibold text-white">
                        Save ${p.save}
                      </span>{" "}
                      compared to monthly
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={onToggle}
                      className="underline"
                    >
                      Switch to annual and save ${p.save}
                    </button>
                  )}
                </span>
              </div>
            </div>

            {isTeam ? (
              <>
                <div
                  className={`-mt-2 flex h-[52px] w-full items-center justify-between rounded-xl border bg-white/5 px-4 pb-4 pt-3 text-sm font-semibold text-white transition-all hover:bg-white/10 md:h-12 ${BORDER}`}
                >
                  <button
                    type="button"
                    aria-label="Decrease team size"
                    disabled={seats <= 2}
                    onClick={() => setSeats((s) => Math.max(2, s - 1))}
                    className="flex h-5 w-5 items-center justify-center text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M5.625 10H14.375"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div className="flex w-[8ch] flex-col items-center pb-0.5">
                    <p className="whitespace-pre text-center text-sm font-semibold leading-5">
                      {seats} seats
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Increase team size"
                    disabled={seats >= 9}
                    onClick={() => setSeats((s) => Math.min(9, s + 1))}
                    className="flex h-5 w-5 items-center justify-center text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 5.625V14.375M5.625 10H14.375"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                {TEAM.map((g) => (
                  <div key={g.h} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold leading-4 text-white/50">
                      {g.h}
                    </span>
                    <FeatList rows={g.rows} />
                  </div>
                ))}
              </>
            ) : (
              <>
                <SevenDay rows={SEVEN[id as "basic" | "pro" | "max"]} />
                <FeatList rows={FEATS[id as "basic" | "pro" | "max"]} />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center py-1">
                    <span className="font-grotesk text-sm font-bold uppercase tracking-[-0.56px] text-white">
                      365-DAY UNLIMITED &amp; FREE GENS{" "}
                    </span>
                  </div>
                  <FeatList rows={ROWS365[id as "basic" | "pro" | "max"]} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

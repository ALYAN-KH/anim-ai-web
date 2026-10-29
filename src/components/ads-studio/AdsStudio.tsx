"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AuthDialog, type AuthMode } from "@/components/auth";
import { HeroShader } from "./HeroShader";
import { HowItWorks } from "./HowItWorks";
import { STRIP, TOOLS } from "./data";

const BADGE_ICON = "m20.35 11.844-.016-.173c-.15-1.654-1.238-4.766-4.252-4.766-2.238 0-3.927 2.187-5.419 4.116-1.19 1.544-2.221 2.868-3.356 2.868-.301-.03-.69-.18-.928-.517-.214-.306-.27-.698-.159-1.168.175-.745 1.175-1.434 2.23-2.171.579-.392 1.174-.808 1.586-1.208 1.19-1.136 1.793-1.96 1.793-3.284 0-1.325-.737-1.984-1.356-2.266-1.238-.564-3.054-.235-4.213.753-.174.157-.349.306-.508.447C4.586 5.502 3.801 6.2 2 5.666v2.148c2.388 1.043 4.395-.948 5.157-1.866.587-.603 1.206-.956 1.666-.956h.024c.206.008.38.086.508.227q.307.355.245.816c-.087.643-.761 1.395-1.999 2.218-1.452.965-3.88 2.58-4.07 4.61-.143 1.458.619 2.916 1.81 3.48 2.776 1.302 4.466-.94 6.258-3.308 1.373-1.826 2.674-3.559 4.483-3.559 1.626 0 2.229 1.333 2.229 2.172v.164l-.159.032c-3.943.69-6.093 4.343-6.093 6.028 0 1.686 1.444 3.128 3.221 3.128 2.079 0 4.65-1.756 5.062-6.695l.016-.18H22v-2.281zm-2.15 2.532c-.317 2.955-1.849 4.335-2.777 4.335-.42 0-1.007-.345-1.007-.988 0-.721 1.087-2.908 3.53-3.559l.286-.07z";

function Rule() {
  return <span aria-hidden="true" className="h-px min-w-0 flex-1 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]" />;
}

function StripSet() {
  return (
    <span className="flex shrink-0 items-center gap-2 pr-2">
      {STRIP.map(({ width, src, shadow }) => (
        <span key={src} style={{ width }} className={`h-16 shrink-0 bg-white/5 ${shadow ? "shadow-[0_2px_8px_2px_rgba(0,0,0,0.2)]" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" width={width} height={64} draggable={false} decoding="async" src={src} className="size-full select-none object-cover" />
        </span>
      ))}
    </span>
  );
}

export function AdsStudio() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const closeAuth = useCallback(() => setAuthMode(null), []);
  // Ad generation needs an account; there is no public ads endpoint, so the CTAs lead to sign-up.
  const start = () => setAuthMode("signup");
  const router = useRouter();

  return (
    <main className="relative min-h-[calc(100dvh-52px)] overflow-hidden bg-[#0d0f10] text-white">
      <div className="flex justify-center px-3 pt-4 max-md:px-5">
        <article className="flex w-full max-w-[66.75rem] flex-col items-center gap-10 pb-10 pt-8 max-md:gap-6 max-md:pb-[calc(7.5rem+env(safe-area-inset-bottom))] max-md:pt-2">
          <section aria-labelledby="ads-title" className="flex w-full flex-col items-center gap-10 max-md:gap-6">
            <div className="relative isolate flex w-full flex-col items-center gap-4">
              <HeroShader />
              <span className="relative inline-flex h-7 select-none items-center rounded-lg bg-white/[0.01] px-2 py-1 shadow-[inset_0_2px_8px_0_rgba(217,255,102,0.25)] ring-1 ring-inset ring-lime/40">
                <span className="flex items-center gap-1 px-1">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-3 shrink-0 text-lime"><path fill="currentColor" d={BADGE_ICON} /></svg>
                  <span className="font-grotesk text-[11px] font-bold uppercase tracking-[-0.04em]">Ads Studio</span>
                </span>
              </span>
              <h1 id="ads-title" style={{ backgroundImage: "linear-gradient(to bottom, #fff 14%, rgba(255,255,255,0.41))", WebkitBackgroundClip: "text" }} className="bg-clip-text text-center font-grotesk text-[clamp(2rem,5vw,3.25rem)] font-bold uppercase leading-[1.1] tracking-[-0.04em] text-transparent">Everything you need<br />to create ads that convert</h1>
              <div aria-hidden="true" className="relative h-20 w-full shrink-0 overflow-hidden [mask-image:radial-gradient(50%_120.94%_at_50%_50%,#000,transparent)] max-md:h-16">
                <div className="ads-home-strip-track absolute left-0 top-2 flex w-max max-md:top-0"><StripSet /><StripSet /></div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4 max-md:gap-2">
              <div className="flex w-full items-center gap-4 max-md:py-1.5"><Rule /><h2 className="shrink-0 text-sm font-medium leading-5 tracking-[-0.2px] text-white/60">Start with tools</h2><Rule /></div>
              <div className="flex w-full gap-2 max-md:flex-col">
                {TOOLS.map(t => (
                  <button key={t.id} type="button" data-ads-home-tool="true" aria-labelledby={`${t.id}-t`} aria-describedby={`${t.id}-d`} onClick={() => router.push(t.id === "static" ? "/ads-studio/brand-research" : "/ads-studio/ad-multiplier")} className="group relative isolate flex h-[18.5rem] min-w-0 cursor-pointer items-end justify-center overflow-hidden border border-white/10 text-center outline-none after:pointer-events-none after:absolute after:inset-0 after:shadow-[inset_0_0_24px_0_rgba(255,255,255,0.1)] focus-visible:ring-2 focus-visible:ring-lime md:flex-1 max-md:h-40 max-md:w-full max-md:text-left">
                    <video autoPlay loop muted playsInline poster={t.poster} preload="metadata" className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"><source src={t.video} type="video/mp4" /></video>
                    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
                    <span className="flex flex-col items-center gap-3 px-4 py-3 max-md:w-full max-md:flex-row max-md:p-2">
                      <span className="flex flex-col items-center gap-1 [text-shadow:0_2px_12px_rgba(0,0,0,0.4)] max-md:min-w-0 max-md:flex-1 max-md:items-start">
                        <span id={`${t.id}-t`} className="text-xl font-semibold tracking-[-0.02em] max-md:max-w-full max-md:truncate max-md:text-base max-md:font-bold">{t.title}</span>
                        <span id={`${t.id}-d`} className="text-xs font-medium text-white/80 max-md:max-w-full max-md:truncate">{t.text}</span>
                      </span>
                      <span className="rounded-full bg-lime px-4 py-1.5 text-sm font-semibold text-ink transition group-hover:brightness-95">{t.cta}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
          <HowItWorks />
        </article>
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 bg-gradient-to-b from-[rgba(6,6,7,0)] to-[#060607] to-[38%] p-4 md:hidden">
        <button type="button" onClick={start} className="pointer-events-auto flex w-full items-center gap-2 rounded-3xl border border-white/10 bg-[#121212] p-[7px] text-left outline-none focus-visible:ring-2 focus-visible:ring-lime">
          <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10"><svg viewBox="0 0 24 24" fill="none" className="size-4"><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M12 5.25V12m0 0v6.75M12 12H5.25M12 12h6.75" /></svg></span>
          <span className="min-w-0 flex-1 truncate text-base text-white/50">Create high performing ads…</span>
        </button>
      </div>
      {authMode && <AuthDialog mode={authMode} onModeChange={setAuthMode} onClose={closeAuth} />}
    </main>
  );
}

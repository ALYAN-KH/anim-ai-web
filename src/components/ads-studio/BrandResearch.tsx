"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { HeroShader } from "./HeroShader";
import { BrandKit } from "./BrandKit";

const BADGE_ICON = "m20.35 11.844-.016-.173c-.15-1.654-1.238-4.766-4.252-4.766-2.238 0-3.927 2.187-5.419 4.116-1.19 1.544-2.221 2.868-3.356 2.868-.301-.03-.69-.18-.928-.517-.214-.306-.27-.698-.159-1.168.175-.745 1.175-1.434 2.23-2.171.579-.392 1.174-.808 1.586-1.208 1.19-1.136 1.793-1.96 1.793-3.284 0-1.325-.737-1.984-1.356-2.266-1.238-.564-3.054-.235-4.213.753-.174.157-.349.306-.508.447C4.586 5.502 3.801 6.2 2 5.666v2.148c2.388 1.043 4.395-.948 5.157-1.866.587-.603 1.206-.956 1.666-.956h.024c.206.008.38.086.508.227q.307.355.245.816c-.087.643-.761 1.395-1.999 2.218-1.452.965-3.88 2.58-4.07 4.61-.143 1.458.619 2.916 1.81 3.48 2.776 1.302 4.466-.94 6.258-3.308 1.373-1.826 2.674-3.559 4.483-3.559 1.626 0 2.229 1.333 2.229 2.172v.164l-.159.032c-3.943.69-6.093 4.343-6.093 6.028 0 1.686 1.444 3.128 3.221 3.128 2.079 0 4.65-1.756 5.062-6.695l.016-.18H22v-2.281zm-2.15 2.532c-.317 2.955-1.849 4.335-2.777 4.335-.42 0-1.007-.345-1.007-.988 0-.721 1.087-2.908 3.53-3.559l.286-.07z";
const GLOBE_ICON = "M4.59772 7.8189C3.8989 9.05344 3.5 10.4801 3.5 12C3.5 14.0772 4.24511 15.9804 5.48263 17.4569L8.77446 14.165C7.18407 12.4893 5.93655 10.7647 5.18607 9.26371C4.93786 8.76728 4.7369 8.28128 4.59772 7.8189ZM7.81933 4.59748C8.28167 4.73666 8.76762 4.9376 9.264 5.18579C10.765 5.93627 12.4895 7.18378 14.1653 8.77417L17.4569 5.48263C15.9804 4.24511 14.0772 3.5 12 3.5C10.4803 3.5 9.05377 3.89881 7.81933 4.59748ZM18.521 4.41847C16.7702 2.91117 14.4915 2 12 2C6.47715 2 2 6.47715 2 12C2 14.4915 2.91117 16.7702 4.41847 18.521L3.69164 19.2479C3.39875 19.5408 3.39875 20.0156 3.69164 20.3085C3.98453 20.6014 4.45941 20.6014 4.7523 20.3085L5.47914 19.5817C7.22995 21.0889 9.50857 22 12 22C17.5228 22 22 17.5228 22 12C22 9.50857 21.0889 7.22995 19.5817 5.47914L20.3087 4.75217C20.6015 4.45928 20.6015 3.9844 20.3087 3.69151C20.0158 3.39862 19.5409 3.39862 19.248 3.69151L18.521 4.41847ZM18.5175 6.54331L15.226 9.83483C16.8164 11.5106 18.064 13.2353 18.8145 14.7363C19.0626 15.2325 19.2635 15.7183 19.4026 16.1805C20.1012 14.9461 20.5 13.5196 20.5 12C20.5 9.92287 19.7549 8.01975 18.5175 6.54331ZM16.1809 19.4024C15.7186 19.2632 15.2328 19.0623 14.7366 18.8142C13.2356 18.0637 11.5109 16.8161 9.83511 15.2257L6.54331 18.5175C8.01975 19.7549 9.92287 20.5 12 20.5C13.5198 20.5 14.9464 20.1011 16.1809 19.4024ZM10.8962 14.1647C12.4812 15.6646 14.0757 16.8067 15.4074 17.4726C16.1523 17.845 16.7763 18.0488 17.2471 18.1046C17.7286 18.1617 17.9182 18.0535 17.986 17.9857C18.0537 17.918 18.162 17.7283 18.1049 17.2468C18.0491 16.776 17.8453 16.152 17.4728 15.4071C16.807 14.0754 15.6649 12.4809 14.165 10.8959L10.8962 14.1647ZM13.1043 9.83521C11.5193 8.33534 9.92486 7.19327 8.59318 6.52743C7.84824 6.15496 7.2243 5.95115 6.75348 5.89535C6.27197 5.83829 6.08232 5.94653 6.01457 6.01428C5.94682 6.08203 5.83858 6.27168 5.89564 6.75319C5.95144 7.22401 6.15525 7.84795 6.52772 8.59289C7.19356 9.92458 8.33563 11.519 9.83549 13.104L13.1043 9.83521Z";
const SPARKLE_ICON = "M14.013 7a1 1 0 0 1 .934.641l1.344 3.494a1 1 0 0 0 .574.574l3.494 1.344a1 1 0 0 1 .641.934v.026a1 1 0 0 1-.641.934l-3.494 1.344a1 1 0 0 0-.574.574l-1.344 3.494a1 1 0 0 1-.934.641h-.026a1 1 0 0 1-.934-.641l-1.344-3.494a1 1 0 0 0-.574-.574l-3.494-1.344A1 1 0 0 1 7 14.013v-.026a1 1 0 0 1 .641-.934l3.494-1.344a1 1 0 0 0 .574-.574l1.344-3.494A1 1 0 0 1 13.987 7zM7 3c.241 0 .458.149.544.374l.697 1.81a1 1 0 0 0 .574.575l1.811.697a.583.583 0 0 1 0 1.088l-1.81.697a1 1 0 0 0-.575.574l-.697 1.811a.583.583 0 0 1-1.088 0l-.697-1.81a1 1 0 0 0-.574-.575l-1.811-.697a.583.583 0 0 1 0-1.088l1.81-.697a1 1 0 0 0 .575-.574l.697-1.811A.58.58 0 0 1 7 3";

/** Accepts "example.com", "www.example.com" or a full http(s) URL. */
function normalizeSite(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname) ? url.hostname : null;
  } catch {
    return null;
  }
}

export function BrandResearch() {
  const inputId = useId();
  const [site, setSite] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!normalizeSite(site)) { setInvalid(true); return; }
    setInvalid(false);
    setLoading(true);
    // No site-analysis API is available, so the brand kit opens empty with the website prefilled.
    window.setTimeout(() => router.push(`/ads-studio/brand-research?manual=1&site=${encodeURIComponent(site.trim())}`), 600);
  };

  if (params.get("manual") === "1") return <BrandKit key={params.get("site") ?? ""} initialSite={params.get("site") ?? ""} />;

  return (
    <div className="flex min-h-[calc(100dvh-52px)] bg-[#0d0f10] p-2 text-white">
      <main data-ads-brand-research="true" className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-[#101113]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden"><HeroShader /></div>
        <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-12 shrink-0 items-center gap-6 bg-gradient-to-b from-[#101113] via-[#101113]/80 to-transparent px-2 py-2">
          <Link href="/ads-studio" className="pointer-events-auto inline-flex h-8 items-center gap-1 rounded-lg px-2 text-base font-semibold text-white outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.5 18.25 8.25 12l6.25-6.25" /></svg>
            <span>Ads Studio</span>
          </Link>
        </header>
        <div className="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden pt-12 md:justify-center md:pb-[7.5rem]">
          <section data-ads-brand-research-start="true" className="relative flex w-[35rem] flex-col items-center gap-10 max-md:w-full max-md:gap-0">
            <div className="flex flex-col items-center gap-4">
              <span className="relative inline-flex h-7 select-none items-center rounded-lg bg-white/[0.01] px-2 py-1 shadow-[inset_0_2px_8px_0_rgba(217,255,102,0.25)] ring-1 ring-inset ring-lime/40">
                <span className="flex items-center gap-1 px-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-3 shrink-0 text-lime"><path fill="currentColor" d={BADGE_ICON} /></svg>
                  <span className="font-grotesk text-[11px] font-bold uppercase tracking-[-0.04em]">Ads Studio</span>
                </span>
              </span>
              <header className="flex flex-col items-center gap-2 text-center">
                <h1 style={{ backgroundImage: "linear-gradient(to bottom, #fff 8.9%, rgba(255,255,255,0.6) 90.2%)", WebkitBackgroundClip: "text" }} className="text-balance bg-clip-text font-grotesk text-[clamp(2rem,5vw,3.25rem)] font-bold uppercase leading-[1.1] tracking-[-0.04em] text-transparent">Enter your website</h1>
                <p className="text-base text-white/50">We&apos;ll analyze your business and generate your Brand kit</p>
              </header>
            </div>
            <div className="flex w-full flex-col items-center gap-6 px-20 max-md:gap-3 max-md:px-6 max-md:pb-16">
              <form noValidate onSubmit={submit} className="flex w-[25rem] flex-col gap-3 max-md:w-full">
                <div className={`flex h-14 w-full items-center gap-1 overflow-hidden rounded-xl border bg-[radial-gradient(80px_40px_at_88%_115%,rgba(135,135,144,0.1),transparent),radial-gradient(40px_70px_at_4%_8%,rgba(135,135,144,0.1),transparent),linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))] px-[13px] py-[9px] max-md:h-12 ${invalid ? "border-red-400/70" : "border-[rgba(188,188,188,0.3)] focus-within:border-white/60"}`}>
                  <svg aria-hidden="true" className="size-6 shrink-0 text-white/50 max-md:size-5" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d={GLOBE_ICON} fill="currentColor" /></svg>
                  <label htmlFor={inputId} className="sr-only">Website</label>
                  <input id={inputId} required type="text" inputMode="url" autoComplete="url" placeholder="www.yourwebsite.com" aria-invalid={invalid} value={site} onChange={e => { setSite(e.target.value); setInvalid(false); }} className="h-full w-full min-w-0 bg-transparent px-1.5 text-base text-white outline-none placeholder:text-white/50 max-md:text-sm" />
                </div>
                {invalid && <p role="alert" className="-mt-1 px-1 text-sm text-red-400">Enter a valid website, e.g. www.yourwebsite.com</p>}
                <button type="submit" disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-lime text-base font-semibold text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.25),inset_0_-3px_0_rgba(0,0,0,0.12)] outline-none transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-white disabled:cursor-wait disabled:opacity-80">
                  {loading
                    ? <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                    : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill="currentColor" d={SPARKLE_ICON} /></svg>}
                  <span>{loading ? "Analyzing…" : "Create my brand"}</span>
                </button>
              </form>
              <div className="flex w-full items-center gap-2 px-4" aria-hidden="true">
                <span className="h-px min-w-px flex-1 bg-white/10" />
                <span className="px-1.5 text-sm font-semibold text-white/50">or</span>
                <span className="h-px min-w-px flex-1 bg-white/10" />
              </div>
              <button type="button" onClick={() => router.push("/ads-studio/brand-research?manual=1")} className="inline-flex h-12 w-[25rem] items-center justify-center rounded-xl border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.18))] px-5 text-base font-semibold text-white shadow-[0_2px_4px_-0.5px_rgba(0,0,0,0.12),inset_0_2px_3px_rgba(255,255,255,0.05)] outline-none transition hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.26))] focus-visible:ring-2 focus-visible:ring-lime max-md:w-full">Create brand kit manually</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

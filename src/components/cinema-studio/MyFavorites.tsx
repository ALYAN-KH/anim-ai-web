"use client";
import type { CSSProperties } from "react";
import "./cinema-studio.css";
import { Sidebar } from "./Sidebar";

const SHOWCASE = "https://static.higgsfield.ai/cinematic/empty-state/";
const SHOWCASE_THUMBS = ["showcase-element-dojo.jpg", "showcase-scene.jpg", "showcase-element-lulu.png"];
const PROJECTS_IMG = "https://static.higgsfield.ai/uploads/3b2a699b75ad.webp";
const CARD_BG: CSSProperties = {
  backgroundImage: "radial-gradient(120% 120% at 50% 128%, rgba(156, 230, 243, 0.16) 0%, rgba(156, 230, 243, 0) 72%), linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03))",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 12px 20px 0px",
};

const HeartBadge = () => (
  <div aria-hidden="true" className="absolute right-1 top-1 flex items-center justify-center rounded-xl border border-white/10 p-1 backdrop-blur-lg" style={{ backgroundImage: "linear-gradient(90deg, rgba(255, 0, 91, 0.24) 0%, rgba(255, 0, 91, 0.24) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.05) 100%)" }}>
    <svg className="size-3.5 text-[#ff4d8d]" aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.367 21.404C21.0867 16.5047 23.0858 10.7671 21.517 6.84578C20.7498 4.92821 19.1421 3.55922 17.2522 3.1368C15.5338 2.75271 13.6394 3.16312 11.9995 4.54956C10.3596 3.16312 8.46525 2.75271 6.74682 3.13681C4.85695 3.55922 3.24924 4.92822 2.48209 6.8458C0.913293 10.7672 2.91243 16.5047 11.6322 21.404C11.8603 21.5322 12.1388 21.5322 12.367 21.404Z" fill="currentColor" /></svg>
  </div>
);

function ShowcaseCard({ left, rotate, z, title, text, icon, children }: { left: number; rotate: number; z: number; title: string; text: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="absolute" style={{ width: 270, left, top: 22, zIndex: z, transformOrigin: "center", transform: `rotate(${rotate}deg)` }}>
      <div className="flex flex-col items-stretch gap-1 overflow-hidden rounded-2xl border border-white/5 p-2" style={CARD_BG}>
        <div className="flex flex-col items-start gap-2 rounded-lg px-3 py-2">
          <div className="flex items-center gap-1.5 text-white">{icon}<span className="text-[14px] font-semibold">{title}</span></div>
          <p className="text-left text-[12px] leading-4 text-white/40">{text}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function MyFavorites() {
  return (
    <div className="cs-scope cs-root fixed inset-0 flex gap-1 overflow-hidden p-1 max-md:p-0">
      <Sidebar />
      <section data-project-feed-card className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111214] text-white">
        <div className="shrink-0 px-2 pb-1 pt-1">
          <div className="flex h-11 items-center px-1"><span className="truncate text-[14px] font-medium text-white">My favorites</span></div>
        </div>
        <div className="hide-scrollbar relative min-h-0 flex-1 overflow-y-auto">
          <div className="flex min-h-full w-full flex-col items-center justify-center px-8 py-8 text-center">
            <div className="flex w-full flex-col items-center gap-4">
              <div className="flex max-w-[520px] flex-col items-center gap-5">
                <span aria-hidden="true" className="relative block size-12 shrink-0 overflow-visible">
                  <span className="absolute inset-0 overflow-hidden rounded-xl shadow-[0_4px_4px_0_rgba(0,0,0,0.08),inset_0_2px_4px_0_rgba(255,255,255,0.24)]" style={{ background: "linear-gradient(135deg, rgb(226, 81, 180) 3.87%, rgb(141, 18, 55) 93.45%)" }} />
                  <span className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(255,255,255,1)_100%)] opacity-20 mix-blend-overlay" />
                  <span className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(255,255,255,1)_100%)] opacity-30 mix-blend-hard-light" />
                  <span className="pointer-events-none absolute inset-0 rounded-xl border border-white/[0.04]" />
                  <span className="absolute inset-0 flex items-center justify-center text-white">
                    <svg className="size-6" aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.25 9.9375C21.25 15.8672 12.7708 20.25 12 20.25C11.2292 20.25 2.75 15.8672 2.75 9.9375C2.75 5.8125 5.31944 3.75 7.88889 3.75C10.4583 3.75 12 5.29688 12 5.29688C12 5.29688 13.5417 3.75 16.1111 3.75C18.6806 3.75 21.25 5.8125 21.25 9.9375Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                  </span>
                </span>
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-balance text-[18px] font-semibold leading-6 text-white">Your favorite generations will appear here</h2>
                  <p className="min-h-10 max-w-[458px] text-pretty text-[14px] leading-5 text-[#8d8e93]">Mark the ones you like to save them here</p>
                </div>
              </div>
              <div className="w-full">
                <div className="flex w-full justify-center">
                  <div aria-hidden="true" className="relative w-full overflow-x-clip" style={{ maxWidth: 998, aspectRatio: "998 / 260", containerType: "inline-size" }}>
                    <div className="absolute left-0 top-0 origin-top-left" style={{ width: 998, height: 260, transform: "scale(calc(100cqw / 998px))" }}>
                      <div className="absolute top-0" style={{ left: 48, width: 902, height: 260 }}>
                        <ShowcaseCard left={161} rotate={2} z={20} title="Mark favorites" text="Keep your best shots in one place, ready to reuse"
                          icon={<svg className="size-5 shrink-0" aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.32781C12.1935 4.18729 12.4386 4.02609 12.7319 3.86553C13.5214 3.43347 14.6725 3 16.1111 3C17.5979 3 19.0829 3.5977 20.1921 4.78484C21.3047 5.97563 22 7.71515 22 9.9375C22 13.2536 19.6489 16.0247 17.3927 17.8948C16.2446 18.8464 15.0735 19.6049 14.1357 20.1276C13.6669 20.3889 13.2492 20.5954 12.9151 20.7391C12.7487 20.8106 12.5947 20.8702 12.4603 20.9134C12.3511 20.9485 12.1754 21 12 21C11.8246 21 11.6489 20.9485 11.5397 20.9134C11.4053 20.8702 11.2513 20.8106 11.0849 20.7391C10.7508 20.5954 10.3331 20.3889 9.86432 20.1276C8.92652 19.6049 7.75539 18.8464 6.60732 17.8948C4.35114 16.0247 2 13.2536 2 9.9375C2 7.71515 2.69528 5.97563 3.80789 4.78484C4.91708 3.5977 6.40208 3 7.88889 3C9.32752 3 10.4786 3.43347 11.2681 3.86553C11.5614 4.02609 11.8065 4.18729 12 4.32781Z" fill="currentColor" /></svg>}>
                          <div className="mx-auto flex h-28 w-[254px] items-stretch gap-2 overflow-hidden">
                            {SHOWCASE_THUMBS.map((f) => (
                              <div key={f} className="relative flex-1 overflow-hidden rounded-lg ring-1 ring-inset ring-white/5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img alt="" width={120} height={112} loading="lazy" decoding="async" draggable={false} src={SHOWCASE + f} className="size-full object-cover" />
                                <HeartBadge />
                              </div>
                            ))}
                          </div>
                        </ShowcaseCard>
                        <ShowcaseCard left={471} rotate={-2} z={10} title="From any project" text="Favorites from all projects and folders show up here"
                          icon={<svg className="size-5 shrink-0" aria-hidden="true" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6.75 3C5.7835 3 5 3.7835 5 4.75V7H2.75C1.7835 7 1 7.7835 1 8.75V19.25C1 20.2165 1.7835 21 2.75 21H17.25C18.2165 21 19 20.2165 19 19.25V17H21.25C22.2165 17 23 16.2165 23 15.25V6.75C23 5.7835 22.2165 5 21.25 5H14.4142C14.3479 5 14.2843 4.97366 14.2374 4.92678L12.8232 3.51256C12.495 3.18437 12.0499 3 11.5858 3H6.75ZM19 15.5H21.25C21.3881 15.5 21.5 15.3881 21.5 15.25V6.75C21.5 6.61193 21.3881 6.5 21.25 6.5H14.4142C13.9501 6.5 13.505 6.31563 13.1768 5.98744L11.7626 4.57322C11.7157 4.52634 11.6521 4.5 11.5858 4.5H6.75C6.61193 4.5 6.5 4.61193 6.5 4.75V7H7.58579C8.04992 7 8.49503 7.18437 8.82322 7.51256L10.2374 8.92678C10.2843 8.97366 10.3479 9 10.4142 9H17.25C18.2165 9 19 9.7835 19 10.75V15.5Z" fill="currentColor" /></svg>}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img alt="" width={508} height={224} loading="lazy" decoding="async" draggable={false} src={PROJECTS_IMG} className="mx-auto h-28 w-[254px] object-cover" />
                        </ShowcaseCard>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="h-8" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

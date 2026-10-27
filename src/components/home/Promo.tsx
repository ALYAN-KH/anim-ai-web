"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { HiggsSnake } from "@/components/ui/HiggsSnake";
import { Aperture, Bot, Sparkles } from "lucide-react";
import data from "@/data/content";

type PromoItem = {
  t: string;
  sub: string;
  href: string;
  badge?: string;
  icon?: string;
  src?: string;
  video?: string;
  poster?: string;
  bg?: string;
};

export function Promo() {
  const discount = data.discount;
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const titleParts = discount.title.split("extra discount");

  // Play video on scroll when in viewport
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    video.muted = true;
    video.defaultMuted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = true;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {});
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15, rootMargin: "80px 0px" },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section className="mx-3 mt-7 grid gap-6 lg:grid-cols-[1fr_1.28fr]">
      {/* Discount Banner with Interactive Video Playback */}
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[26px] border border-white/70 p-7 md:p-8"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={discount.video || discount.src}
          poster={discount.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />
        <div className="relative z-10 max-w-md">
          <h3 className="font-grotesk text-3xl font-bold uppercase leading-[1.05] md:text-[40px] max-md:text-[26px]">
            {titleParts[0]}
            <br />
            <span className="text-lime">extra discount</span>
          </h3>
          <ul className="mt-5 space-y-2 text-sm text-zinc-300">
            {discount.bullets.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="text-zinc-400">âœ“</span>
                {x}
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="btn mt-6 self-start px-7 py-3 text-base max-md:mt-5 max-md:px-4 max-md:py-2 max-md:text-[13px]"
          >
            {discount.cta}
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {(data.promo as PromoItem[]).map((p) => {
          const Fallback =
            p.t === "AI Influencer"
              ? Sparkles
              : p.t.includes("MCP")
                ? Bot
                : Aperture;

          return (
            <div
              key={p.t}
              style={p.bg ? { backgroundColor: p.bg } : undefined}
              className="group relative flex min-h-[158px] flex-col justify-between rounded-2xl border border-[#34373a] bg-[#24272a] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,.025)] transition hover:bg-[#2b2e31]"
            >
              <Link
                href={p.href}
                aria-label={`Open ${p.t}`}
                className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
              />
              {p.icon === data.mcpSection.ctaIcon ? (
                <Link
                  href={data.mcpSection.href}
                  aria-label="Explore Higgsfield MCP for ChatGPT"
                  className="relative z-20 w-fit rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                >
                  <HiggsSnake className="h-6 w-6 text-white transition duration-300 group-hover:scale-110" />
                </Link>
              ) : p.icon ? (
                <img
                  src={p.icon}
                  alt=""
                  className="h-6 w-6 object-contain object-left transition duration-300 group-hover:scale-110"
                />
              ) : (
                <Fallback className="h-5 w-5 text-zinc-100 group-hover:text-lime" />
              )}
              <div className="pointer-events-none relative z-10">
                <div className="flex flex-wrap items-center gap-2 text-base font-semibold">
                  {p.t}
                  {p.badge && (
                    <span
                      className={`promo-badge text-[10px] font-extrabold italic leading-none ${
                        p.badge === "Top"
                          ? "bg-[#fe1678] text-white"
                          : "bg-lime text-black"
                      }`}
                    >
                      {p.badge.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-[#989ca2] md:whitespace-nowrap md:text-[13px]">
                  {p.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}



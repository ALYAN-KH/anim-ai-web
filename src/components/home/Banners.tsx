"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Tile, bg } from "@/components/gallery/Tile";
import data from "@/data/content";
import { soulCinemaCapturedHtml } from "@/data/soulCinemaCaptured";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { tick } from "@/store";
import { previewVideo } from "@/lib/videoPreview";

export function Influencer() {
  const influencer = data.influencerSection;

  return (
    <section className="relative mx-3 mt-7 flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-white/15 bg-[radial-gradient(ellipse_76%_120%_at_50%_-10%,#464646_0%,#343434_22%,#1b1b1b_54%,#0b0b0b_100%)] p-6 text-center md:min-h-[500px] max-md:min-h-[560px] max-md:justify-start max-md:rounded-[22px] max-md:px-5 max-md:pb-0 max-md:pt-8">
      <img
        src={influencer.leftImage}
        alt={influencer.tag}
        className="pointer-events-none absolute bottom-0 left-[4%] z-[1] h-[92%] w-auto max-w-[34%] object-contain object-left-bottom max-md:-left-[4%] max-md:h-[44%] max-md:max-w-[54%]"
      />
      <img
        src={influencer.rightImage}
        alt={influencer.tag}
        className="pointer-events-none absolute bottom-0 right-0 z-[1] h-[96%] w-auto max-w-[34%] object-contain object-right-bottom max-md:-right-[4%] max-md:h-[46%] max-md:max-w-[54%]"
      />
      <div className="relative z-10 flex flex-col items-center">
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/20 px-4 py-1.5 text-sm font-semibold text-lime max-md:mb-5 max-md:px-3 max-md:py-1 max-md:text-xs">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20 7h-2.18A3 3 0 0 0 12 5.17 3 3 0 0 0 6.18 7H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1ZM15 5a1 1 0 1 1 0 2h-2V6a1 1 0 0 1 1-1h1ZM9 5h1a1 1 0 0 1 1 1v1H9a1 1 0 1 1 0-2Zm2 15H7v-7h4v7Zm6 0h-4v-7h4v7Z" />
          </svg>
          {influencer.badge}
        </span>
        <p className="font-grotesk text-lg font-bold uppercase tracking-tight text-white max-md:text-sm">
          {influencer.tag}
        </p>
        <h2 className="font-grotesk mt-3 text-3xl font-bold uppercase leading-[1.05] tracking-tight md:text-6xl max-md:mt-2 max-md:text-[30px]">
          {influencer.title}
          <br />
          <span className="text-zinc-400">{influencer.titleHighlight}</span>
        </h2>
        <p className="mt-4 text-base text-zinc-400 md:text-lg max-md:mt-3 max-md:max-w-[280px] max-md:text-sm">
          {influencer.desc}
        </p>
        <a
          href={influencer.href}
          className="btn mt-8 shadow-[0_4px_0_rgba(209,254,23,0.35)] max-md:mt-5 max-md:px-3.5 max-md:py-1.5 max-md:text-[13px]"
        >
          {influencer.cta}
        </a>
      </div>
    </section>
  );
}

type FestivalFilm = {
  t: string;
  author: string;
  poster: string;
  href: string;
  avatar?: string;
  festivalBadge?: "laurel" | "higgsfield";
};

function FestivalFilmCard({
  film,
  index,
}: {
  film: FestivalFilm;
  index: number;
}) {
  const badge = film.festivalBadge ?? "higgsfield";
  const avatar = film.avatar || film.poster;

  return (
    <Link
      href={film.href}
      aria-label={`${film.t} by ${film.author}`}
      className="group/festival-card relative block aspect-video overflow-hidden rounded-xl transition-[transform,box-shadow] duration-[250ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-lime after:absolute after:inset-0 after:z-[19] after:rounded-[inherit] after:border-2 after:border-white/20 after:content-[''] after:pointer-events-none after:transition-[border-color,box-shadow] group-hover/festival-card:z-[2] group-focus-within/festival-card:z-[2] group-hover/festival-card:-translate-y-[5px] group-focus-within/festival-card:-translate-y-[5px] group-hover/festival-card:shadow-[0_16px_30px_rgba(0,0,0,0.72),0_0_0_1px_rgba(255,255,255,0.2)] group-focus-within/festival-card:shadow-[0_16px_30px_rgba(0,0,0,0.72),0_0_0_1px_rgba(255,255,255,0.2)] max-[767px]:group-hover/festival-card:-translate-y-[3px] max-[767px]:group-focus-within/festival-card:-translate-y-[3px] group-hover/festival-card:after:border-white/90 group-focus-within/festival-card:after:border-white/90 group-hover/festival-card:after:[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.12)] group-focus-within/festival-card:after:[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.12)] group-hover/festival-card:[&_img]:shadow-[0_12px_28px_rgba(0,0,0,0.45)] group-hover/festival-card:[&_video]:shadow-[0_12px_28px_rgba(0,0,0,0.45)] group-focus-within/festival-card:[&_img]:shadow-[0_12px_28px_rgba(0,0,0,0.45)] group-focus-within/festival-card:[&_video]:shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
    >
      <Tile
        it={{ t: film.t, poster: film.poster }}
        i={index + 8}
        r="rounded-xl"
        showInfo={false}
        hoverEffects={false}
      />

      <span className="pointer-events-none absolute left-3 right-[45px] top-[10px] max-[767px]:right-9 max-[767px]:left-2 max-[767px]:top-2 max-[767px]:!text-[9px] z-20 overflow-hidden text-left text-[clamp(11px,1.1vw,17px)] font-bold leading-[1.15] text-white opacity-0 [text-overflow:ellipsis] [white-space:nowrap] transition-opacity duration-200 group-hover/festival-card:opacity-100 group-focus-within/festival-card:opacity-100 [@media(hover:none)]:text-[11px] [@media(hover:none)]:opacity-100" aria-hidden="true">
        {film.t}
      </span>

      <span
        role="img"
        className={`pointer-events-none absolute right-3 top-0 z-20 flex h-10 w-8 justify-center pt-2 max-[767px]:right-2 max-[767px]:h-7 max-[767px]:w-6 max-[767px]:pt-1.5 max-[767px]:[&_svg]:size-3.5 text-[#0b0c0e] [clip-path:polygon(0_0,100%_0,100%_100%,50%_82%,0_100%)] ${
          badge === "laurel" ? "bg-[#39adff]" : "bg-[#d6ff00]"
        }`}
        aria-label={badge === "laurel" ? "Create in Public Shortlist" : "Higgsfield Picks"}
      >
        {badge === "laurel" ? (
          <svg viewBox="6 7 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M15.1667 25.486C14.6886 25.0286 13.7323 22.285 8.47372 23.6568C8.79244 25.0287 10.5772 27.3151 15.1667 25.486Z" />
            <path d="M6.04791 17.9096C5.7822 19.2917 6.49377 22.0629 11.4654 22.0903C11.2116 21.4909 11.3421 18.1694 6.04791 17.9096Z" />
            <path d="M6.71645 12.6339C6.07448 13.8979 5.98633 16.7506 10.7698 18.0471C10.6925 17.4047 11.7457 14.2368 6.71645 12.6339Z" />
            <path d="M11.3795 7.83333C10.1446 8.59464 8.52054 10.988 11.9042 14.4719C12.1872 13.8844 14.8067 11.701 11.3795 7.83333Z" />
            <path d="M16.8333 25.486C17.3114 25.0286 18.2677 22.285 23.5263 23.6568C23.2076 25.0287 21.4228 27.3151 16.8333 25.486Z" />
            <path d="M25.9521 17.9096C26.2178 19.2917 25.5062 22.0629 20.5346 22.0903C20.7884 21.4909 20.6579 18.1694 25.9521 17.9096Z" />
            <path d="M25.2835 12.6339C25.9255 13.8979 26.0137 16.7506 21.2302 18.0471C21.3075 17.4047 20.2543 14.2368 25.2835 12.6339Z" />
            <path d="M20.6205 7.83333C21.8554 8.59464 23.4795 10.988 20.0958 14.4719C19.8128 13.8844 17.1933 11.701 20.6205 7.83333Z" />
          </svg>
        ) : (
          <svg viewBox="6 7 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M22.9582 16.8685L22.9449 16.7234C22.8193 15.3317 21.9136 12.7134 19.4014 12.7134C17.5371 12.7134 16.1288 14.5535 14.8859 16.1759C13.8942 17.4752 13.0349 18.5897 12.0894 18.5897C11.8381 18.5634 11.5142 18.4381 11.316 18.1545C11.1375 17.8972 11.0912 17.5674 11.1837 17.1717C11.3291 16.5452 12.1622 15.9647 13.0414 15.3448C13.5239 15.0151 14.0198 14.6655 14.3636 14.3291C15.3554 13.3728 15.8578 12.6803 15.8578 11.5657C15.8578 10.4512 15.243 9.89706 14.7273 9.65959C13.696 9.18485 12.1821 9.46183 11.2169 10.293C11.0715 10.4249 10.926 10.5501 10.7937 10.6688C9.82185 11.5329 9.16745 12.1199 7.66667 11.6712V13.4783C9.65659 14.3556 11.3293 12.6803 11.964 11.9087C12.4531 11.4009 12.9688 11.1041 13.3524 11.1041H13.3723C13.5441 11.1107 13.6895 11.1767 13.7954 11.2954C13.9673 11.4933 14.0335 11.7242 14.0003 11.9813C13.9275 12.5222 13.3656 13.1552 12.3343 13.8478C11.1244 14.659 9.1015 16.0177 8.94268 17.7259C8.82367 18.9527 9.45836 20.1794 10.4501 20.6541C12.7639 21.749 14.1722 19.8627 15.6662 17.8709C16.8099 16.3342 17.8941 14.8767 19.4015 14.8767C20.7568 14.8767 21.2592 15.9978 21.2592 16.7036V16.8422L21.1269 16.8685C17.8412 17.4489 16.0496 20.5223 16.0496 21.9403C16.0496 23.3583 17.2528 24.5719 18.7337 24.5719C20.4659 24.5719 22.6078 23.0946 22.9516 18.9395L22.9648 18.7878H24.3333V16.8686H22.9582V16.8685ZM21.1665 18.9987C20.9021 21.485 19.6261 22.6459 18.8527 22.6459C18.5023 22.6459 18.0131 22.3557 18.0131 21.815C18.0131 21.2083 18.9188 19.3681 20.955 18.8207L21.193 18.7614L21.1665 18.9988V18.9987Z" />
          </svg>
        )}
      </span>

      <span className="pointer-events-none absolute bottom-[10px] left-[10px] z-20 flex h-7 w-7 max-[767px]:bottom-1.5 max-[767px]:left-1.5 max-[767px]:h-5 max-[767px]:w-5 items-center gap-[7px] overflow-hidden rounded-full border border-white/30 bg-black/50 p-0.5 backdrop-blur-sm transition-all duration-200 group-hover/festival-card:w-max group-focus-within/festival-card:w-max group-hover/festival-card:max-w-[calc(100%_-_20px)] group-focus-within/festival-card:max-w-[calc(100%_-_20px)] group-hover/festival-card:pr-[10px] group-focus-within/festival-card:pr-[10px] group-hover/festival-card:bg-[rgba(24,24,24,0.82)] group-focus-within/festival-card:bg-[rgba(24,24,24,0.82)]" aria-hidden="true">
        {avatar ? (
          <img className="h-[22px] w-[22px] max-[767px]:h-4 max-[767px]:w-4 flex-none rounded-full object-cover [object-position:center_28%]" src={avatar} alt="" loading="lazy" />
        ) : (
          <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-lime text-[10px] font-extrabold text-[#0b0c0e]">{film.author.slice(0, 1).toUpperCase()}</span>
        )}
        <span className="max-w-0 overflow-hidden text-[11px] font-[650] text-white opacity-0 [text-overflow:ellipsis] [white-space:nowrap] transition-[max-width,opacity] duration-[240ms] group-hover/festival-card:max-w-[180px] group-focus-within/festival-card:max-w-[180px] group-hover/festival-card:opacity-100 group-focus-within/festival-card:opacity-100">{film.author}</span>
      </span>
    </Link>
  );
}

export function Festival() {
  const meta = data.festivalMeta;
  const titleWords = meta.title.split(" ");
  const titleFirstLine = titleWords.slice(0, 2).join(" ");
  const titleSecondLine = titleWords.slice(2).join(" ");
  const d = useAppDispatch();
  const ms = useAppSelector((s) => s.festival.ms);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setInterval(() => d(tick(1000)), 1000);
    return () => clearInterval(t);
  }, [d]);

  useEffect(() => {
    const video = videoRef.current;
    if (
      !video ||
      !meta.bannerVideo ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [meta.bannerVideo]);

  const D = Math.floor(ms / 864e5);
  const H = Math.floor((ms % 864e5) / 36e5);
  const M = Math.floor((ms % 36e5) / 6e4);
  const p = (n: number) => String(n).padStart(2, "0");

  return (
    <section id="festival-voting" className="relative isolate mx-3 mt-7 overflow-hidden rounded-[28px] border border-white/15 bg-black shadow-[0_20px_55px_rgba(0,0,0,0.32)]">
      <div className="relative isolate flex h-[clamp(340px,19.4vw,370px)] flex-col justify-between overflow-hidden bg-[#050505] p-7 sm:p-9 md:px-[60px] md:py-9 max-[767px]:h-[360px] max-[767px]:p-6">
        <img
          src={meta.banner}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        />
        {meta.bannerVideo && (
          <video
            ref={videoRef}
            className="absolute inset-0 z-0 h-full w-full object-cover"
            src={previewVideo(meta.bannerVideo)}
            poster={meta.banner}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(0,0,0,0.55),transparent_52%,rgba(0,0,0,0.7)),linear-gradient(0deg,rgba(0,0,0,0.87),transparent_72%)]" />
        <div className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-10">
          <div
            className="relative z-[2] w-max text-center text-[#b99b52] [font-family:Space_Grotesk,Arial,sans-serif] font-extrabold leading-[0.86] [text-shadow:0_1px_8px_#0008]"
            aria-label="Higgsfield Global Film Festival"
          >
            <span className="mb-1 flex items-center justify-center">
              <img className="block h-6 w-[118px] object-contain" src="/higgsfield-assets/festival-logo-brand.svg" alt="" />
            </span>
            <span className="flex items-end gap-0.5">
              <img src="/higgsfield-assets/festival-laurel-left.svg" alt="" aria-hidden="true" className="h-[50px] w-[30px] flex-none object-contain" />
              <span className="block text-[30px] tracking-[-0.075em]">GLOBAL FILM<br />FESTIVAL</span>
              <img src="/higgsfield-assets/festival-laurel-right.svg" alt="" aria-hidden="true" className="h-[50px] w-[30px] flex-none object-contain" />
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 className="max-w-[760px] bg-[linear-gradient(#fff,rgba(255,255,255,0.72))] bg-clip-text font-grotesk text-[clamp(38px,3.1vw,58px)] font-bold uppercase leading-[1.18] text-transparent max-[767px]:text-[36px]">
              {titleFirstLine}
              <br />
              {titleSecondLine}
            </h2>
            <div className="flex flex-col items-start gap-3 text-left md:items-end md:text-right">
              <img className="block h-[22px] w-[250px] object-contain [filter:drop-shadow(0_1px_8px_#000)] max-[767px]:h-auto max-[767px]:w-[200px]" src={meta.badge} alt="Audience Choice Â· $100 000" />
              <div className="mt-1 inline-block rounded-[9px] border border-white/25 bg-[linear-gradient(155deg,rgba(255,255,255,0.2)_0_32%,rgba(0,0,0,0.78)_32%)] px-[18px] py-2 font-mono text-[20px] font-extrabold text-lime shadow-[0_0_12px_rgba(209,254,23,0.5)]">
                {p(D)}D&nbsp; : &nbsp;{p(H)}H&nbsp; : &nbsp;{p(M)}M
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 bg-black px-4 pb-[34px] sm:px-7 md:px-8">
        <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-9 [mask-image:linear-gradient(to_bottom,#000_calc(100%_-_104px),rgba(0,0,0,0.62)_calc(100%_-_62px),rgba(0,0,0,0.2)_calc(100%_-_28px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_calc(100%_-_104px),rgba(0,0,0,0.62)_calc(100%_-_62px),rgba(0,0,0,0.2)_calc(100%_-_28px),transparent_100%)] md:grid-cols-4 md:gap-5 max-[767px]:[mask-image:linear-gradient(to_bottom,#000_calc(100%_-_76px),rgba(0,0,0,0.55)_calc(100%_-_44px),transparent_100%)] max-[767px]:[-webkit-mask-image:linear-gradient(to_bottom,#000_calc(100%_-_76px),rgba(0,0,0,0.55)_calc(100%_-_44px),transparent_100%)]">
          {data.festival.map((film, i) => (
            <FestivalFilmCard key={film.t} film={film as FestivalFilm} index={i} />
          ))}
        </div>
        <div className="text-center">
          <Link href={meta.href} className="btn relative z-[3] mt-[-12px] inline-flex h-[42px] items-center justify-center px-4 text-[17px] font-semibold leading-none shadow-[0_4px_0_rgba(209,254,23,0.35)] max-[767px]:mt-[-8px] max-[767px]:h-[44px] max-[767px]:px-3 max-[767px]:text-[13px]">
            {meta.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Mcp() {
  const mcp = data.mcpSection as any;

  return (
    <div className="mx-1 my-6 hidden md:block">
    <a href={mcp.href ?? "/mcp?tab=chatgpt"} className="dots-mcp-banner">
      <svg className="dots-mcp-banner-background" viewBox="0 0 1408 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <image href="https://static.higgsfield.ai/mcp/dots/v2/background-pearl.svg" width="1408" height="400" />
        <image href="https://static.higgsfield.ai/mcp/dots/v2/background-bloom.svg" width="1408" height="400" />
        <image className="dots-mcp-banner-glow" href="https://static.higgsfield.ai/mcp/dots/v2/background-glow.svg" x="-1645.29" y="-551.29" width="4698.16" height="1502.09" />
      </svg>
      <div className="dots-mcp-banner-halftone" aria-hidden="true">
        <span style={{ "--dot-radius": "0.62px", opacity: 0.055 } as React.CSSProperties} />
        <span style={{ "--dot-radius": "0.67px", opacity: 0.101 } as React.CSSProperties} />
        <span style={{ "--dot-radius": "0.71px", opacity: 0.147 } as React.CSSProperties} />
        <span style={{ "--dot-radius": "0.76px", opacity: 0.193 } as React.CSSProperties} />
        <span style={{ "--dot-radius": "0.8px", opacity: 0.239 } as React.CSSProperties} />
        <span style={{ "--dot-radius": "0.85px", opacity: 0.285 } as React.CSSProperties} />
        <span style={{ "--dot-radius": "0.9px", opacity: 0.331 } as React.CSSProperties} />
        <span style={{ "--dot-radius": "0.94px", opacity: 0.377 } as React.CSSProperties} />
        <span style={{ "--dot-radius": "0.99px", opacity: 0.423 } as React.CSSProperties} />
        <span style={{ "--dot-radius": "1.03px", opacity: 0.469 } as React.CSSProperties} />
        <span style={{ "--dot-radius": "1.08px", opacity: 0.515 } as React.CSSProperties} />
      </div>
      <div className="dots-mcp-banner-content">
        <h2 className="dots-mcp-banner-heading">
          <span className="dots-mcp-banner-title-line">
            Use ChatGPT{" "}
            <span className="dots-mcp-banner-title-dot" aria-hidden="true">
              <img src="https://static.higgsfield.ai/mcp/dots/v2/dot-white.webp" alt="" width="320" height="320" />
            </span>{" "}
            Dots
          </span>
          <span className="dots-mcp-banner-title-line">with Higgsfield MCP</span>
        </h2>
        <p className="dots-mcp-banner-description">
          {mcp.sub ?? "Plan and make a creative project step by step with Higgsfield Dots in ChatGPT"}
        </p>
        <span className="q-button q-button-marketing-primary q-button-md dots-mcp-banner-cta">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="currentColor" d="m20.35 11.844 -.016-.173c-.15-1.654-1.238-4.766-4.252-4.766-2.238 0-3.927 2.187-5.419 4.116-1.19 1.544-2.221 2.868-3.356 2.868-.301-.03-.69-.18-.928-.517-.214-.306-.27-.698-.159-1.168.175-.745 1.175-1.434 2.23-2.171.579-.392 1.174-.808 1.586-1.208 1.19-1.136 1.793-1.96 1.793-3.284 0-1.325-.737-1.984-1.356-2.266-1.238-.564-3.054-.235-4.213.753-.174.157-.349.306-.508.447C4.586 5.502 3.801 6.2 2 5.666v2.148c2.388 1.043 4.395-.948 5.157-1.866.587-.603 1.206-.956 1.666-.956h.024c.206.008.38.086.508.227q.307.355.245.816c-.087.643-.761 1.395-1.999 2.218-1.452.965-3.88 2.58-4.07 4.61-.143 1.458.619 2.916 1.81 3.48 2.776 1.302 4.466-.94 6.258-3.308 1.373-1.826 2.674-3.559 4.483-3.559 1.626 0 2.229 1.333 2.229 2.172v.164l-.159.032c-3.943.69-6.093 4.343-6.093 6.028 0 1.686 1.444 3.128 3.221 3.128 2.079 0 4.65-1.756 5.062-6.695l.016-.18H22v-2.281zm-2.15 2.532c-.317 2.955-1.849 4.335-2.777 4.335-.42 0-1.007-.345-1.007-.988 0-.721 1.087-2.908 3.53-3.559l.286-.07z" />
          </svg>
          <span className="q-button-label-frame">{mcp.cta ?? "Connect Higgsfield"}</span>
        </span>
      </div>
      <div className="dots-mcp-banner-characters" aria-hidden="true">
        <div className="dots-mcp-banner-character dots-mcp-banner-character-creator">
          <span className="dots-mcp-banner-character-label">Character Creator</span>
          <span className="dots-mcp-banner-character-media">
            <img src="https://static.higgsfield.ai/mcp/dots/v2/dot-character-creator.webp" alt="" width="67" height="67" />
          </span>
          <span className="dots-mcp-banner-character-cursor">
            <img src="https://static.higgsfield.ai/mcp/dots/v2/cursor.svg" alt="" width="24" height="24" />
          </span>
        </div>
        <div className="dots-mcp-banner-character dots-mcp-banner-cinematic-director">
          <span className="dots-mcp-banner-character-label">Cinematic Director</span>
          <span className="dots-mcp-banner-character-media">
            <img src="https://static.higgsfield.ai/mcp/dots/v2/dot-cinematic-director.webp" alt="" width="67" height="67" />
          </span>
          <span className="dots-mcp-banner-character-cursor">
            <img src="https://static.higgsfield.ai/mcp/dots/v2/cursor.svg" alt="" width="24" height="24" />
          </span>
        </div>
        <div className="dots-mcp-banner-character dots-mcp-banner-content-lead">
          <span className="dots-mcp-banner-character-label">Content Lead</span>
          <span className="dots-mcp-banner-character-media">
            <img src="https://static.higgsfield.ai/mcp/dots/v2/dot-content-lead.webp" alt="" width="67" height="67" />
          </span>
          <span className="dots-mcp-banner-character-cursor">
            <img src="https://static.higgsfield.ai/mcp/dots/v2/cursor.svg" alt="" width="24" height="24" />
          </span>
        </div>
        <div className="dots-mcp-banner-character dots-mcp-banner-motion-designer">
          <span className="dots-mcp-banner-character-label">Motion Designer</span>
          <span className="dots-mcp-banner-character-media">
            <img src="https://static.higgsfield.ai/mcp/dots/v2/dot-motion-designer.webp" alt="" width="67" height="67" />
          </span>
          <span className="dots-mcp-banner-character-cursor">
            <img src="https://static.higgsfield.ai/mcp/dots/v2/cursor.svg" alt="" width="24" height="24" />
          </span>
        </div>
      </div>
    </a>
    </div>
  );
}




export function Super() {
  const section = data.superSection;
  return (
    <section className="relative mx-3 mt-7 aspect-[4224/1280] min-h-[360px] overflow-hidden rounded-[28px] text-center shadow-[0_0_40px_rgba(183,255,0,.18)] max-md:aspect-auto max-md:h-[380px] max-md:min-h-0 max-md:rounded-[22px]">
      <img
        src="https://static.higgsfield.ai/spc-banner/bg-spc-banner.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <img src="https://static.higgsfield.ai/spc-banner/spc-banner-creative.png" alt="" aria-hidden="true" className="pointer-events-none absolute left-[7%] top-[19%] hidden w-[18%] lg:block" />
      <img src="https://static.higgsfield.ai/spc-banner/spc-banner-visualizing.png" alt="" aria-hidden="true" className="pointer-events-none absolute left-[67%] top-[15%] hidden w-[8%] lg:block" />
      <img src="https://static.higgsfield.ai/spc-banner/spc-banner-marketing.png" alt="" aria-hidden="true" className="pointer-events-none absolute left-[78.48%] top-[13.75%] hidden w-[15.55%] lg:block" />
      <img src="https://static.higgsfield.ai/spc-banner/spc-banner-production.png" alt="" aria-hidden="true" className="pointer-events-none absolute bottom-0 left-[68.96%] hidden w-[15.84%] lg:block" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-7 px-6 lg:gap-9 max-md:gap-5 max-md:px-5">
        <div className="flex flex-col items-center gap-3 max-md:gap-2.5">
          <img
            src="https://static.higgsfield.ai/spc-banner/spc-banner-logo.png"
            alt=""
            aria-hidden="true"
            className="h-auto w-[310px] max-w-[90%] object-contain sm:w-[420px] sm:max-w-[70%] lg:w-[37%] max-md:w-[260px]"
          />
          <div className="flex flex-col items-center gap-2 max-md:gap-1.5">
            <h2 className="font-grotesk text-[36px] font-bold uppercase leading-10 tracking-[-1.2px] text-lime sm:text-[44px] sm:leading-[1.05] lg:text-[56px] max-md:text-[28px] max-md:leading-[1.1] max-md:tracking-[-0.8px]">
              {section.title}
            </h2>
            <p className="text-xs font-medium text-[#c5d9a2] sm:text-base max-md:max-w-[280px] max-md:text-[13px] max-md:leading-[18px]">
              {section.sub}
            </p>
          </div>
        </div>
        <Link
          href={section.href}
          className="inline-flex items-center justify-center rounded-xl bg-white px-5 pb-3.5 pt-3 text-sm font-semibold text-[#242424] shadow-[0_9px_22px_rgba(0,0,0,.15),inset_0_-3px_0_#c7c7c7] sm:text-base max-md:min-h-[38px] max-md:rounded-[10px] max-md:px-4 max-md:pb-2.5 max-md:pt-2 max-md:text-[13px]"
        >
          {section.cta}
        </Link>
      </div>
    </section>
  );
}

export function CanvasBanner() {
  const section = data.canvasSection;
  return (
    <section className="relative mx-3 mt-8 h-[clamp(360px,20vw,390px)] overflow-hidden rounded-[28px] bg-[#075796] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] max-[767px]:h-[620px] max-[767px]:min-h-[620px]">
      <picture className="absolute inset-0 h-full w-full" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/higgsfield-assets/canvas-banner-bg-mobile.webp" />
        <img className="block h-full w-full object-cover" src="/higgsfield-assets/canvas-banner-bg-desktop.webp" alt="" />
      </picture>
      <div className="relative z-10 flex h-full max-w-[560px] flex-col justify-center px-9 py-6 max-md:px-6 max-[767px]:h-[54%] max-[767px]:justify-start max-[767px]:pt-[34px]">
        <span className="font-grotesk text-sm font-bold uppercase tracking-[.17em] text-white md:text-base">{section.tag}</span>
        <h2 className="font-grotesk mt-2 text-[clamp(2.25rem,3vw,3.6rem)] font-bold uppercase leading-[.98] tracking-[-.045em] text-white">
          One canvas.<br />Every workflow.
        </h2>
        <p className="mt-4 max-w-[330px] text-sm font-medium leading-5 text-white/60 md:text-base md:leading-6">
          Moodboard, chain workflows, and share<br className="hidden md:block" /> with your team - all on one canvas.
        </p>
        <Link href={section.href} className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#171717] shadow-[0_3px_0_rgba(0,0,0,.12)] md:text-base max-md:mt-5 max-md:gap-1.5 max-md:rounded-[10px] max-md:px-3.5 max-md:py-2 max-md:text-[13px] max-md:[&_svg]:size-4">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M11.7452 4.66559C11.7023 4.28675 11.382 4.00039 11.0008 4C10.6195 3.99961 10.2986 4.28532 10.2549 4.66407C9.97088 7.12691 9.23453 8.85871 8.04662 10.0466C6.85871 11.2345 5.12691 11.9709 2.66407 12.2549C2.28532 12.2986 1.99961 12.6195 2 13.0008C2.00039 13.382 2.28675 13.7023 2.66559 13.7452C5.08772 14.0196 6.85633 14.7556 8.07245 15.9498C9.28399 17.1394 10.0357 18.8708 10.2529 21.3164C10.2873 21.7037 10.612 22.0004 11.0008 22C11.3897 21.9996 11.7137 21.7021 11.7472 21.3147C11.9554 18.9094 12.7064 17.1415 13.924 15.924C15.1415 14.7064 16.9094 13.9554 19.3147 13.7472C19.7021 13.7137 19.9996 13.3897 20 13.0008C20.0004 12.612 19.7037 12.2873 19.3164 12.2529C16.8708 12.0357 15.1394 11.284 13.9498 10.0724C12.7556 8.85633 12.0196 7.08772 11.7452 4.66559Z" fill="currentColor" />
            <path d="M19.7898 1.25884C19.7731 1.11151 19.6486 1.00015 19.5003 1C19.352 0.999849 19.2272 1.11096 19.2103 1.25825C19.0998 2.21602 18.8134 2.8895 18.3515 3.35146C17.8895 3.81343 17.216 4.09979 16.2582 4.21025C16.111 4.22724 15.9998 4.35203 16 4.5003C16.0002 4.64857 16.1115 4.77313 16.2588 4.78981C17.2008 4.89651 17.8886 5.18275 18.3615 5.64713C18.8327 6.10977 19.125 6.7831 19.2095 7.73414C19.2229 7.88476 19.3491 8.00017 19.5003 8C19.6515 7.99983 19.7775 7.88413 19.7906 7.73349C19.8716 6.79809 20.1636 6.11059 20.6371 5.6371C21.1106 5.16361 21.7981 4.87155 22.7335 4.79058C22.8841 4.77754 22.9998 4.65154 23 4.50033C23.0002 4.34912 22.8848 4.22286 22.7341 4.20948C21.7831 4.125 21.1098 3.83266 20.6471 3.36151C20.1827 2.88857 19.8965 2.20078 19.7898 1.25884Z" fill="currentColor" />
          </svg>
          {section.cta}
        </Link>
      </div>

      <picture className="pointer-events-none absolute right-0 top-auto bottom-[34px] z-[5] h-[calc(100%_-_42px)] w-[min(70%,1190px)] max-[767px]:inset-auto max-[767px]:bottom-0 max-[767px]:left-0 max-[767px]:right-0 max-[767px]:h-[54%] max-[767px]:w-full" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/higgsfield-assets/canvas-banner-mobile.webp" />
        <img className="block h-full w-full object-contain object-right max-[767px]:object-[center_bottom]" src="/higgsfield-assets/canvas-banner-desktop-new.webp" alt="" />
      </picture>
    </section>
  );
}

export function Wide({
  tag,
  text,
  cta,
}: {
  tag: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  hue: number;
}) {
  return (
    <section className="relative mx-auto mt-8 mb-16 h-[280px] w-[min(calc(100%_-_24px),1880px)] overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,#a0aab7_0%,#2e343a_100%)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-opacity duration-[180ms] hover:opacity-80 max-[767px]:mb-8 max-[767px]:h-auto max-[767px]:rounded-[20px]" aria-label="Photodump">
      <Link href="/photodump/mobile?skip-preview=true" aria-label={cta} className="absolute inset-0 z-20 hidden max-[767px]:block" />
      <Link href="/ai/image?model=soul-v2&modal-photo-dump=true&skip-preview=true" aria-label={cta} className="absolute inset-0 z-20 max-[767px]:hidden" />
      <picture className="absolute bottom-0 left-[336px] h-[280px] w-[1554px] max-[1279px]:left-[200px] max-[767px]:relative max-[767px]:left-auto max-[767px]:mb-[-80px] max-[767px]:aspect-[1.46] max-[767px]:h-auto max-[767px]:w-full" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/higgsfield-assets/photodump-cta-mobile.png" />
        <img className="block h-full w-full object-cover" src="/higgsfield-assets/photodump-cta-desktop.png" alt="" />
      </picture>
      <div className="relative z-10 flex h-full w-1/2 flex-col gap-5 px-6 pt-5 pb-6 max-[767px]:h-auto max-[767px]:w-full max-[767px]:gap-5 max-[767px]:px-4 max-[767px]:pt-0 max-[767px]:pb-5">
        <div className="flex flex-col gap-[14px] max-[767px]:gap-[10px]">
          <span className="w-fit -skew-x-[11deg] rounded-md bg-lime px-3 py-1 font-grotesk text-sm font-bold uppercase leading-5 text-black max-[767px]:px-2 max-[767px]:py-0.5 max-[767px]:text-xs max-[767px]:leading-[18px]"><span className="inline-block skew-x-[11deg]">{tag}</span></span>
          <div className="flex flex-col gap-[6px]">
            <h2 className="font-grotesk whitespace-nowrap text-[44px] font-bold uppercase leading-none text-white/90 max-[767px]:text-[30px]">Different Scenes<br />Same Star</h2>
            <p className="whitespace-nowrap text-[18px] leading-[26px] text-white/60 max-[767px]:text-sm max-[767px]:leading-5">{text}</p>
          </div>
        </div>
        <span className="inline-flex min-h-12 w-fit items-center rounded-xl bg-white px-5 text-base font-semibold text-[#242424] shadow-[inset_0_-2px_0_#c8c8c8] max-[767px]:min-h-[38px] max-[767px]:rounded-[10px] max-[767px]:px-3.5 max-[767px]:text-[13px]">{cta}</span>
      </div>
    </section>
  );
}


export function SoulCinema() {
  return (
    <>
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-z_ugVDsbsOO5mZOO.css" />
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-E1YLuCUgMSHbtIGp.css" />
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-s4gVVUdnEnLwSIzd.css" />
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-v2IlITZYB7Bne3xI.css" />
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-mY5KM0Oc_ZtnvvTL.css" />
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-dgacuv-uC6qF5eMK.css" />
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-_-k8dMBGpNL7CGL4.css" />
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-vBfuva7Ya2N2ez0e.css" />
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-jR28g5ewL6SfHlYp.css" />
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-YAgEB4r_H6wD58TW.css" />
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-mlSkBlGhiqFYyi3t.css" />
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-BuyzeC2SU5O_TzNE.css" />
      <link rel="stylesheet" href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-MRX-FsI-uA-n4rk4.css" />
      <section id="soul-cinema-community" dangerouslySetInnerHTML={{ __html: soulCinemaCapturedHtml }} />
    </>
  );
}



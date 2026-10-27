export function AiInfluencerBanner() {
  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden">
      <a
        href="/ai-influencer-studio?mode=influencer"
        className="group relative isolate block h-full min-h-0 w-full overflow-hidden rounded-2xl border border-white/10 bg-black text-white no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-font-brand"
      >
        <svg
          className="pointer-events-none absolute top-[9.25rem] left-[calc(50%-43.8125rem)] h-[25rem] w-[88rem] max-w-none overflow-visible"
          viewBox="0 0 1408 400"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <image
            href="https://static.higgsfield.ai/home/ai-influencer-banner/v1/glow-1.svg"
            x="-3333.28"
            y="-899.7"
            width="8074.56"
            height="2329.41"
          />
          <image
            href="https://static.higgsfield.ai/home/ai-influencer-banner/v1/glow-2.svg"
            x="-2503.19"
            y="-665.74"
            width="6414.39"
            height="1861.49"
          />
          <image
            href="https://static.higgsfield.ai/home/ai-influencer-banner/v1/glow-3.svg"
            x="-1590.78"
            y="-408.58"
            width="4589.56"
            height="1347.16"
          />
          <image
            href="https://static.higgsfield.ai/home/ai-influencer-banner/v1/glow-4.svg"
            x="-1645.08"
            y="-503.43"
            width="4698.16"
            height="1502.09"
            className="mix-blend-plus-lighter"
          />
          <image
            href="https://static.higgsfield.ai/home/ai-influencer-banner/v1/glow-5.svg"
            x="-430.66"
            y="-325.72"
            width="2269.33"
            height="1049.36"
            className="mix-blend-plus-lighter"
          />
        </svg>
        <div
          className="pointer-events-none absolute top-[5.0625rem] left-[calc(50%-22.8125rem)] h-[33.3125rem] w-[46rem] rounded-full bg-black opacity-80 blur-[5rem]"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-x-0 top-[1.375rem] flex justify-center">
          <h3 className="w-[20.5625rem] max-w-[calc(100%-2rem)] bg-[linear-gradient(to_bottom,#fff,rgba(255,255,255,0.5))] bg-clip-text text-center font-grotesk text-[2.25rem] leading-10 font-bold tracking-[-0.04em] text-balance text-transparent uppercase [font-feature-settings:'ss04'_1]">
            Build your next hype machine
          </h3>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          width={299}
          height={450}
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          className="pointer-events-none absolute top-[6.3125rem] left-[calc(50%-4.25rem)] h-auto w-[18.6875rem] max-w-none"
          src="https://static.higgsfield.ai/home/ai-influencer-banner/v1/portrait-left-full.webp"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          width={353}
          height={500}
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          className="pointer-events-none absolute top-[7.5rem] left-[calc(50%-15.125rem)] h-auto w-[22.0825rem] max-w-none"
          src="https://static.higgsfield.ai/home/ai-influencer-banner/v1/portrait-right-tall.webp"
        />
        <div className="absolute inset-x-0 bottom-[1.6875rem] flex justify-center">
          <span className="inline-flex transition-[scale] duration-150 ease-out group-active:scale-[0.97] motion-reduce:transition-none motion-reduce:group-active:scale-100">
            <span className="inline-flex h-10 items-center rounded-lg bg-[#dffd2b] px-[1.125rem] text-sm font-semibold leading-5 text-black shadow-[inset_0_-3px_0_rgba(255,255,255,.55)] transition group-hover:brightness-95">
              Create your own AI Influencer
            </span>
          </span>
        </div>
      </a>
    </div>
  );
}

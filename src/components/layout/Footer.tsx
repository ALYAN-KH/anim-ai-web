import Link from "next/link";
import { footerLinks, tagLinks } from "./footerLinks";

function FooterLink({ label, href, className }: { label: string; href: string; className?: string }) {
  return /^https?:/.test(href)
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{label}</a>
    : <Link href={href} className={className}>{label}</Link>;
}

const tags = [
  "Cinema Studio",
  "Visual Effects",
  "Higgsfield Soul",
  "Camera Controls",
  "Viral",
  "Action movements",
  "Commercial",
  "MiniMax Hailuo 02",
  "Seedance Pro",
  "Community",
  "Wan 2.2 Image",
  "Seedream 4.0",
  "Nano Banana",
  "Flux Kontext",
  "GPT Image",
  "Topaz",
  "Google Veo 3.1",
  "Kling 2.5 Turbo",
  "Kling Avatars 2.0",
  "Claude MCP",
  "Wan 2.5",
  "Sora 2",
  "Sora 2 Presets",
  "Banana Placement",
  "Edit Image",
  "Multi Reference",
  "Upscale",
  "YouTube",
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Nano Banana Pro",
  "Kling o1",
  "Mixed Media Community",
  "Soul Presets",
  "Visual Effects Collection",
];

export function Tags({ items = tags }: { items?: string[] }) {
  return (
    <section className="flex min-h-[660px] flex-col items-center px-5 pb-[150px] pt-[181px] text-center text-white max-md:min-h-0 max-md:px-3 max-md:py-20">
      <h2 className="font-grotesk text-[clamp(2rem,2.95vw,3.5rem)] font-bold uppercase leading-none tracking-[-0.05em]">
        Explore more AI features
      </h2>
      <div className="mx-auto mt-12 flex w-full max-w-[1780px] flex-wrap justify-center gap-x-2.5 gap-y-2.5 max-md:mt-8 max-md:gap-2">
        {items.map((t) => (
          <Link
            key={t}
            href={tagLinks[t] ?? "/"}
            className="rounded-[8px] bg-white/[0.09] px-[14px] py-2 text-[18px] font-normal leading-6 text-white/70 transition-colors hover:bg-white/[0.16] hover:text-white max-md:px-3 max-md:py-1.5 max-md:text-sm"
          >
            {t}
          </Link>
        ))}
      </div>
    </section>
  );
}

type Group = { h: string; l: string[] };

// 5 columns, each column holds 1â€“2 stacked groups
const footerColumns: Group[][] = [
  [
    {
      h: "Create",
      l: [
        "AI Video",
        "AI Image",
        "Edit Image",
        "Inpaint",
        "Upscale",
        "Sora 2 Upscale",
        "Mixed Media",
        "AI Face Swap",
        "AI Influencer",
        "Apps",
      ],
    },
  ],
  [
    {
      h: "Video Models",
      l: [
        "Seedance 2.5",
        "Seedance 2.0",
        "Kling 3.0",
        "Sora 2 Introduction",
        "Veo 3.1 Introduction",
        "WAN 2.6",
        "Grok Imagine 1.5",
        "Gemini Omni Flash",
      ],
    },
    {
      h: "Image Models",
      l: ["Nano Banana", "Flux 2", "Seedream 5", "GPT Image 2", "Ideogram 4.5"],
    },
  ],
  [
    {
      h: "Studios",
      l: [
        "Cinema Studio",
        "Marketing Studio",
        "Lipsync Studio",
        "Photodump Studio",
        "Fashion Factory",
        "Higgsfield Popcorn",
        "Higgsfield Canvas",
      ],
    },
    { h: "Soul", l: ["Soul 2.0", "Soul ID Character", "Soul Cinema"] },
  ],
  [
    {
      h: "Platform",
      l: [
        "Supercomputer",
        "AI Motion Designer",
        "MCP/CLI",
        "API",
        "Collab",
        "Games",
        "Reference Extension",
      ],
    },
    {
      h: "Resources",
      l: ["Blog", "Creator Hub", "Help Center", "Academy", "Prompt Guide"],
    },
  ],
  [
    {
      h: "Company",
      l: [
        "About",
        "Trust",
        "Enterprise",
        "Team",
        "Pricing",
        "Careers",
        "Contact",
      ],
    },
    {
      h: "Community",
      l: ["Community", "Contests", "Creative Partners"],
    },
  ],
];

const socials = ["X / Twitter", "Youtube", "LinkedIn", "Tiktok", "Discord"];
const legal = ["Help center", "Cookie Notice", "Terms", "Privacy"];

function UsFlag() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="shrink-0 rounded-full"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="flag-circle">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#flag-circle)">
        <rect width="24" height="24" fill="#fff" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} y={i * 3.7} width="24" height="1.85" fill="#d9373f" />
        ))}
        <rect width="13" height="12.9" fill="#3b4ea0" />
      </g>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="text-black">
      {/* Lime area */}
      <div className="bg-lime px-6 pt-[45px]">
        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[minmax(0,1.95fr)_repeat(5,minmax(0,1fr))] lg:gap-0">
          <h2 className="col-span-2 font-grotesk text-[36px] font-medium uppercase leading-[1.15] tracking-[-0.03em] lg:col-span-1 lg:-mt-[3px] lg:text-[46px] lg:leading-[58px]">
            AI-native
            <br />
            creative suite
          </h2>

          {footerColumns.map((groups, i) => (
            <div key={i} className="min-w-0 max-lg:col-span-1">
              {groups.map((g, gi) => (
                <div key={g.h} className={gi > 0 ? "mt-[45px]" : ""}>
                  <h3 className="mb-[21px] text-[18px] leading-6 text-black/50 max-sm:text-sm">
                    {g.h}
                  </h3>
                  <ul className="flex flex-col gap-[21px] text-[18px] font-medium leading-6 max-sm:text-sm">
                    {g.l.map((x) => (
                      <li key={x}>
                        <FooterLink label={x} href={footerLinks[x] ?? "/"} className="hover:underline" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Address + socials */}
        <div className="mt-[150px] flex flex-wrap items-center justify-between gap-4 pb-[50px] text-[18px] font-medium leading-6 max-lg:mt-16">
          <span>535 Mission St, 14th floor, San Francisco, CA, 94105</span>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
            {socials.map((s) => (
              <FooterLink key={s} label={s} href={footerLinks[s] ?? "/"} className="hover:underline" />
            ))}
          </div>
        </div>
      </div>

      {/* Dark bottom bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0b0b0b] px-9 py-[30px] text-white max-md:px-5">
        <span className="text-[16px] text-white/70">
          © 2026 Higgsfield, Inc. All rights reserved.
        </span>
        <div className="flex flex-wrap items-center gap-x-[30px] gap-y-2 text-[16px] font-medium">
          <button
            type="button"
            className="flex items-center gap-2 text-white/80 hover:text-white"
          >
            <UsFlag />
            <span>English</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 3.5 5 6.5 8 3.5" />
            </svg>
          </button>
          {legal.map((x) => (
            <FooterLink key={x} label={x} href={footerLinks[x] ?? "/"} className="hover:underline" />
          ))}
        </div>
      </div>
    </footer>
  );
}



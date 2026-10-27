"use client";

import { useState } from "react";

/** Contextual help shown only with a Video Studio How it works panel. */
export function MoreAboutVideo() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="group absolute bottom-2 right-1 z-30"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <div
        id="video-studio-help"
        role="tooltip"
        className={`absolute bottom-11 right-0 w-[320px] max-w-[calc(100vw-3rem)] rounded-[20px] border border-white/[.08] bg-[#1b1d20] px-4 py-3 text-center shadow-[0_12px_40px_rgba(0,0,0,.6)] transition-opacity duration-150 ${open ? "visible opacity-100" : "invisible opacity-0"
          }`}
      >
        <p className="text-[13px] font-bold leading-5 text-white">
          More about Video
        </p>
        <p className="mt-1 text-[12px] font-medium leading-[18px] text-white/50">
          Explore settings, tips, and answers in our Help Center.{" "}
          <a
            href="https://higgsfield.ai/academy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white"
          >
            Learn more
          </a>
        </p>
      </div>
      <button
        type="button"
        aria-label="More about Video"
        aria-describedby={open ? "video-studio-help" : undefined}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="grid size-10 place-items-center rounded-full border border-white/[.08] bg-[#17191b] text-[14px] text-white/45 transition hover:border-white/[.16] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        ?
      </button>
    </div>
  );
}

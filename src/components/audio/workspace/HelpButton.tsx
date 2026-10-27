"use client";
import { useState } from "react";
import { HELP_TEXT } from "../config";
import { HelpIcon } from "../ui/Icons";
import { Popover } from "../ui/Popover";

export function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-end p-4">
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        placement="top"
        className="w-72"
        trigger={
          <button
            type="button"
            aria-label="More about Audio"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="inline-flex size-8 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#131416] text-white/60 transition-colors hover:text-white"
          >
            <HelpIcon className="size-4" />
          </button>
        }
      >
        <p className="text-sm leading-5 text-white/70">{HELP_TEXT}</p>
      </Popover>
    </div>
  );
}

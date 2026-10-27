"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Image as ImageIcon, X } from "lucide-react";
import { AuthDialog, type AuthMode } from "@/components/auth";

const img = (path: string) =>
  `https://higgsfield.ai/cdn-cgi/image/fit=scale-down,format=webp,onerror=redirect,width=384,quality=85/https://static.higgsfield.ai/soul2/${path}`;

const characterGood = ["good1.png", "good2.png", "good3.png", "good4.png"].map(
  img,
);
const characterBad = ["bad1.jpg", "bad2.jpg", "bad3.jpg", "bad4.jpg"].map(img);

function GuideRow({ good, images }: { good: boolean; images: string[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr] lg:items-center">
      <div className="px-4 lg:px-0">
        <span
          className={`grid size-[34px] place-items-center rounded-full ${
            good ? "bg-[#54cf58] text-[#102813]" : "bg-[#f12f38] text-[#25090b]"
          }`}
        >
          {good ? (
            <Check size={21} strokeWidth={3.5} />
          ) : (
            <X size={21} strokeWidth={3.5} />
          )}
        </span>
        <p className="mt-5 max-w-[270px] text-left text-[18px] font-bold leading-[1.5]">
          {good
            ? "20+ photos recommended: one person, clear face, multiple angles."
            : "Avoid: duplicates, group shots, filters, face coverings (masks/sunglasses)."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {images.map((src) => (
          <img
            key={src}
            src={src}
            alt="Character upload example"
            referrerPolicy="no-referrer"
            className={`aspect-[.9] w-full rounded-xl object-cover ${
              good ? "" : "border border-[#f12f38]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function CharacterUpload() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  return (
    <main className="min-h-[calc(100dvh-52px)] bg-black px-5 pb-20 pt-6 text-left text-white">
      <nav className="flex items-center gap-2 whitespace-nowrap text-left text-[14px] font-medium text-[#a7a9ac]">
        <Link href="/character" className="transition hover:text-white">
          Characters
        </Link>
        <span className="text-white/55">/</span>
        <span className="font-semibold text-white">New</span>
      </nav>

      <section className="mx-auto mt-9 max-w-[1000px] rounded-[14px] border border-white/10 bg-[#111315] p-1">
        <div className="grid h-[290px] place-items-center rounded-[10px] border border-dashed border-white/15 bg-[#1c1d1f]">
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-lime px-4 text-[16px] font-semibold text-black transition hover:brightness-105"
            >
              Upload
              <ImageIcon size={15} strokeWidth={2.4} />
            </button>
            <p className="mt-4 text-[14px] font-medium text-white/45">
              Upload 20+ photos for best results
            </p>
          </div>
        </div>

        <div className="space-y-10 px-4 py-6 pb-8">
          <GuideRow good images={characterGood} />
          <GuideRow good={false} images={characterBad} />
        </div>
      </section>

      {authMode && (
        <AuthDialog
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
        />
      )}
    </main>
  );
}

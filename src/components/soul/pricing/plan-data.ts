"use client";


export type PricingPlanId = "basic" | "pro" | "max" | "team";

export type Id = PricingPlanId;

export type TagKind = "res" | "lime" | "white" | "off" | "new";

export type Tag = { t: string; k: TagKind };

export type Row = { label: string; on?: boolean; info?: boolean; tags?: Tag[] };

export type SevenRow = Row & { gen?: boolean; glass?: boolean };

export const LIME = "#D1FE17";

export const PINK = "#ED1572";

export const BLUE = "#1544ED";

export const BORDER = "border-[rgba(217,217,217,0.04)]";

export const BASE_BG = "linear-gradient(rgb(29,31,32) 0%, rgb(23,25,27) 100%)";

export const SURFACE: Record<Id, string> = {
  basic: `radial-gradient(58% 220% at 3% 42%, rgba(255,255,255,0.094) 0%, rgba(255,255,255,0.035) 42%, rgba(255,255,255,0.01) 100%), ${BASE_BG}`,
  pro: `radial-gradient(56.49% 230.73% at 2.37% 40.91%, rgba(187,251,12,0.07) 0%, rgba(12,251,32,0.01) 100%), radial-gradient(41.8% 183.68% at 10.4% 53.71%, rgba(197,197,197,0.08) 0%, rgba(197,197,197,0.01) 100%), ${BASE_BG}`,
  max: `radial-gradient(56.49% 230.73% at 2.37% 40.91%, rgba(237,21,114,0.1) 0%, rgba(237,21,114,0.01) 100%), ${BASE_BG}`,
  team: `radial-gradient(56.49% 230.73% at 2.37% 40.91%, rgba(21,68,237,0.1) 0%, rgba(21,68,237,0.01) 100%), ${BASE_BG}`,
};

export const FRAME: Partial<Record<Id, string>> = {
  max: "radial-gradient(86.59% 115.91% at 50% 45.45%, rgb(251,57,140) 0%, rgb(237,21,114) 100%)",
  team: "radial-gradient(86.59% 115.91% at 50% 45.45%, rgb(36,94,241) 0%, rgb(21,68,237) 100%)",
};

export const BTN: Record<Id, { cls: string; shadow: string }> = {
  basic: {
    cls: "bg-white text-black",
    shadow:
      "rgba(0,0,0,0.1) 0px -3px 0px 0px inset, rgba(0,0,0,0.15) 10px 34px 24px 0px",
  },
  pro: {
    cls: "text-black",
    shadow:
      "rgb(209,254,23) 0px 1px 0px 0px inset, rgb(130,155,25) 0px -3px 0px 0px inset, rgba(0,0,0,0.15) 10px 34px 24px 0px",
  },
  max: {
    cls: "text-white",
    shadow:
      "rgb(237,21,114) 0px 1px 0px 0px inset, rgb(139,13,68) 0px -3px 0px 0px inset, rgba(0,0,0,0.15) 10px 34px 24px 0px",
  },
  team: {
    cls: "text-white",
    shadow:
      "rgb(36,94,241) 0px 1px 0px 0px inset, rgb(13,51,184) 0px -3px 0px 0px inset, rgba(0,0,0,0.15) 10px 34px 24px 0px",
  },
};

export const BTN_BG: Record<Id, string | undefined> = {
  basic: undefined,
  pro: LIME,
  max: PINK,
  team: BLUE,
};

export const META: Record<
  Id,
  { name: string; sub: string; off: string | null; seed: boolean }
> = {
  basic: {
    name: "Basic",
    sub: "For first-time AI content creators",
    off: null,
    seed: false,
  },
  pro: {
    name: "Pro",
    sub: "For consistent and easy AI content creation",
    off: "21% OFF",
    seed: false,
  },
  max: {
    name: "Max",
    sub: "For creators building AI projects",
    off: "25% OFF",
    seed: true,
  },
  team: {
    name: "Team",
    sub: "For agencies and small teams to create faster",
    off: "18% OFF",
    seed: true,
  },
};

export const PRICE: Record<Id, { m: number; a: number; save?: number }> = {
  basic: { m: 9, a: 9 },
  pro: { m: 29, a: 23, save: 72 },
  max: { m: 79, a: 59, save: 240 },
  team: { m: 79, a: 65, save: 168 },
};

export const STEPS: Partial<Record<Id, number[]>> = {
  pro: [600, 900],
  max: [1800, 3600, 5400],
};

export const UNL: Tag = { t: "UNLIMITED", k: "lime" };

export const G_LITE: SevenRow = {
  label: "Genjutsu Lite",
  gen: true,
  on: true,
  tags: [
    { t: "720p / 1080p", k: "res" },
    { t: "10 free gens", k: "lime" },
  ],
};

export const G_HIGGS: SevenRow = {
  label: "Higgsfield Genjutsu",
  gen: true,
  on: true,
  tags: [
    { t: "720p", k: "res" },
    { t: "3 free gens", k: "lime" },
  ],
};

export const SEVEN: Record<"basic" | "pro" | "max", SevenRow[]> = {
  basic: [
    G_LITE,
    {
      label: "Higgsfield Genjutsu",
      gen: true,
      on: false,
      tags: [{ t: "No free gens", k: "off" }],
    },
    { label: "Nano Banana 2" },
    { label: "Kling 3.0" },
    { label: "Nano Banana Pro" },
  ],
  pro: [
    G_LITE,
    G_HIGGS,
    {
      label: "Nano Banana 2",
      on: true,
      info: true,
      tags: [{ t: "2K", k: "res" }, UNL],
    },
    { label: "Kling 3.0", on: true, info: true, tags: [UNL] },
    { label: "Nano Banana Pro", tags: [{ t: "NO UNLIMITED", k: "off" }] },
  ],
  max: [
    G_LITE,
    G_HIGGS,
    {
      label: "Nano Banana 2",
      on: true,
      info: true,
      tags: [{ t: "2K", k: "res" }, UNL],
    },
    { label: "Kling 3.0", on: true, info: true, tags: [UNL] },
    {
      label: "Nano Banana Pro",
      on: true,
      info: true,
      tags: [{ t: "2K", k: "res" }, UNL],
    },
  ],
};

export const NEW: Tag = { t: "New", k: "new" };

export const FEATS: Record<"basic" | "pro" | "max", Row[]> = {
  basic: [
    {
      label: "Parallel generations: up to 2 Videos, 2 Images",
      on: true,
      info: true,
    },
    { label: "Access to Seedance 2.0 Fast & 2.0 Mini", on: true },
    { label: "Access to selected models & features", on: true, info: true },
    { label: "Early access to advanced AI features" },
    { label: "Access to unlimited marketplace" },
    { label: "Lowest cost per credit" },
  ],
  pro: [
    {
      label: "Unlimited paid parallel generations",
      on: true,
      info: true,
      tags: [NEW],
    },
    { label: "Access to all Seedance models", on: true },
    { label: "Access to all models & features", on: true, info: true },
    { label: "Early access to advanced AI features", on: true, info: true },
    { label: "Access to unlimited marketplace", on: true },
    { label: "Lowest cost per credit" },
  ],
  max: [
    {
      label: "Unlimited paid parallel generations",
      on: true,
      info: true,
      tags: [NEW],
    },
    { label: "Access to all Seedance models", on: true },
    { label: "Access to all models & features", on: true, info: true },
    { label: "Early access to advanced AI features", on: true, info: true },
    { label: "Access to unlimited marketplace", on: true },
    {
      label: "Lowest cost per credit",
      on: true,
      tags: [{ t: "60% cheaper", k: "lime" }],
    },
  ],
};

export const NAMES365 = [
  "Soul V2 & Cinema",
  "Seedream 5.0 Lite",
  "Flux.2 Pro (1K)",
  "Seedream 4.5",
  "Nano Banana",
  "Kling O1 Image",
  "GPT Image",
];

export const U365: Tag = { t: "365 UNLIMITED", k: "lime" };

export const ROWS365: Record<"basic" | "pro" | "max", Row[]> = {
  basic: NAMES365.map((label) => ({ label })),
  pro: NAMES365.map((label, i) => ({
    label,
    on: true,
    info: true,
    tags: [i === 0 ? { t: "5,000 FREE GENS", k: "white" } : U365],
  })),
  max: NAMES365.map((label, i) => ({
    label,
    on: true,
    info: true,
    tags:
      i === 0
        ? [{ t: "10,000 FREE GENS", k: "white" }]
        : i === 3
          ? [{ t: "4K", k: "res" }, U365]
          : [U365],
  })),
};

export const TEAM: { h: string; rows: Row[] }[] = [
  {
    h: "Workspace & Collaboration",
    rows: [
      "2 to 9 members in one shared workspace",
      "Parallel generations: up to 16 video & 16 image",
      "Access to all features & models",
      "Shared credit pool",
      "Shared workspace for your team",
      "Early access to advanced AI features",
      "Access to Seedance 2.0",
    ].map((label) => ({ label, on: true })),
  },
  {
    h: "Analytics & Support",
    rows: ["Basic analytics", "Priority support"].map((label) => ({
      label,
      on: true,
    })),
  },
  {
    h: "Admin & Control",
    rows: ["SSO", "Admin spend control", "Priority queue"].map((label) => ({
      label,
    })),
  },
  {
    h: "Security & Compliance",
    rows: [
      "Delegated top-up access",
      "Indemnification",
      "No training on your data",
      "SOC 2 security",
      "AI Educator & Slack support",
    ].map((label) => ({ label })),
  },
];

export const fmt = (n: number) => n.toLocaleString("en-US");

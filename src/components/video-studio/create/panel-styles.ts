export const DASHED_BORDER_BG_CLASS =
  "bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27100%25%27%20height=%27100%25%27%3E%3Crect%20x=%270.5%27%20y=%270.5%27%20width=%27calc(100%25%20-%201px)%27%20height=%27calc(100%25%20-%201px)%27%20rx=%278%27%20ry=%278%27%20fill=%27none%27%20stroke=%27rgba(255,255,255,0.05)%27%20stroke-width=%271%27%20stroke-dasharray=%274%204%27/%3E%3C/svg%3E')]";

export const DASHED_BORDER_VAR_CLASS =
  "[--form-kit-dashed-border:url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27100%25%27%20height=%27100%25%27%3E%3Crect%20x=%270.5%27%20y=%270.5%27%20width=%27calc(100%25%20-%201px)%27%20height=%27calc(100%25%20-%201px)%27%20rx=%278%27%20ry=%278%27%20fill=%27none%27%20stroke=%27rgba(255,255,255,0.05)%27%20stroke-width=%271%27%20stroke-dasharray=%274%204%27/%3E%3C/svg%3E')]";

export const GLASS_SHADOW =
  "shadow-[0_128.9px_36px_rgba(0,0,0,0),0_82.4px_33px_rgba(0,0,0,0.01),0_46.4px_28px_rgba(0,0,0,0.05),0_20.5px_20.5px_rgba(0,0,0,0.09),0_5px_11.3px_rgba(0,0,0,0.10),inset_0_-0.3px_5.36px_rgba(185,185,185,0.35)]";

export const OPTIONAL_PILL_CLASS =
  "[--q-tint:var(--hf-color-text-primary,var(--hf-color-brand-primary))] [--q-tint-bg:var(--hf-color-background-secondary-strong,var(--hf-color-brand-primary))] [--q-tint-fg:var(--hf-color-text-primary)] [--q-tint-border:var(--hf-color-border-strong,var(--hf-color-brand-primary))] pointer-events-none absolute right-2 top-2 z-10 inline-flex h-5 max-w-full items-center gap-1 rounded-q-100! bg-q-transparent-light-05! px-1.5! pb-1! pt-0.5! text-q-caption-xs-medium! text-q-text-secondary!";

export const FRAME_SLOT_CLASS =
  "relative size-full rounded-lg! border-0! p-2 data-[state=empty]:bg-(image:--form-kit-dashed-border) data-[state=dragging]:ring-1 data-[state=dragging]:ring-primary/70 md:bg-transparent! group-data-[disabled]:bg-none! group-data-[disabled]:opacity-80";

export const PILL_BUTTON_CLASS =
  "interactive-tap inline-grid h-6 w-6 items-center justify-center rounded-lg border border-white-6 bg-madi-black! text-caption-m font-medium text-white transition hover:bg-primary! hover:text-black focus-visible:ring-2 [&>svg]:size-3.5";

export const SETTING_BUTTON_CLASS =
  "flex h-13.5 w-full items-center justify-between gap-2 rounded-xl bg-white-5 px-3 py-2 transition-colors duration-150 hover:bg-white-8 outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-q-border-focus disabled:cursor-not-allowed disabled:opacity-50";

export const SETTING_LABEL_CLASS =
  "text-q-caption-sm-medium leading-4.5 text-font-secondary md:text-caption-m md:leading-4 md:text-text-secondary";

export const TAB_BASE_CLASS =
  "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-[9px] text-xs outline-none transition-colors focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-q-border-focus";

export const TAB_ACTIVE_CLASS = "font-semibold text-white";

export const TAB_INACTIVE_CLASS =
  "font-medium text-white/55 hover:text-white/80";

export const TAB_INDICATOR_CLASS =
  "pointer-events-none absolute top-[3px] h-8 w-[calc(50%-4px)] rounded-[9px] border border-[color-mix(in_srgb,var(--hf-color-brand-primary,#EFFE17)_35%,transparent)] bg-[color-mix(in_srgb,var(--hf-color-brand-primary,#EFFE17)_12%,transparent)] transition-[left] duration-200 ease-out";

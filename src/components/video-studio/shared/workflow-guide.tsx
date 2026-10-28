import type { ReactNode } from "react";

export function WorkflowGuide({ title, description, view = "grid", children }: { title: string; description?: string; view?: "grid" | "list"; children: ReactNode }) {
  return (
    <section className="mx-4 mt-1 flex min-h-full flex-col rounded-t-[28px] border border-white/[.08] bg-[#111315] px-10 pb-5 pt-[100px] max-md:px-4 max-md:py-10">
      <header className="mb-[52px] max-md:mb-8 flex shrink-0 flex-col items-center justify-center gap-3">
        <h1 className="text-center font-grotesk text-[40px] font-bold uppercase leading-none tracking-[-.04em] max-lg:text-[28px] max-md:text-[24px] max-md:leading-[1.1]">{title}</h1>
        {description && <p className="max-w-[700px] text-center text-sm text-white/55">{description}</p>}
      </header>
      <div className={`grid min-h-0 flex-1 gap-10 ${view === "grid" ? "grid-cols-3 max-md:mx-auto max-md:w-full max-md:max-w-[320px] max-md:grid-cols-1 max-md:gap-9" : "mx-auto w-full max-w-[410px] grid-cols-1"}`}>{children}</div>
    </section>
  );
}

export function WorkflowStepCard({ step, title, description, src, srcSet, video = false }: { step: string; title: string; description?: string; src: string; srcSet?: string; video?: boolean }) {
  return (
    <article className="flex min-w-0 flex-col items-center">
      <figure className="relative mx-auto mb-4 aspect-square w-full max-w-[410px] shrink-0 overflow-hidden rounded-[1.5rem] bg-white/[.03]">
        {video ? <video src={src} autoPlay muted loop playsInline disablePictureInPicture aria-label={title} className="absolute inset-0 size-full object-cover" /> : <img sizes="(max-width: 768px) 384px, (max-width: 1200px) 33vw, 15vw" src={src} srcSet={srcSet} alt={title} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />}
      </figure>
      <span className="flex w-full shrink-0 items-center justify-center"><p className="mx-auto rounded-md bg-white/[.05] px-2 py-1 text-xs text-white">{step}</p></span>
      <h2 className="mb-2 w-full shrink-0 text-center font-grotesk text-[16px] font-bold uppercase leading-5 text-white">{title}</h2>
      {description && <p className="w-full shrink-0 text-center text-sm leading-5 text-white/55">{description}</p>}
    </article>
  );
}

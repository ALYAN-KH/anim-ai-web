import Link from "next/link";

export function SoulId({ images, href }: { images: string[]; href: string }) {
  const [a, b, tiara, portrait, street, couch, shell] = images;

  const Tile = ({
    src,
    className = "",
  }: {
    src: string;
    className?: string;
  }) => (
    <div
      className={`relative overflow-hidden rounded-[clamp(12px,1.1vw,24px)] bg-[#eee] ${className}`}
    >
      <img
        src={src}
        alt="Soul ID character example"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );

  return (
    <div className="pb-[96px] pt-28 text-center">
      <h2 className="font-grotesk text-[clamp(28px,3.5vw,72px)] font-bold uppercase leading-[.92] tracking-[-.045em] text-[#111]">
        Character consistency with Soul ID
      </h2>
      <p className="mx-auto mt-5 max-w-[90vw] text-[15px] leading-[24px] text-[#6b6b6b] md:text-[clamp(15px,1.15vw,24px)] md:leading-[1.5]">
        Turn your photos into perfectly consistent, ultra-realistic images
        across any scene or setup
      </p>
      <Link
        href={href}
        className="mt-10 inline-flex h-[52px] items-center gap-[9px] rounded-[15px] bg-black px-[25px] text-[16px] font-semibold text-white transition hover:scale-[1.03]"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M5.5 2.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6L2 6l2.6-.9.9-2.6z" />
          <path d="M14.5 5l2.1 5.9 5.9 2.1-5.9 2.1-2.1 5.9-2.1-5.9L6.5 13l5.9-2.1L14.5 5z" />
        </svg>
        Create your character
      </Link>

      <div className="mx-auto mt-12 flex w-[92vw] flex-col gap-2 md:w-[71vw]">
        <div className="grid grid-cols-2 gap-2">
          <Tile src={a} className="aspect-[1.907]" />
          <Tile src={b} className="aspect-[1.907]" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-2">
            <Tile src={tiara} className="min-h-0 flex-[323]" />
            <Tile src={shell} className="min-h-0 flex-[158]" />
          </div>
          <div className="flex flex-col gap-2">
            <Tile src={portrait} className="min-h-0 flex-[240]" />
            <Tile src={couch} className="min-h-0 flex-[241]" />
          </div>
          <Tile src={street} className="aspect-[409/489]" />
        </div>
      </div>
    </div>
  );
}

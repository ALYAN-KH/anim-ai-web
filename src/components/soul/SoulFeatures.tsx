import Link from "next/link";

type Card = {
  title: string;
  text: string;
  image: string;
};

export function SoulFeatures({ cards, href }: { cards: Card[]; href: string }) {
  return (
    <>
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <p className="max-w-[720px] text-[18px] font-medium leading-[28px] text-[#111] md:text-[20px] md:leading-[32px]">
          Everything between a simple prompt and a scroll-stopping visual –
          presets, generation modes, and photorealistic output – all in one place
        </p>
        <Link
          href={href}
          className="inline-flex h-[54px] shrink-0 items-center gap-[15px] rounded-[18px] bg-black px-7 text-[18px] font-semibold text-white transition hover:scale-[1.03] md:h-[66px] md:px-8"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12h18M14 5l7 7-7 7" />
          </svg>
          Get started
        </Link>
      </div>

      <div className="mt-12 grid gap-x-[25px] gap-y-12 md:mt-[68px] md:grid-cols-2 md:gap-y-[72px]">
        {cards.map((card) => (
          <article key={card.title}>
            <div className="aspect-[1.815] overflow-hidden rounded-[28px] bg-[#efefef] md:rounded-[32px]">
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-[22px] text-[22px] font-medium leading-[1.2] tracking-[-.01em] text-[#111] md:text-[28px]">
              {card.title}
            </h3>
            <p className="mt-[10px] text-[15px] leading-6 text-[#767676] md:text-[16px]">
              {card.text}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}

import Link from "next/link";

export type BlogItem = readonly [title: string, image: string, href?: string];

export function SoulBlog({
  posts,
  blogHref = "/blog",
}: {
  posts: readonly BlogItem[];
  blogHref?: string;
}) {
  return (
    <section className="bg-[#0a0a0a] py-24 text-white md:py-[140px]">
      <div className="mx-auto grid w-[88vw] max-w-[1560px] items-stretch gap-10 lg:w-[82vw] lg:grid-cols-2 lg:gap-[70px]">
        {/* left: copy + button */}
        <div className="flex flex-col justify-between gap-10 lg:py-1">
          <div>
            <h2 className="font-grotesk text-[clamp(34px,3.4vw,64px)] font-bold uppercase leading-[1.1] tracking-[-.04em]">
              Get insights from
              <br />
              experts blog
            </h2>
            <p className="mt-8 max-w-[740px] text-[17px] leading-[1.5] text-[#8b8d8f] md:mt-9 md:text-[22px] md:leading-[33px]">
              Get the insights you need. Our experts share actionable hacks,
              break down the hottest topics, and provide essential how-to guides
              to help you build, optimize, and scale.
            </p>
          </div>

          <div>
            <Link
              href={blogHref}
              className="inline-flex h-14 items-center justify-center rounded-xl bg-white px-[14px] text-[20px] font-semibold text-black shadow-[0_4px_0_#b9b9b9] transition hover:brightness-95 active:translate-y-[2px] active:shadow-[0_2px_0_#b9b9b9]"
            >
              Read our blog
            </Link>
          </div>
        </div>

        <div
          className="flex min-w-0 snap-x snap-mandatory gap-[26px] overflow-x-auto pb-0"
          style={{ colorScheme: "dark" }}
        >
          {posts.map(([title, image, href]) => (
            <Link
              key={title}
              href={href ?? blogHref}
              className="group flex w-[min(505px,80vw)] shrink-0 snap-start flex-col self-start rounded-[32px] bg-[#111111] p-[3px] transition hover:bg-[#161616]"
            >
              <div className="aspect-[505/293] w-full overflow-hidden rounded-[29px] bg-white">
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="min-h-[70px] px-5 pb-6 pt-7 text-[22px] font-medium leading-[35px] text-white md:text-[26px]">
                {title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

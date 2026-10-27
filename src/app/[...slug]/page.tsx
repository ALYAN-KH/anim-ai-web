import Link from "next/link";
import { Header } from "@/components/layout";
export default async function P({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-8 md:p-14">
          <h1 className="text-4xl font-bold capitalize">
            {slug.join(" / ").replace(/-/g, " ")}
          </h1>
          <p className="mt-4 text-zinc-400">Placeholder route.</p>
          <Link className="btn mt-8" href="/">
            Back to Explore
          </Link>
        </div>
      </main>
    </>
  );
}

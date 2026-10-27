import type { GptImageExample } from "@/data/gptImageExamples";
import { CommunityGalleryCard } from "./CommunityGalleryCard";

export function GptImageCard({
  example,
  href,
}: {
  example: GptImageExample;
  href: string;
}) {
  return (
    <CommunityGalleryCard
      className="group/gpt-image !relative !overflow-hidden !rounded-[12px] !bg-[#202020]"
      href={href}
      item={{ ...example, label: `Image by ${example.creator}` }}
    />
  );
}



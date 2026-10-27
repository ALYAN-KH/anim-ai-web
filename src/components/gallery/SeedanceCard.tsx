import type { SeedanceExample } from "@/data/seedanceExamples";
import { CommunityGalleryCard } from "./CommunityGalleryCard";

type Props = { example: SeedanceExample; href: string; className: string };

export function SeedanceCard({ example, href, className }: Props) {
  return (
    <CommunityGalleryCard
      className={className}
      href={href}
      item={{
        image: example.poster,
        video: example.video,
        label: example.label,
        creator: example.creator,
        avatar: example.avatar,
        likes: example.likes,
        aspectRatio: example.aspectRatio,
      }}
    />
  );
}



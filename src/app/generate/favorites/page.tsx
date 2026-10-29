import type { Metadata } from "next";
import { MyFavorites } from "@/components/cinema-studio/MyFavorites";

export const metadata: Metadata = {
  title: "My favorites — Cinema Studio 4.0",
  description: "Your favorite generations from every project, in one place.",
};

export default function FavoritesPage() {
  return <MyFavorites />;
}

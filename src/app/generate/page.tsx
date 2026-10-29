import type { Metadata } from "next";
import { CinemaStudio } from "@/components/cinema-studio/CinemaStudio";

export const metadata: Metadata = {
  title: "Cinema Studio 4.0 — Direct Every Shot",
  description: "Higgsfield Cinema Studio: direct genre, era, camera, color and lighting for every shot.",
};

export default function GeneratePage({ searchParams }: { searchParams: { mode?: string } }) {
  return <CinemaStudio initialMode={searchParams.mode === "image" ? "image" : "video"} />;
}

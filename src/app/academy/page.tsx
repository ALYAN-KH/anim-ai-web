import type { Metadata } from "next";
import { Footer, Header } from "@/components/layout";
import { Academy } from "@/components/academy/Academy";

export const metadata: Metadata = {
  title: "Academy | Higgsfield",
  description: "Explore best ways to learn about AI. Everything you need to begin using the platform.",
};

export default function AcademyPage() {
  return (
    <>
      <Header />
      <Academy />
      <Footer />
    </>
  );
}

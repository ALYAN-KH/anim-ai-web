import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { KatanaStudio } from "@/components/katana/KatanaStudio";

export const metadata: Metadata = {
  title: "Katana | Recreate the edit with Higgsfield",
};

export default function KatanaPage() {
  return (
    <div className="katana-page flex h-dvh min-h-0 flex-col overflow-hidden">
      <Header forceCompact />
      <KatanaStudio />
    </div>
  );
}

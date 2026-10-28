import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { ContentFactoryStudio } from "@/components/content-factory/ContentFactoryStudio";

export const metadata: Metadata = {
  title: "Content Factory | Generate viral faceless short videos with Higgsfield MCP",
};

export default function ContentFactoryPage() {
  return (
    <>
      <Header forceCompact />
      <ContentFactoryStudio />
    </>
  );
}

import type { Metadata } from "next";
import { MyElements } from "@/components/cinema-studio/MyElements";

export const metadata: Metadata = {
  title: "My Elements — Cinema Studio 4.0",
  description: "Characters, locations and props you reuse consistently across every project.",
};

export default function ElementsPage() {
  return <MyElements />;
}

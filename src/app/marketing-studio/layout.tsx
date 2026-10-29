import { MarketingStudio } from "@/components/marketing-studio/MarketingStudio";

// Shared by /marketing-studio, /generations and /favorites so moving between them keeps the same shell mounted.
export default function MarketingStudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MarketingStudio />
    </>
  );
}

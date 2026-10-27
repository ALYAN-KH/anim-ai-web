import type { Metadata } from "next";
import "./globals.css";
import "./styles/navigation.css";
import "./styles/galleries.css";
import "./styles/canvas.css";
import "./styles/image-studio.css";
import "./styles/video-studio.css";
import { Providers } from "@/components/layout";

const title = "Higgsfield AI — AI-native creative suite";
const description =
  "Higgsfield combines cinematic intelligence with one unified creative workflow, so creators, marketing agencies and filmmakers can produce cinematic-quality video and visuals at any scale.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "Higgsfield AI",
  icons: {
    icon: [{ url: "/higgsfield-favicon.svg", type: "image/svg+xml" }],
    shortcut: "/higgsfield-favicon.svg",
  },
  keywords: [
    "Higgsfield",
    "Higgsfield AI",
    "AI video generator",
    "AI image generator",
    "cinematic AI video",
    "AI creative suite",
  ],
  openGraph: {
    type: "website",
    siteName: "Higgsfield AI",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};
export default function L({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-z_ugVDsbsOO5mZOO.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-E1YLuCUgMSHbtIGp.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-s4gVVUdnEnLwSIzd.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-v2IlITZYB7Bne3xI.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-mY5KM0Oc_ZtnvvTL.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-dgacuv-uC6qF5eMK.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-_-k8dMBGpNL7CGL4.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-vBfuva7Ya2N2ez0e.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-jR28g5ewL6SfHlYp.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-YAgEB4r_H6wD58TW.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-mlSkBlGhiqFYyi3t.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-BuyzeC2SU5O_TzNE.css"
        />
        <link
          rel="stylesheet"
          href="https://assets.higgsfield.ai/tanstack/assets/868a8dba-MRX-FsI-uA-n4rk4.css"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

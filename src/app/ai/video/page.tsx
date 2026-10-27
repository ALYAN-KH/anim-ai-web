import { Header, TopBar } from "@/components/layout";
import { VideoStudio } from "@/components/video-studio";

export default function VideoPage() {
  return (
    <>
      <TopBar studioCompact />
      <Header forceCompact studioHeight />
      <VideoStudio />
    </>
  );
}

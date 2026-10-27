import { videoStudioMedia } from "../data";
import { WorkflowGuide, WorkflowStepCard } from "../shared/workflow-guide";

export interface MediaVideoProps { src: string; className?: string; ariaLabel?: string }
export interface StepCardProps { kind: "image" | "preset" | "result"; title: string; text?: string }
const STEPS = {
  image: { step: "Step 1", src: videoStudioMedia.addImage, title: "Add image", text: "Upload or generate an image to start your animation" },
  preset: { step: "Step 2", src: videoStudioMedia.choosePreset, title: "Choose preset", text: "Pick a preset to control your image movement" },
  result: { step: "Step 3", src: videoStudioMedia.result, title: "Get video", text: "Click generate to create your final animated video!" },
};
export function StepCard({ kind, title, text }: StepCardProps) {
  const media = STEPS[kind];
  return <WorkflowStepCard step={media.step} title={title} description={text} src={media.src} video={kind !== "image"} />;
}
export interface CreateVideoContentProps { view?: "list" | "grid" }
export function CreateVideoContent({ view = "grid" }: CreateVideoContentProps = {}) {
  return <WorkflowGuide title="Make videos in one click" description="250+ presets for camera control, framing, and high-quality VFX - or use the general preset for manual control." view={view}>
    {(["image", "preset", "result"] as const).map(kind => <StepCard key={kind} kind={kind} title={STEPS[kind].title} text={STEPS[kind].text} />)}
  </WorkflowGuide>;
}

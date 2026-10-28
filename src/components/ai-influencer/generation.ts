// Generation service boundary. This project has no generation backend or session, so requests
// are only sent when NEXT_PUBLIC_AI_INFLUENCER_API is configured; otherwise the caller is told
// that sign-in is required, matching the reference for signed-out visitors.
import type { MotionMode, Quality, Selection, TierId } from "./data";

export type InfluencerSheetRequest = {
  job_set_type: "ai_influencer_sheet";
  params: { tier: TierId; selection: Selection; medias: File[]; style_references: File[]; batch_size: number };
};

export type MotionRequest = {
  job_set_type: "ai_influencer_motion_control" | "ai_influencer_replace_object";
  params: {
    model: string;
    quality: Quality;
    prompt: string | null;
    reference_video: File | string;
    reference_images: (File | string)[];
  };
};

export type GenerationRequest = InfluencerSheetRequest | MotionRequest;
export type GenerationResult =
  | { status: "auth_required" }
  | { status: "queued"; jobId: string }
  | { status: "error"; message: string };

export function motionJobType(mode: MotionMode): MotionRequest["job_set_type"] {
  return mode === "swap" ? "ai_influencer_replace_object" : "ai_influencer_motion_control";
}

function toFormData(request: GenerationRequest) {
  const form = new FormData();
  const params: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(request.params)) {
    const list = Array.isArray(value) ? value : [value];
    if (list.some((v) => v instanceof File)) list.forEach((v, i) => (v instanceof File ? form.append(`${key}[${i}]`, v) : (params[`${key}[${i}]`] = v)));
    else params[key] = value;
  }
  form.append("job_set_type", request.job_set_type);
  form.append("params", JSON.stringify(params));
  return form;
}

export async function submitGeneration(request: GenerationRequest): Promise<GenerationResult> {
  const endpoint = process.env.NEXT_PUBLIC_AI_INFLUENCER_API;
  if (!endpoint) return { status: "auth_required" };
  try {
    const response = await fetch(endpoint, { method: "POST", body: toFormData(request), credentials: "include" });
    if (response.status === 401 || response.status === 403) return { status: "auth_required" };
    if (!response.ok) return { status: "error", message: `Generation failed (${response.status}).` };
    const body = (await response.json()) as { id?: string; job_id?: string };
    const jobId = body.job_id ?? body.id;
    return jobId ? { status: "queued", jobId } : { status: "error", message: "The generation service returned no job id." };
  } catch {
    return { status: "error", message: "Could not reach the generation service." };
  }
}

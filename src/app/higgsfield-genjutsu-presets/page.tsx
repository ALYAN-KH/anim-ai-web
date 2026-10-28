import { redirect } from "next/navigation";

/** Keep previously shared preset links connected to the existing Genjutsu library. */
export default function GenjutsuPresetsPage() {
  redirect("/ai/video?model=genjutsu");
}

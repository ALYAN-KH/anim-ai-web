import { redirect } from "next/navigation";

/** The preset library lives in the effects studio, which lists every effect. */
export default function EffectsPage() {
  redirect("/effects/use");
}

"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { modeFromParam, modelIdFromParam, paramFromMode } from "../config";
import type { AudioMode } from "../types";

export function useAudioRoute() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const mode = modeFromParam(params.get("voiceMode"));
  const modelParam = modelIdFromParam(params.get("audioModel"));

  const setMode = useCallback(
    (next: AudioMode) => {
      const query = new URLSearchParams(params.toString());
      query.set("voiceMode", paramFromMode(next));
      router.replace(`${pathname}?${query.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  return { mode, modelParam, setMode };
}

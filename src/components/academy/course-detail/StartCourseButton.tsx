"use client";

import { useCallback, useState } from "react";
import { AuthDialog } from "@/components/auth";
import type { AuthMode } from "@/components/auth/auth";
import icons from "../course-detail-icons.json";

/** Starting a course needs an account, so the button opens the shared login dialog. */
export function StartCourseButton() {
  const [mode, setMode] = useState<AuthMode | null>(null);
  const close = useCallback(() => setMode(null), []);
  return <>
    <button type="button" onClick={() => setMode("login")} className="q-button q-button-primary q-button-md w-full text-q-label-md-semi-bold!">
      <span className="q-button-label-frame">Start course</span>
      <span aria-hidden="true" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: icons.arrow }} />
    </button>
    {mode && <AuthDialog mode={mode} onModeChange={setMode} onClose={close} />}
  </>;
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthDialog } from "./AuthDialog";
import type { AuthMode } from "./auth";

/** Use the existing auth form when a marketing link opens /signup directly. */
export function Signup() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signup");

  useEffect(() => setMounted(true), []);

  return mounted ? (
    <AuthDialog mode={mode} onModeChange={setMode} onClose={() => router.push("/")} />
  ) : null;
}

"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";
export function Providers({ children }: { children: React.ReactNode }) {
  const s = useRef(makeStore());
  return <Provider store={s.current}>{children}</Provider>;
}



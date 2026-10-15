"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import type { Onboarding } from "./useOnboarding";

export const OnboardingContext = createContext<{ ob: Onboarding; focusOnMount: boolean } | null>(null);

export function useOb(): Onboarding {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOb must be used inside <OnboardingFlow>");
  return ctx.ob;
}

/** Ref for a step's heading; focused when the step appears after a navigation (not on first load). */
export function useStepFocus<T extends HTMLElement>() {
  const ctx = useContext(OnboardingContext);
  const ref = useRef<T>(null);
  const focus = ctx?.focusOnMount ?? false;
  useEffect(() => {
    if (focus) ref.current?.focus({ preventScroll: false });
  }, [focus]);
  return ref;
}

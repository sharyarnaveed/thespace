"use client";

import { useCallback, useReducer } from "react";
import { DEFAULT_AVATAR } from "./avatars";
import { CREATE_FIELDS, JOIN_FIELDS, initialData, stepsFor, type OnboardingData, type OnboardingMode, type StepId } from "./model";
import { hasErrors, validateStep, type Errors } from "./validation";

/**
 * Single source of truth for onboarding: shared data, the current branch and
 * step, and validation errors. Everything lives in memory; only the final
 * "enter the office" action copies the needed answers to sessionStorage.
 *
 * `step` is -1 on the "choose your path" screen, otherwise an index into the
 * current branch's step list.
 */
type State = {
  data: OnboardingData;
  step: number;
  errors: Errors;
  direction: 1 | -1;
  /** True after the first navigation; used to move focus to each new step's heading. */
  moved: boolean;
};

type Action =
  | { type: "choose"; mode: OnboardingMode }
  | { type: "set"; patch: Partial<OnboardingData> }
  | { type: "errors"; errors: Errors }
  | { type: "next" }
  | { type: "back" }
  | { type: "restart" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "choose": {
      const prev = state.data.mode;
      // Switching branches wipes the other branch's answers so they can never
      // leak into this one. Shared answers (name, avatar) are kept.
      const reset = prev && prev !== action.mode ? (prev === "create" ? { ...CREATE_FIELDS, invitationEmails: [], officeFeatures: [] } : JOIN_FIELDS) : {};
      return {
        data: { ...state.data, ...reset, mode: action.mode },
        step: 0,
        errors: {},
        direction: 1,
        moved: true,
      };
    }
    case "set": {
      const errors = { ...state.errors };
      for (const k of Object.keys(action.patch) as (keyof OnboardingData)[]) delete errors[k];
      return { ...state, data: { ...state.data, ...action.patch }, errors };
    }
    case "errors":
      return { ...state, errors: action.errors };
    case "next": {
      if (!state.data.mode) return state;
      const steps = stepsFor(state.data.mode);
      return { ...state, step: Math.min(state.step + 1, steps.length - 1), errors: {}, direction: 1, moved: true };
    }
    case "back":
      // Answers are kept on the way back; only stale errors are cleared.
      return { ...state, step: Math.max(state.step - 1, -1), errors: {}, direction: -1, moved: true };
    case "restart":
      // Back to "choose your path". Answers stay until a different path is picked.
      return { ...state, step: -1, errors: {}, direction: -1, moved: true };
  }
}

export function useOnboarding() {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    data: initialData(DEFAULT_AVATAR),
    step: -1,
    errors: {},
    direction: 1 as const,
    moved: false,
  }));

  const { data, step } = state;
  const steps = data.mode ? stepsFor(data.mode) : null;
  const stepId: StepId | null = steps && step >= 0 ? steps[step].id : null;

  const set = useCallback((patch: Partial<OnboardingData>) => dispatch({ type: "set", patch }), []);
  const choose = useCallback((mode: OnboardingMode) => dispatch({ type: "choose", mode }), []);
  const back = useCallback(() => dispatch({ type: "back" }), []);
  const restart = useCallback(() => dispatch({ type: "restart" }), []);
  const setErrors = useCallback((errors: Errors) => dispatch({ type: "errors", errors }), []);

  /** Validate the current step; advance only if it passes. Returns whether it did. */
  const next = useCallback(() => {
    if (!stepId) return false;
    const errors = validateStep(stepId, data);
    if (hasErrors(errors)) {
      dispatch({ type: "errors", errors });
      return false;
    }
    dispatch({ type: "next" });
    return true;
  }, [stepId, data]);

  return { ...state, steps, stepId, set, choose, next, back, restart, setErrors };
}

export type Onboarding = ReturnType<typeof useOnboarding>;

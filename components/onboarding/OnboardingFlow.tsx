"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building2, DoorOpen } from "lucide-react";
import Link from "next/link";
import { BRAND } from "@/components/landing/brand";
import { Logo } from "@/components/landing/Logo";
import { MotionProvider } from "@/components/motion/Motion";
import { ChoosePath } from "./ChoosePath";
import { OnboardingContext } from "./context";
import { CREATE_STEP_VIEWS } from "./CreateSteps";
import { JOIN_STEP_VIEWS } from "./JoinSteps";
import type { CreateStepId, JoinStepId } from "./model";
import { useOnboarding, type Onboarding } from "./useOnboarding";

const EASE = [0.22, 1, 0.36, 1] as const;

/** One onboarding system, two branches: create a workspace, or join one with a code. */
export function OnboardingFlow() {
  const ob = useOnboarding();
  const key = ob.stepId ? `${ob.data.mode}-${ob.stepId}` : "choose";

  let view;
  if (!ob.data.mode || !ob.stepId) view = <ChoosePath />;
  else if (ob.data.mode === "create") view = CREATE_STEP_VIEWS[ob.stepId as CreateStepId]();
  else view = JOIN_STEP_VIEWS[ob.stepId as JoinStepId]();

  return (
    <MotionProvider>
      <OnboardingContext value={{ ob, focusOnMount: ob.moved }}>
        <main className="min-h-dvh bg-sage/45 px-4 py-5 font-display sm:px-6 sm:py-10">
          <div className="mx-auto w-full max-w-5xl border-2 border-ink bg-paper-light shadow-[8px_8px_0_0_var(--color-ink)]">
            <header className="flex flex-col gap-4 border-b-2 border-ink bg-paper px-5 py-4 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link href="/" aria-label={`${BRAND.name} home`} className="inline-flex rounded-sm">
                  <Logo />
                </Link>
                {ob.data.mode && ob.stepId && <BranchBadge ob={ob} />}
              </div>
              {ob.steps && ob.stepId && <Progress ob={ob} />}
            </header>

            <div className="overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
              <AnimatePresence mode="wait" initial={false} custom={ob.direction}>
                <motion.div
                  key={key}
                  custom={ob.direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 28 }),
                    center: { opacity: 1, x: 0 },
                    exit: (d: number) => ({ opacity: 0, x: d * -28 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: EASE }}
                >
                  {view}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <p className="mx-auto mt-5 max-w-5xl text-center font-mono text-xs text-ink/70">
            Prototype · your answers stay in this browser tab and are cleared when you close it.
          </p>
        </main>
      </OnboardingContext>
    </MotionProvider>
  );
}

function BranchBadge({ ob }: { ob: Onboarding }) {
  const create = ob.data.mode === "create";
  const Icon = create ? Building2 : DoorOpen;
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-1.5 border-2 border-ink bg-sun px-2.5 py-1 font-pixel text-[0.65rem] uppercase tracking-widest text-ink">
        <Icon className="size-3.5" aria-hidden />
        {create ? "Creating a workspace" : "Joining a workspace"}
      </span>
      <button
        type="button"
        onClick={ob.restart}
        className="text-sm font-semibold text-forest underline decoration-2 underline-offset-2 hover:text-terracotta"
      >
        Change path
      </button>
    </div>
  );
}

function Progress({ ob }: { ob: Onboarding }) {
  const steps = ob.steps!;
  const current = ob.step;
  return (
    <nav aria-label="Onboarding progress">
      <p className="mb-2 font-mono text-xs text-muted" aria-live="polite">
        Step {current + 1} of {steps.length} · <span className="text-ink">{steps[current].label}</span>
      </p>
      <ol className="flex gap-1.5">
        {steps.map((s, i) => (
          <li key={s.id} className="flex-1" aria-current={i === current ? "step" : undefined}>
            <span className="sr-only">
              {s.label}
              {i < current ? " (done)" : i === current ? " (current)" : ""}
            </span>
            <span
              aria-hidden
              className={`block h-2.5 border-2 border-ink transition-colors duration-300 ${
                i < current ? "bg-forest" : i === current ? "bg-sun" : "bg-paper-light"
              }`}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}

"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND } from "@/components/landing/brand";
import { useOb, useStepFocus } from "./context";
import { CH, CW, CreateIllustration, JoinIllustration } from "./illustrations";
import { PhaserStage } from "./phaser/PhaserStage";
import type { OnboardingMode } from "./model";
import { StepHeading } from "./ui";

export function ChoosePath() {
  const { data, choose } = useOb();
  const heading = useStepFocus<HTMLHeadingElement>();
  return (
    <div className="flex flex-col gap-8">
      <StepHeading ref={heading} eyebrow="Let’s get you settled" title={`What brings you to ${BRAND.name}?`}>
        <p>Every little office starts somewhere. Choose your way in.</p>
      </StepHeading>

      <div className="grid gap-6 md:grid-cols-2">
        <PathCard
          mode="create"
          selected={data.mode === "create"}
          onChoose={choose}
          illustration={
            <PhaserStage script="create" w={CW} h={CH}>
              <CreateIllustration />
            </PhaserStage>
          }
          title="Create a workspace"
          description="Build a cozy virtual office for your team, invite your people, and make it your own."
          action="Create my workspace"
        />
        <PathCard
          mode="join"
          selected={data.mode === "join"}
          onChoose={choose}
          illustration={
            <PhaserStage script="join" w={CW} h={CH}>
              <JoinIllustration />
            </PhaserStage>
          }
          title="Join a workspace"
          description="Already have an office? Join your teammates with an invitation code."
          action="Join with a code"
        />
      </div>

      <div className="border-t-2 border-dashed border-ink/20 pt-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-sm px-1 py-1 text-sm font-semibold text-forest underline-offset-4 hover:text-terracotta hover:underline"
        >
          <ArrowRight className="size-4 rotate-180" aria-hidden />
          Back to home
        </Link>
      </div>
    </div>
  );
}

function PathCard({
  mode,
  selected,
  onChoose,
  illustration,
  title,
  description,
  action,
}: {
  mode: OnboardingMode;
  selected: boolean;
  onChoose: (m: OnboardingMode) => void;
  illustration: ReactNode;
  title: string;
  description: string;
  action: string;
}) {
  const id = `path-${mode}`;
  return (
    <article
      aria-labelledby={`${id}-title`}
      className={`group relative flex flex-col border-2 border-ink transition-[transform,box-shadow,background-color] duration-200 ease-soft hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--color-ink)] has-[:focus-visible]:-translate-y-1 has-[:focus-visible]:shadow-[8px_8px_0_0_var(--color-ink)] ${
        selected ? "bg-sun/40 shadow-[8px_8px_0_0_var(--color-forest)]" : "bg-paper shadow-[5px_5px_0_0_var(--color-ink)]"
      }`}
    >
      <div className="border-b-2 border-ink bg-paper-light">{illustration}</div>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-[-0.02em] text-ink">
            {title}
          </h2>
          {selected && (
            <span className="inline-flex shrink-0 items-center gap-1 border-2 border-ink bg-forest px-2 py-0.5 font-pixel text-[0.6rem] uppercase tracking-widest text-paper">
              <Check className="size-3" strokeWidth={3} aria-hidden />
              Your pick
            </span>
          )}
        </div>
        <p id={`${id}-desc`} className="text-ink/75">
          {description}
        </p>
        <button
          type="button"
          onClick={() => onChoose(mode)}
          aria-describedby={`${id}-desc`}
          className={`mt-auto inline-flex items-center justify-center gap-2 self-start border-2 border-ink px-5 py-3 font-semibold shadow-pixel-sm transition-colors after:absolute after:inset-0 after:content-[''] focus-visible:outline-none ${
            mode === "create" ? "bg-forest text-paper" : "bg-terracotta text-ink"
          }`}
        >
          {action}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </button>
      </div>
    </article>
  );
}

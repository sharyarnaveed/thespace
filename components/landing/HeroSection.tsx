import { ArrowDownRight, ArrowRight, Music, Users } from "lucide-react";
import { PixelImage } from "@/components/pixel/PixelArt";
import { bust } from "@/components/pixel/props";
import { OfficeScene } from "@/components/scene/OfficeScene";
import { Float, MaskLine, Press, Reveal } from "@/components/motion/Motion";
import { RetroWindow } from "./RetroWindow";
import { SceneScroller } from "./SceneScroller";
import { EARLY_ACCESS } from "./links";
import { BRAND } from "./brand";

const PRESENT = [bust("long", "maya"), bust("short", "theo"), bust("beanie", "juno"), bust("bun", "sam")];

export function HeroSection() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative mx-auto max-w-[1440px] px-5 pb-20 pt-6 sm:px-8 lg:px-12">
      {/* editorial meta row */}
      <Reveal y={8} className="flex items-center gap-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
        <span>Vol. 01</span>
        <span className="rule-dotted h-2 flex-1" aria-hidden />
        <span className="hidden sm:inline">A virtual office for remote teams</span>
        <span className="rule-dotted hidden h-2 flex-1 sm:block" aria-hidden />
        <span>Early access · 2026</span>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <h1 id="hero-title" className="text-ink">
            <MaskLine delay={0.15} className="font-condensed text-[clamp(3.4rem,17vw,8rem)] lg:text-[clamp(3.4rem,11vw,10.5rem)] font-black uppercase leading-[0.8] tracking-[-0.02em]">
              Your team,
            </MaskLine>
            <MaskLine delay={0.3} className="-mt-1 font-display text-[clamp(3.4rem,17vw,8rem)] font-semibold lg:text-[clamp(3.4rem,11vw,10.5rem)] leading-[0.9] tracking-[-0.055em] text-forest">
              <span className="relative inline-block pr-[0.1em]">
                together.
                <span
                  aria-hidden
                  className="absolute -right-[0.18em] top-[0.12em] hidden size-[0.16em] bg-sun shadow-[0.04em_0.04em_0_0_var(--color-ink)] sm:block"
                />
              </span>
            </MaskLine>
          </h1>
        </div>

        <div className="flex flex-col justify-end lg:col-span-4 lg:pb-4">
          <Reveal delay={0.45}>
            <p className="max-w-md text-lg leading-relaxed text-ink/85 lg:text-[1.15rem]">
              {BRAND.name} is a cozy virtual workspace where your remote team can actually{" "}
              <em className="font-semibold text-forest">be</em> together. Walk over to a
              teammate, pull up a chair in the lounge, and let the small, spontaneous moments of office life come back.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Press>
                <a
                  href={EARLY_ACCESS}
                  className="group inline-flex items-center gap-2 border-2 border-ink bg-forest px-5 py-3.5 font-semibold text-paper shadow-pixel transition-colors hover:bg-forest-deep"
                >
                  Find your little office
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </a>
              </Press>
              <Press>
                <a
                  href="#spaces"
                  className="group inline-flex items-center gap-2 border-2 border-transparent px-3 py-3.5 font-semibold text-ink underline decoration-ink/30 decoration-2 underline-offset-[6px] transition-colors hover:decoration-terracotta"
                >
                  Take a look around
                  <ArrowDownRight className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
                </a>
              </Press>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2" aria-hidden>
                {PRESENT.map((b, i) => (
                  <span key={i} className="inline-block size-9 overflow-hidden border-2 border-ink bg-paper-deep">
                    <PixelImage frame={b.frame} palette={b.palette} className="mt-0.5 w-full" />
                  </span>
                ))}
              </div>
              <p className="font-mono text-xs leading-snug text-muted">
                Maya, Theo, Juno &amp; Sam
                <br />
                are already in the office.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* the office */}
      <Reveal delay={0.35} y={40} className="relative mt-14 lg:mt-16">
        <Float className="absolute -top-7 left-4 z-10 hidden md:block lg:left-10" rotate={-3} delay={1.4}>
          <span className="inline-block border-2 border-ink bg-sun px-3 py-1.5 font-pixel text-xs uppercase shadow-pixel-sm">
            ↙ walk over &amp; say hi
          </span>
        </Float>
        <Float className="absolute -top-6 right-6 z-10 hidden md:block lg:right-16" rotate={2} delay={1.8} distance={5}>
          <span className="inline-flex items-center gap-2 border-2 border-ink bg-paper-light px-3 py-1.5 font-mono text-xs shadow-pixel-sm">
            <Music className="size-3.5 text-terracotta" aria-hidden /> lo-fi radio · side A
          </span>
        </Float>

        <RetroWindow
          className="shadow-[8px_8px_0_0_var(--color-forest)]"
          title={`${BRAND.domain} — studio, 2nd floor`}
          right={
            <>
              <Users className="size-3.5" aria-hidden />
              <span>5 here</span>
              <span className="size-2 animate-pulse bg-forest" aria-hidden />
            </>
          }
          footer={
            <>
              <span className="inline-flex items-center gap-1.5">
                <Music className="size-3.5" aria-hidden /> Now playing: Sunday Morning Tape
              </span>
              <span className="hidden sm:inline">Tue · 10:42</span>
              <span className="ml-auto hidden items-center gap-1.5 md:inline-flex">
                <kbd className="border border-ink/60 bg-paper-light px-1.5 font-pixel text-[0.6rem]">W A S D</kbd> walk
                <kbd className="ml-2 border border-ink/60 bg-paper-light px-1.5 font-pixel text-[0.6rem]">E</kbd> wave
              </span>
            </>
          }
        >
          <SceneScroller>
            <OfficeScene />
          </SceneScroller>
        </RetroWindow>

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 font-mono text-[0.72rem] text-muted">
          <p>
            <span className="text-ink">Fig. 01</span> — The studio floor on a slow Tuesday morning.
          </p>
          <p className="sm:hidden">← drag to look around →</p>
          <p className="hidden sm:block">Illustrated preview · not live data</p>
        </div>
      </Reveal>
    </section>
  );
}

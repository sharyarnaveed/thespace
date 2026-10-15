import { NightWindowScene } from "@/components/scene/NightWindowScene";
import { Reveal } from "@/components/motion/Motion";
import { EarlyAccessForm } from "./EarlyAccessForm";
import { SectionLabel } from "./SectionLabel";

export function FinalCTA() {
  return (
    <section id="early-access" aria-labelledby="cta-title" className="relative bg-ink text-paper">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-12 lg:py-32">
        <Reveal className="lg:col-span-6">
          <SectionLabel index="05" light>
            Early access
          </SectionLabel>
          <h2 id="cta-title" className="mt-8 font-display text-[clamp(2.8rem,5.6vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            Make remote work feel a little more like <em className="text-sun">being there.</em>
          </h2>
          <p className="mt-6 font-condensed text-2xl font-bold uppercase tracking-wide text-sage">Bring your people together, one pixel at a time.</p>
          <EarlyAccessForm />
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-6">
          <div className="border-2 border-paper/80 shadow-[10px_10px_0_0_var(--color-terracotta)]">
            <NightWindowScene />
          </div>
          <p className="mt-4 text-right font-mono text-[0.72rem] text-paper/55">Fig. 05 — Still glowing, a little after six.</p>
        </Reveal>
      </div>
    </section>
  );
}
